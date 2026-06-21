import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true })
  }
  try {
    const supabase = getSupabase()
    await supabase.rpc("increment_post_views", { post_slug: slug })
  } catch {
    // silent — view tracking is non-critical
  }
  return NextResponse.json({ ok: true })
}
