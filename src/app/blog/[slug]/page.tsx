import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { staticPosts } from "@/data/posts"
import type { DBPost } from "@/lib/types"
import { PostPage } from "./PostPage"

async function getPost(slug: string): Promise<DBPost | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return staticPosts.find((p) => p.slug === slug) ?? null
  }
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data } = await supabase.from("posts").select("*").eq("slug", slug).single()
    if (data) return data as DBPost
    return staticPosts.find((p) => p.slug === slug) ?? null
  } catch {
    return staticPosts.find((p) => p.slug === slug) ?? null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post not found — Krix" }
  return {
    title: `${post.title} — Krix`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return <PostPage post={post} />
}
