import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"
import { generateRegistrationOptions } from "@simplewebauthn/server"

const RP_NAME = "krixishere.org"
const RP_ID = process.env.NODE_ENV === "production" ? "krixishere.org" : "localhost"

export async function POST() {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabase()

  // Fetch existing credentials so we can exclude them
  const { data: existing } = await supabase
    .from("passkeys")
    .select("credential_id")
    .eq("user_id", session.user.discordId)

  const excludeCredentials = (existing ?? []).map((pk: { credential_id: string }) => ({
    id: pk.credential_id,
    type: "public-key" as const,
  }))

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: session.user.discordId,
    userDisplayName: session.user.name ?? "Krix",
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  })

  // Store challenge temporarily in Supabase (expires after 5 min)
  await supabase.from("passkey_challenges").upsert({
    user_id: session.user.discordId,
    challenge: options.challenge,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json(options)
}
