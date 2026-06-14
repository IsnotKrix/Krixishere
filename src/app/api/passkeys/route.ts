import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("passkeys")
    .select("id, device_name, created_at")
    .eq("user_id", session.user.discordId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase
    .from("passkeys")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.discordId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
