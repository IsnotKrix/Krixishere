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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const post = staticPosts.find((p) => p.slug === slug)
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(post)
  }
  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single()
    if (!data) {
      const fallback = staticPosts.find((p) => p.slug === slug)
      if (!fallback) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(fallback)
    }
    return NextResponse.json(data as DBPost)
  } catch {
    const fallback = staticPosts.find((p) => p.slug === slug)
    if (!fallback) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(fallback)
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const supabase = getSupabase()
  const { error } = await supabase.from("posts").update(body).eq("slug", slug)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const supabase = getSupabase()
  const { error } = await supabase.from("posts").delete().eq("slug", slug)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
