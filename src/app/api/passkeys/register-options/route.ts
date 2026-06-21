import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase"
import { generateRegistrationOptions } from "@simplewebauthn/server"

const RP_NAME = "krixishere.org"
const RP_ID = process.env.NODE_ENV === "production" ? "krixishere.org" : "localhost"

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await currentUser()
  const supabase = getSupabase()

  const { data: existing } = await supabase
    .from("passkeys")
    .select("credential_id")
    .eq("user_id", userId)

  const excludeCredentials = (existing ?? []).map((pk: { credential_id: string }) => ({
    id: pk.credential_id,
  }))

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: new TextEncoder().encode(userId),
    userName: userId,
    userDisplayName: user?.fullName ?? user?.username ?? "User",
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  })

  await supabase.from("passkey_challenges").upsert({
    user_id: userId,
    challenge: options.challenge,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json(options)
}
