import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { staticPosts } from "@/data/posts"
import type { DBPost } from "@/lib/types"

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
