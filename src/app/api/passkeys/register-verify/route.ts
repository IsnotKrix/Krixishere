import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"
import { verifyRegistrationResponse } from "@simplewebauthn/server"

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

  const body = await req.json()
  const { response, deviceName } = body

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

  // Reject stale challenges (> 5 minutes old)
  const createdAt = new Date(challengeRow.created_at).getTime()
  if (Date.now() - createdAt > 5 * 60 * 1000) {
    await supabase.from("passkey_challenges").delete().eq("user_id", session.user.discordId)
    return NextResponse.json({ error: "Challenge expired. Please try again." }, { status: 400 })
  }

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challengeRow.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "Verification failed." }, { status: 400 })
  }

  const { credentialID, credentialPublicKey, counter } = verification.registrationInfo

  const credentialIdB64 = Buffer.from(credentialID as Uint8Array).toString("base64url")
  const publicKeyB64 = Buffer.from(credentialPublicKey as Uint8Array).toString("base64url")

  // Save the new passkey
  const { error: insertError } = await supabase.from("passkeys").insert({
    user_id: session.user.discordId,
    credential_id: credentialIdB64,
    public_key: publicKeyB64,
    counter,
    device_name: deviceName ?? "Passkey",
    created_at: new Date().toISOString(),
  })

  // Clean up challenge
  await supabase.from("passkey_challenges").delete().eq("user_id", session.user.discordId)

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
