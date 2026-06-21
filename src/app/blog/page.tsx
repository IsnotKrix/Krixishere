import type { Metadata } from "next"
import { staticPosts } from "@/data/posts"
import type { DBPost } from "@/lib/types"
import { BlogListing } from "./BlogListing"

export const metadata: Metadata = {
  title: "Blog — Krix",
  description: "Thoughts on Roblox development, web building, and everything in between.",
}

async function getPosts(): Promise<DBPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return staticPosts
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false })
    const rows = (data ?? []) as DBPost[]
    return rows.length ? rows : staticPosts
  } catch {
    return staticPosts
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogListing posts={posts} />
}
