import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"
import { generateAuthenticationOptions } from "@simplewebauthn/server"

const RP_ID = process.env.NODE_ENV === "production" ? "krixishere.org" : "localhost"

export async function POST() {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabase()

  // Fetch all passkeys for this user to allow any of them
  const { data: passkeys } = await supabase
    .from("passkeys")
    .select("credential_id")
    .eq("user_id", session.user.discordId)

  if (!passkeys?.length) {
    return NextResponse.json({ error: "No passkeys registered" }, { status: 400 })
  }

  const allowCredentials = passkeys.map((pk: { credential_id: string }) => ({
    id: Buffer.from(pk.credential_id, "base64url"),
    type: "public-key" as const,
  }))

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials,
    userVerification: "preferred",
  })

  // Store challenge
  await supabase.from("passkey_challenges").upsert({
    user_id: session.user.discordId,
    challenge: options.challenge,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json(options)
}
