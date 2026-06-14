import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"
import { tfaToken } from "@/lib/tfa"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"

const RP_ID = process.env.NODE_ENV === "production" ? "krixishere.org" : "localhost"
const ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://krixishere.org"
    : "http://localhost:3000"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { response } = await req.json()
  const supabase = getSupabase()

  // Retrieve stored challenge
  const { data: challengeRow } = await supabase
    .from("passkey_challenges")
    .select("challenge, created_at")
    .eq("user_id", session.user.discordId)
    .single()

  if (!challengeRow) {
    return NextResponse.json({ error: "No challenge found. Please try again." }, { status: 400 })
  }

  const createdAt = new Date(challengeRow.created_at).getTime()
  if (Date.now() - createdAt > 5 * 60 * 1000) {
    await supabase.from("passkey_challenges").delete().eq("user_id", session.user.discordId)
    return NextResponse.json({ error: "Challenge expired. Please try again." }, { status: 400 })
  }

  // Find the matching passkey by credential ID
  const credentialIdB64 = response.id
  const { data: passkey } = await supabase
    .from("passkeys")
    .select("*")
    .eq("user_id", session.user.discordId)
    .eq("credential_id", credentialIdB64)
    .single()

  if (!passkey) {
    return NextResponse.json({ error: "Passkey not found." }, { status: 400 })
  }

  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: Buffer.from(passkey.credential_id, "base64url"),
        credentialPublicKey: Buffer.from(passkey.public_key, "base64url"),
        counter: passkey.counter,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  if (!verification.verified) {
    return NextResponse.json({ error: "Verification failed." }, { status: 400 })
  }

  // Update counter to prevent replay attacks
  await supabase
    .from("passkeys")
    .update({ counter: verification.authenticationInfo.newCounter })
    .eq("credential_id", credentialIdB64)

  // Clean up challenge
  await supabase.from("passkey_challenges").delete().eq("user_id", session.user.discordId)

  // Set 2FA verified cookie — HMAC-signed with discordId so it's account-bound
  const res = NextResponse.json({ success: true })
  res.cookies.set("x-tfa", tfaToken(session.user.discordId!), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  })
  return res
}
