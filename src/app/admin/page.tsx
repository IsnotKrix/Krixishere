"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  Plus, Pencil, Trash2, PackageOpen, Users, BadgeCheck,
  FileText, LogOut, Layers, Settings2,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { ReleaseFormDialog } from "@/components/ReleaseFormDialog"
import { PostFormDialog } from "@/components/PostFormDialog"
import { ContextCard } from "@/components/ui/context-card"
import type { DBRelease, DBPost } from "@/lib/types"
import Link from "next/link"

type AdminUser = {
  discord_id: string
  username: string
  avatar_url: string | null
  is_verified: boolean
  verified_at: string | null
  last_login: string | null
}

type Tab = "releases" | "posts" | "users"

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "releases", label: "Releases", icon: Layers },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "users", label: "Users", icon: Users },
]

const rowIn: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("releases")

  const [releases, setReleases] = useState<DBRelease[]>([])
  const [releasesLoading, setReleasesLoading] = useState(true)
  const [releaseFormOpen, setReleaseFormOpen] = useState(false)
  const [editRelease, setEditRelease] = useState<DBRelease | null>(null)
  const [deletingRelease, setDeletingRelease] = useState<string | null>(null)

  const [posts, setPosts] = useState<DBPost[]>([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [postFormOpen, setPostFormOpen] = useState(false)
  const [editPost, setEditPost] = useState<DBPost | null>(null)
  const [deletingPost, setDeletingPost] = useState<string | null>(null)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)

  const fetchReleases = async () => {
    setReleasesLoading(true)
    try {
      const res = await fetch("/api/releases")
      setReleases(await res.json())
    } catch { setReleases([]) }
    finally { setReleasesLoading(false) }
  }

  const fetchPosts = async () => {
    setPostsLoading(true)
    try {
      const res = await fetch("/api/posts")
      setPosts(await res.json())
    } catch { setPosts([]) }
    finally { setPostsLoading(false) }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch { setUsers([]) }
    finally { setUsersLoading(false) }
  }

  useEffect(() => { fetchReleases() }, [])
  useEffect(() => { if (tab === "posts") fetchPosts() }, [tab])
  useEffect(() => { if (tab === "users") fetchUsers() }, [tab])

  const handleDeleteRelease = async (release: DBRelease) => {
    if (!confirm(`Delete "${release.title}"?`)) return
    if (release.id.startsWith("static-")) {
      alert("Static releases cannot be deleted here.")
      return
    }
    setDeletingRelease(release.id)
    try {
      await fetch(`/api/releases/${release.id}`, { method: "DELETE" })
      await fetchReleases()
    } finally { setDeletingRelease(null) }
  }

  const handleDeletePost = async (post: DBPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return
    if (post.id.startsWith("static-")) {
      alert("Static posts cannot be deleted here.")
      return
    }
    setDeletingPost(post.id)
    try {
      await fetch(`/api/posts/${post.slug}`, { method: "DELETE" })
      await fetchPosts()
    } finally { setDeletingPost(null) }
  }

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
    } finally { setVerifying(null) }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[200px] shrink-0 border-r border-border min-h-screen sticky top-0 h-screen">
        <div className="px-4 pt-8 pb-6">
          <Link href="/" className="text-xs font-mono text-foreground/30 hover:text-foreground/60 transition-colors tracking-wide">
            ← krix
          </Link>
          <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.3em] mt-4 mb-1">
            Control Panel
          </p>
          <div className="flex items-center gap-1.5">
            <Settings2 className="size-3.5 text-foreground/40" />
            <span className="text-sm font-semibold text-foreground/80">Admin</span>
          </div>
        </div>

        <div className="h-px bg-border mx-4" />

        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                tab === id
                  ? "bg-foreground/[0.07] text-foreground border border-border"
                  : "text-foreground/35 hover:text-foreground/65 hover:bg-foreground/[0.04]"
              }`}
            >
              <Icon className="size-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-foreground/30 hover:text-red-400 hover:bg-red-400/[0.07] transition-all w-full"
          >
            <LogOut className="size-3.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile nav strip */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-md flex">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono transition-colors ${
              tab === id ? "text-foreground" : "text-foreground/30"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono text-foreground/25 hover:text-red-400 transition-colors"
        >
          <LogOut className="size-4" />
          Out
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md h-12 flex items-center px-6 gap-3">
          <span className="text-xs font-mono text-foreground/30 capitalize">{tab}</span>
          <div className="h-3 w-px bg-border" />
          <span className="text-[10px] font-mono text-foreground/20">
            {tab === "releases" ? `${releases.length} entries` : tab === "posts" ? `${posts.length} entries` : `${users.length} accounts`}
          </span>

          {(tab === "releases" || tab === "posts") && (
            <button
              onClick={() => {
                if (tab === "releases") { setEditRelease(null); setReleaseFormOpen(true) }
                else { setEditPost(null); setPostFormOpen(true) }
              }}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono border border-border rounded-lg bg-foreground/[0.03] hover:bg-foreground/[0.07] hover:border-foreground/25 transition-all text-foreground/60"
            >
              <Plus className="size-3" />
              New {tab === "releases" ? "release" : "post"}
            </button>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">

            {/* RELEASES */}
            {tab === "releases" && (
              <motion.div key="releases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {releasesLoading ? (
                  <Skeleton rows={5} />
                ) : releases.length === 0 ? (
                  <Empty icon={PackageOpen} message="No releases registered yet." />
                ) : (
                  <div className="divide-y divide-border/50">
                    {releases.map((r, i) => (
                      <motion.div
                        key={r.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={rowIn}
                        className="group grid md:grid-cols-[130px_1fr_auto] gap-4 md:gap-6 py-4 items-center"
                      >
                        <div className="flex md:flex-col gap-2 md:gap-0.5">
                          <span className="text-[10px] font-mono text-foreground/35 uppercase tracking-[0.2em]">{r.version}</span>
                          <time className="text-[10px] text-muted-foreground font-mono">{r.date}</time>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-sm font-medium text-foreground truncate">{r.title}</span>
                            {r.id.startsWith("static-") && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.05] text-foreground/25 border border-border">static</span>
                            )}
                          </div>
                          {r.tags?.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {r.tags.slice(0, 3).map((t) => (
                                <span key={t} className="text-[9px] font-mono text-foreground/25 bg-foreground/[0.03] border border-border/50 px-1.5 py-0.5 rounded">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => { setEditRelease(r); setReleaseFormOpen(true) }} className="p-1.5 text-foreground/25 hover:text-foreground/70 transition-colors rounded">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => handleDeleteRelease(r)} disabled={deletingRelease === r.id} className="p-1.5 text-foreground/25 hover:text-red-400 transition-colors rounded disabled:opacity-40">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* POSTS */}
            {tab === "posts" && (
              <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {postsLoading ? (
                  <Skeleton rows={4} />
                ) : posts.length === 0 ? (
                  <Empty icon={FileText} message="No posts registered yet." />
                ) : (
                  <div className="divide-y divide-border/50">
                    {posts.map((p, i) => (
                      <motion.div
                        key={p.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={rowIn}
                        className="group grid md:grid-cols-[130px_1fr_auto] gap-4 md:gap-6 py-4 items-center"
                      >
                        <div className="flex md:flex-col gap-2 md:gap-0.5">
                          <time className="text-[10px] font-mono text-foreground/35">
                            {new Date(p.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </time>
                          <span className="text-[10px] font-mono text-foreground/20">{p.view_count} views</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-sm font-medium text-foreground truncate">{p.title}</span>
                            {p.is_featured && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.05] text-foreground/30 border border-border">featured</span>
                            )}
                            {p.id.startsWith("static-") && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.05] text-foreground/25 border border-border">static</span>
                            )}
                          </div>
                          {p.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {p.tags.slice(0, 3).map((t) => (
                                <span key={t} className="text-[9px] font-mono text-foreground/25 bg-foreground/[0.03] border border-border/50 px-1.5 py-0.5 rounded">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Link href={`/blog/${p.slug}`} target="_blank" className="p-1.5 text-foreground/25 hover:text-foreground/70 transition-colors rounded">
                            <FileText className="size-3.5" />
                          </Link>
                          <button onClick={() => { setEditPost(p); setPostFormOpen(true) }} className="p-1.5 text-foreground/25 hover:text-foreground/70 transition-colors rounded">
                            <Pencil className="size-3.5" />
                          </button>
                          <button onClick={() => handleDeletePost(p)} disabled={deletingPost === p.id} className="p-1.5 text-foreground/25 hover:text-red-400 transition-colors rounded disabled:opacity-40">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* USERS */}
            {tab === "users" && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {usersLoading ? (
                  <Skeleton rows={3} />
                ) : users.length === 0 ? (
                  <Empty icon={Users} message="No users have signed in yet." />
                ) : (
                  <div className="divide-y divide-border/50">
                    {users.map((u, i) => (
                      <motion.div
                        key={u.discord_id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={rowIn}
                        className="grid md:grid-cols-[130px_1fr_auto] gap-4 md:gap-6 py-4 items-center"
                      >
                        <div className="flex items-center gap-2.5">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.username} className="w-7 h-7 rounded-full border border-border shrink-0 object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                              {u.username?.[0]?.toUpperCase() ?? "?"}
                            </div>
                          )}
                          <span className="text-[10px] font-mono text-foreground/25 truncate hidden md:block">{u.discord_id}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm font-medium text-foreground truncate">{u.username}</span>
                            {u.is_verified && (
                              <ContextCard.Trigger content={<span className="flex items-center gap-1 text-xs"><BadgeCheck className="size-3" /> Verified</span>} side="top">
                                <BadgeCheck className="size-3.5 text-foreground/40 shrink-0" />
                              </ContextCard.Trigger>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            last login: {u.last_login ? new Date(u.last_login).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "never"}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <button
                            disabled={verifying === u.discord_id}
                            onClick={() => handleVerify(u.discord_id, !u.is_verified)}
                            className={`text-[11px] font-mono px-3 py-1 border rounded transition-colors disabled:opacity-40 ${
                              u.is_verified
                                ? "border-border text-foreground/35 hover:text-red-400 hover:border-red-400/40"
                                : "border-border text-foreground/35 hover:text-foreground/70 hover:border-foreground/30"
                            }`}
                          >
                            {verifying === u.discord_id ? "…" : u.is_verified ? "revoke" : "verify"}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <ReleaseFormDialog
        open={releaseFormOpen}
        onClose={() => { setReleaseFormOpen(false); setEditRelease(null) }}
        onSave={() => { setReleaseFormOpen(false); setEditRelease(null); fetchReleases() }}
        release={editRelease}
      />

      <PostFormDialog
        open={postFormOpen}
        onClose={() => { setPostFormOpen(false); setEditPost(null) }}
        onSave={() => { setPostFormOpen(false); setEditPost(null); fetchPosts() }}
        post={editPost}
      />
    </div>
  )
}

function Skeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-px">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-border/50 bg-foreground/[0.015] animate-pulse rounded" />
      ))}
    </div>
  )
}

function Empty({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <Icon className="size-8 text-foreground/15" />
      <p className="text-xs font-mono text-foreground/30 tracking-wide">{message}</p>
    </div>
  )
}
