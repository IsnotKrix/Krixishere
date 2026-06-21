"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, X, CircleCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DBPost, PostSection } from "@/lib/types"

function uid() { return Math.random().toString(36).slice(2, 10) }

type FormData = {
  slug: string
  title: string
  excerpt: string
  image: string
  tags: string
  is_featured: boolean
  published_at: string
  content: PostSection[]
}

const DEFAULT_SECTION = (): PostSection => ({
  id: uid(),
  heading: "",
  body: "",
  items: [],
})

const DEFAULT_FORM: FormData = {
  slug: "",
  title: "",
  excerpt: "",
  image: "",
  tags: "",
  is_featured: false,
  published_at: new Date().toISOString().slice(0, 10),
  content: [DEFAULT_SECTION()],
}

const cls =
  "w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/40 transition-colors"

function Field({
  label,
  placeholder,
  value,
  onChange,
  textarea = false,
  type = "text",
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-400 mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(cls, "resize-none")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  )
}

type Props = {
  open: boolean
  onClose: () => void
  onSave: () => void
  post: DBPost | null
}

export function PostFormDialog({ open, onClose, onSave, post }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep(1)
    setError(null)
    if (post) {
      setForm({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        image: post.image ?? "",
        tags: post.tags.join(", "),
        is_featured: post.is_featured,
        published_at: post.published_at.slice(0, 10),
        content: post.content.length ? post.content : [DEFAULT_SECTION()],
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [open, post])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((p) => ({ ...p, [key]: value }))

  const addSection = () => set("content", [...form.content, DEFAULT_SECTION()])
  const removeSection = (i: number) => set("content", form.content.filter((_, idx) => idx !== i))
  const updateSection = (i: number, patch: Partial<PostSection>) => {
    const c = [...form.content]
    c[i] = { ...c[i], ...patch }
    set("content", c)
  }
  const addItem = (si: number) => updateSection(si, { items: [...(form.content[si].items ?? []), ""] })
  const removeItem = (si: number, ii: number) =>
    updateSection(si, { items: form.content[si].items?.filter((_, idx) => idx !== ii) })
  const updateItem = (si: number, ii: number, v: string) => {
    const items = [...(form.content[si].items ?? [])]
    items[ii] = v
    updateSection(si, { items })
  }

  const canContinue =
    step === 1 ? !!(form.slug && form.title && form.excerpt) :
    step === 2 ? form.content.some((s) => s.heading.trim() && s.body.trim()) :
    true

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        image: form.image.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        is_featured: form.is_featured,
        published_at: new Date(form.published_at).toISOString(),
        content: form.content
          .filter((s) => s.heading.trim() && s.body.trim())
          .map((s) => ({
            id: s.id || uid(),
            heading: s.heading.trim(),
            body: s.body.trim(),
            items: s.items?.filter((i) => i.trim()) ?? [],
          })),
        view_count: post?.view_count ?? 0,
      }

      const isEdit = post && !post.id.startsWith("static-")
      const url = isEdit ? `/api/posts/${post.slug}` : "/api/posts"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Something went wrong")
      }
      onSave()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const STEPS = ["Basic info", "Content", "Settings"]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col gap-0 p-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent z-10 pointer-events-none rounded-t-2xl" />

        <div className="px-6 pt-6 pb-4 shrink-0 border-b border-white/[0.06]">
          <DialogHeader>
            <DialogTitle>{post && !post.id.startsWith("static-") ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-center gap-0">
            {STEPS.map((label, idx) => {
              const n = idx + 1
              const done = n < step
              const active = n === step
              return (
                <div key={n} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                      active ? "bg-violet-600 border-violet-600 text-white" : done ? "bg-violet-800 border-violet-800 text-white" : "bg-white/[0.04] border-white/10 text-zinc-600"
                    )}>
                      {done ? "✓" : n}
                    </div>
                    <span className={cn("text-[10px] whitespace-nowrap", active ? "text-zinc-300" : done ? "text-zinc-500" : "text-zinc-600")}>
                      {label}
                    </span>
                  </div>
                  {n < 3 && <div className="w-10 h-px mx-1 mb-4 bg-white/[0.08]" />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }} className="space-y-4">
                <Field label="Slug" placeholder="my-first-post" value={form.slug} onChange={(v) => set("slug", v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} />
                <Field label="Title" placeholder="Post title" value={form.title} onChange={(v) => set("title", v)} />
                <Field label="Excerpt" placeholder="Short description…" value={form.excerpt} onChange={(v) => set("excerpt", v)} textarea />
                <Field label="Image URL" placeholder="https://…" value={form.image} onChange={(v) => set("image", v)} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }} className="space-y-3">
                <p className="text-xs text-zinc-500 mb-1">Each section has a heading, body text, and optional bullet points.</p>
                {form.content.map((section, si) => (
                  <div key={section.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={section.heading}
                        onChange={(e) => updateSection(si, { heading: e.target.value })}
                        placeholder="Section heading"
                        className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-zinc-700 border-b border-white/10 pb-1 focus:outline-none focus:border-violet-500/50"
                      />
                      {form.content.length > 1 && (
                        <button onClick={() => removeSection(si)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      value={section.body}
                      onChange={(e) => updateSection(si, { body: e.target.value })}
                      placeholder="Section body text…"
                      rows={3}
                      className="w-full bg-transparent text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none resize-none"
                    />
                    {(section.items?.length ?? 0) > 0 && (
                      <div className="space-y-2 pl-1">
                        {section.items?.map((item, ii) => (
                          <div key={ii} className="flex items-center gap-2">
                            <span className="text-zinc-600 text-xs shrink-0">•</span>
                            <input
                              value={item}
                              onChange={(e) => updateItem(si, ii, e.target.value)}
                              placeholder="Bullet point…"
                              className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none"
                            />
                            <button onClick={() => removeItem(si, ii)} className="text-zinc-700 hover:text-red-400 transition-colors shrink-0">
                              <X className="size-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => addItem(si)} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1 pl-3">
                      <Plus className="size-3" /> Add bullet
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSection}
                  className="w-full text-sm text-zinc-500 hover:text-zinc-300 border border-dashed border-white/[0.08] hover:border-white/20 rounded-xl py-3 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" /> Add section
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }} className="space-y-5">
                <Field label="Tags (comma-separated)" placeholder="roblox, web, tutorial" value={form.tags} onChange={(v) => set("tags", v)} />
                <Field label="Published date" value={form.published_at} onChange={(v) => set("published_at", v)} type="date" />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.is_featured}
                    onChange={(e) => set("is_featured", e.target.checked)}
                    className="accent-violet-500"
                  />
                  <label htmlFor="featured" className="text-xs font-medium text-zinc-400">Mark as featured</label>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 pb-6 pt-4 shrink-0 border-t border-white/[0.06] flex items-center gap-2">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="rounded-full border border-white/10 text-zinc-300 hover:text-white">
              Back
            </Button>
          )}
          <Button
            onClick={step < 3 ? () => setStep((s) => s + 1) : handleSubmit}
            disabled={!canContinue || loading}
            className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40"
          >
            <span className="flex items-center justify-center gap-2">
              {step === 3 && !loading && <CircleCheck className="size-4" />}
              {loading ? "Publishing…" : step === 3 ? "Publish Post" : "Continue"}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
