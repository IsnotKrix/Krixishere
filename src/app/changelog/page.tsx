import type { Metadata } from "next"
import { Changelog } from "./Changelog"
import { staticReleases } from "@/data/releases"
import type { DBRelease } from "@/lib/types"

export const metadata: Metadata = {
  title: "Changelog — Krix",
  description: "Latest updates, releases, and improvements to krixishere.org.",
}

async function getReleases(): Promise<DBRelease[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return staticReleases
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data } = await supabase
      .from("releases")
      .select("*")
      .order("created_at", { ascending: false })
    const rows = (data ?? []) as DBRelease[]
    return rows.length ? rows : staticReleases
  } catch {
    return staticReleases
  }
}

export default async function ChangelogPage() {
  const releases = await getReleases()
  return <Changelog releases={releases} />
}
