"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, ArrowLeft, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReleaseFormDialog } from "@/components/ReleaseFormDialog"
import type { DBRelease } from "@/lib/types"

export default function AdminPage() {
  const [releases, setReleases] = useState<DBRelease[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRelease, setEditRelease] = useState<DBRelease | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchReleases = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/releases")
      const data = await res.json()
      setReleases(data)
    } catch {
      setReleases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReleases() }, [])

  const handleEdit = (release: DBRelease) => {
    setEditRelease(release)
    setFormOpen(true)
  }

  const handleNew = () => {
    setEditRelease(null)
    setFormOpen(true)
  }

  const handleDelete = async (release: DBRelease) => {
    if (!confirm(`Delete "${release.title}"?`)) return
    if (release.id.startsWith("static-")) {
      alert("Static releases cannot be deleted here. Remove them from src/data/releases.ts.")
      return
    }
    setDeleting(release.id)
    try {
      await fetch(`/api/releases/${release.id}`, { method: "DELETE" })
      await fetchReleases()
    } finally {
      setDeleting(null)
    }
  }

  const handleSave = () => {
    setFormOpen(false)
    setEditRelease(null)
    fetchReleases()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="text-zinc-500 hover:text-white">
              <a href="/changelog"><ArrowLeft className="size-4" /></a>
            </Button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <PackageOpen className="size-4 text-violet-400" />
              <span className="text-sm font-medium">Admin Panel</span>
            </div>
          </div>
          <Button
            onClick={handleNew}
            className="bg-violet-600 hover:bg-violet-500 text-white rounded-full text-sm gap-1.5"
          >
            <Plus className="size-4" />
            New Release
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Releases</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage changelog entries. Changes appear on{" "}
            <a href="/changelog" className="text-violet-400 hover:underline">/changelog</a>{" "}
            immediately.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : releases.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <PackageOpen className="size-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No releases yet. Create the first one.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {releases.map((release) => (
              <div
                key={release.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all"
              >
                <img
                  src={release.image}
                  alt={release.title}
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{release.title}</span>
                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-violet-500/12 border border-violet-500/25 text-violet-300 shrink-0">
                      {release.version}
                    </span>
                    {release.id.startsWith("static-") && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-500 shrink-0">
                        static
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <time className="text-xs text-zinc-500">{release.date}</time>
                    {release.tags?.length > 0 && (
                      <div className="flex items-center gap-1">
                        {release.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => handleEdit(release)}
                    className="text-zinc-500 hover:text-white size-8"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => handleDelete(release)}
                    disabled={deleting === release.id}
                    className="text-zinc-500 hover:text-red-400 size-8"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReleaseFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditRelease(null) }}
        onSave={handleSave}
        release={editRelease}
      />
    </div>
  )
}
