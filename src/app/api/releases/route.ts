import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getSupabase } from "@/lib/supabase"
import { staticReleases } from "@/data/releases"
import type { DBRelease } from "@/lib/types"

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(staticReleases)
  }
  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from("releases")
      .select("*")
      .order("created_at", { ascending: false })
    const rows = (data ?? []) as DBRelease[]
    return NextResponse.json(rows.length ? rows : staticReleases)
  } catch {
    return NextResponse.json(staticReleases)
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const supabase = getSupabase()
  const { error } = await supabase.from("releases").insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
