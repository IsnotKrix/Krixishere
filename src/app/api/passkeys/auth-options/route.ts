import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase"
import { generateAuthenticationOptions } from "@simplewebauthn/server"

const RP_ID = process.env.NODE_ENV === "production" ? "krixishere.org" : "localhost"

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = getSupabase()

  const { data: passkeys } = await supabase
    .from("passkeys")
    .select("credential_id")
    .eq("user_id", userId)

  if (!passkeys?.length) {
    return NextResponse.json({ error: "No passkeys registered" }, { status: 400 })
  }

  const allowCredentials = passkeys.map((pk: { credential_id: string }) => ({
    id: pk.credential_id,
  }))

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials,
    userVerification: "preferred",
  })

  await supabase.from("passkey_challenges").upsert({
    user_id: userId,
    challenge: options.challenge,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json(options)
}
