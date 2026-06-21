import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase"
import { staticPosts } from "@/data/posts"
import type { DBPost } from "@/lib/types"

async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  return (user?.publicMetadata as { isAdmin?: boolean })?.isAdmin === true ? user : null
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(staticPosts)
  }
  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false })
    const rows = (data ?? []) as DBPost[]
    return NextResponse.json(rows.length ? rows : staticPosts)
  } catch {
    return NextResponse.json(staticPosts)
  }
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const supabase = getSupabase()
  const { error } = await supabase.from("posts").insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
