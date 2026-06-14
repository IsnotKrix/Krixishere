import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"
import type { Session } from "next-auth"

function adminGuard(session: Session | null) {
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function GET() {
  const session = await auth()
  const guard = adminGuard(session)
  if (guard) return guard

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("user_registry")
    .select("discord_id, username, avatar_url, is_verified, verified_at, last_login")
    .order("last_login", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const session = await auth()
  const guard = adminGuard(session)
  if (guard) return guard

  const { discord_id, verify } = await req.json()
  if (!discord_id) return NextResponse.json({ error: "Missing discord_id" }, { status: 400 })

  const supabase = getSupabase()
  const { error } = await supabase
    .from("user_registry")
    .update({
      is_verified: verify,
      verified_at: verify ? new Date().toISOString() : null,
    })
    .eq("discord_id", discord_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
