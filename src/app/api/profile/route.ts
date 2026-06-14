import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabase()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.discordId)
    .single()

  return NextResponse.json(data ?? { user_id: session.user.discordId, display_name: null, bio: null, website: null })
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { display_name, bio, website } = body

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      user_id: session.user.discordId,
      display_name: display_name ?? null,
      bio: bio ?? null,
      website: website ?? null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
