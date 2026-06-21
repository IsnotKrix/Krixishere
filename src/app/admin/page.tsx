"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Plus, Pencil, Trash2, PackageOpen, Users, BadgeCheck, ChevronRight, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReleaseFormDialog } from "@/components/ReleaseFormDialog"
import { ContextCard } from "@/components/ui/context-card"
import type { DBRelease } from "@/lib/types"
import Link from "next/link"

type AdminUser = {
  discord_id: string
  username: string
  avatar_url: string | null
  is_verified: boolean
  verified_at: string | null
  last_login: string | null
}

type Tab = "releases" | "users"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const rowVariant: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("releases")

  const [releases, setReleases] = useState<DBRelease[]>([])
  const [releasesLoading, setReleasesLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRelease, setEditRelease] = useState<DBRelease | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)

  const fetchReleases = async () => {
    setReleasesLoading(true)
    try {
      const res = await fetch("/api/releases")
      const data = await res.json()
      setReleases(data)
    } catch {
      setReleases([])
    } finally {
      setReleasesLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => { fetchReleases() }, [])
  useEffect(() => { if (tab === "users") fetchUsers() }, [tab])

  const handleEdit = (release: DBRelease) => { setEditRelease(release); setFormOpen(true) }
  const handleNew = () => { setEditRelease(null); setFormOpen(true) }

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

  const handleSave = () => { setFormOpen(false); setEditRelease(null); fetchReleases() }

  const handleVerify = async (discord_id: string, verify: boolean) => {
    setVerifying(discord_id)
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discord_id, verify }),
      })
      setUsers((prev) =>
        prev.map((u) =>
          u.discord_id === discord_id
            ? { ...u, is_verified: verify, verified_at: verify ? new Date().toISOString() : null }
            : u
        )
      )
    } finally {
      setVerifying(null)
    }
  }

  const totalChanges = releases.reduce((acc, r) => acc + r.content.reduce((a, s) => a + s.items.length, 0), 0)
  const verifiedUsers = users.filter((u) => u.is_verified).length

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Sticky header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 font-mono text-xs min-w-0">
            <Link href="/" className="text-foreground/40 hover:text-foreground/70 transition-colors shrink-0">
              krix
            </Link>
            <ChevronRight className="size-3 text-foreground/20 shrink-0" />
            <Link href="/changelog" className="text-foreground/40 hover:text-foreground/70 transition-colors shrink-0">
              changelog
            </Link>
            <ChevronRight className="size-3 text-foreground/20 shrink-0" />
            <span className="text-foreground/80 shrink-0">admin</span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden shrink-0">
            {(["releases", "users"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors ${
                  tab === t
                    ? "bg-foreground/8 text-foreground/80"
                    : "text-foreground/30 hover:text-foreground/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-mono mb-2">
              <Terminal className="inline size-2.5 mr-1.5 -mt-px" />
              Control Panel
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-none mb-3">
              {tab === "releases" ? "Releases" : "Users"}
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {tab === "releases"
                ? <>Manage changelog entries. Changes appear on <Link href="/changelog" className="text-foreground/60 hover:text-foreground underline underline-offset-2 transition-colors">/changelog</Link> immediately.</>
                : "All accounts that have signed in. Verify or revoke access."}
            </p>
          </div>

          {tab === "releases" && (
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wide border border-border rounded-lg bg-foreground/[0.04] hover:bg-foreground/[0.08] hover:border-foreground/30 transition-all"
              >
                <Plus className="size-3.5" />
                New release
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center gap-2 mt-6"
        >
          {tab === "releases" ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">{releases.length} releases</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
                <span className="text-xs font-mono text-muted-foreground">{totalChanges} changes</span>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground">{users.length} accounts</span>
              </div>
              {users.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
                  <span className="text-xs font-mono text-muted-foreground">{verifiedUsers} verified</span>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">

          {tab === "releases" && (
            <motion.div
              key="releases"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {releasesLoading ? (
                <div className="space-y-px">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 rounded-none border-b border-border bg-foreground/[0.015] animate-pulse" />
                  ))}
                </div>
              ) : releases.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                  <PackageOpen className="size-8 mx-auto mb-3 opacity-30" />
                  <p className="text-xs font-mono tracking-wide">no releases yet</p>
                </div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="divide-y divide-border">
                  {releases.map((release) => (
                    <motion.div
                      key={release.id}
                      variants={rowVariant}
                      className="group grid md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 py-4 items-center"
                    >
                      {/* Left: meta */}
                      <div className="flex md:flex-col items-start gap-2 md:gap-0.5">
                        <span className="text-[10px] font-mono text-foreground/35 uppercase tracking-[0.2em]">
                          {release.version}
                        </span>
                        <time className="text-[10px] text-muted-foreground font-mono">{release.date}</time>
                      </div>

                      {/* Right: content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-semibold text-foreground truncate">{release.title}</span>
                          {release.id.startsWith("static-") && (
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded bg-foreground/[0.06] text-foreground/30 border border-border">
                              static
                            </span>
                          )}
                        </div>
                        {release.tags?.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {release.tags.slice(0, 4).map((t) => (
                              <span key={t} className="text-[10px] font-mono text-muted-foreground bg-foreground/[0.04] border border-border px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(release)}
                          className="p-1.5 text-foreground/30 hover:text-foreground/80 transition-colors rounded"
                          aria-label="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(release)}
                          disabled={deleting === release.id}
                          className="p-1.5 text-foreground/30 hover:text-red-400 transition-colors rounded disabled:opacity-40"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {usersLoading ? (
                <div className="space-y-px">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 border-b border-border bg-foreground/[0.015] animate-pulse" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                  <Users className="size-8 mx-auto mb-3 opacity-30" />
                  <p className="text-xs font-mono tracking-wide">no users yet</p>
                </div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="divide-y divide-border">
                  {users.map((user) => (
                    <motion.div
                      key={user.discord_id}
                      variants={rowVariant}
                      className="grid md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 py-4 items-center"
                    >
                      {/* Left: avatar + id */}
                      <div className="flex items-center gap-2.5">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/50 text-xs font-bold font-mono shrink-0">
                            {user.username?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <span className="text-[10px] font-mono text-foreground/30 truncate hidden md:block">
                          {user.discord_id}
                        </span>
                      </div>

                      {/* Center: name + meta */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-foreground truncate">{user.username}</span>
                          {user.is_verified && (
                            <ContextCard.Trigger
                              content={
                                <span className="flex items-center gap-1 text-xs">
                                  <BadgeCheck className="size-3 text-foreground/60" />
                                  Verified account
                                </span>
                              }
                              side="top"
                            >
                              <BadgeCheck className="size-3.5 text-foreground/50 shrink-0" />
                            </ContextCard.Trigger>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          last login:{" "}
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                            : "never"}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="shrink-0">
                        <button
                          disabled={verifying === user.discord_id}
                          onClick={() => handleVerify(user.discord_id, !user.is_verified)}
                          className={`text-[11px] font-mono px-3 py-1 border rounded transition-colors disabled:opacity-40 ${
                            user.is_verified
                              ? "border-border text-foreground/40 hover:text-red-400 hover:border-red-400/40"
                              : "border-border text-foreground/40 hover:text-foreground/80 hover:border-foreground/30"
                          }`}
                        >
                          {verifying === user.discord_id ? "..." : user.is_verified ? "revoke" : "verify"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* End marker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 py-12 flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-[9px] font-mono text-foreground/15 uppercase tracking-[0.3em]">admin</span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>

      <ReleaseFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditRelease(null) }}
        onSave={handleSave}
        release={editRelease}
      />
    </div>
  )
}
