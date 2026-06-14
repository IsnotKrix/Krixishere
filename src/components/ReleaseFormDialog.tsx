"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, CircleCheck, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DBRelease, ContentSection } from "@/lib/types"

/* ── types ───────────────────────────────────────────────────── */

type FormData = {
  version: string
  title: string
  date: string
  image: string
  excerpt: string
  content: ContentSection[]
  contributors: string[]
  tags: string
  author_note: string
}

const DEFAULT_FORM: FormData = {
  version: "",
  title: "",
  date: "",
  image: "",
  excerpt: "",
  content: [{ heading: "", items: [""] }],
  contributors: [""],
  tags: "",
  author_note: "",
}

const STEP_LABELS = ["Basic info", "Content", "Meta & author"]

/* ── step indicator ──────────────────────────────────────────── */

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-6 relative">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={cn(
            "w-2 h-2 rounded-full relative z-10 transition-colors duration-300",
            dot <= step ? "bg-white" : "bg-zinc-700"
          )}
        />
      ))}
      <motion.div
        className="absolute -left-[8px] -top-[4px] h-3 bg-violet-500 rounded-full"
        animate={{ width: step === 1 ? "24px" : step === 2 ? "60px" : "96px" }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.8 }}
      />
    </div>
  )
}

/* ── field helpers ───────────────────────────────────────────── */

function Field({
  label,
  placeholder,
  value,
  onChange,
  textarea = false,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const cls =
    "w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/40 transition-colors"
  return (
    <div>
      <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
        {label}
      </label>
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  )
}

/* ── main component ──────────────────────────────────────────── */

type Props = {
  open: boolean
  onClose: () => void
  onSave: () => void
  release: DBRelease | null
}

export function ReleaseFormDialog({ open, onClose, onSave, release }: Props) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep(1)
    setError(null)
    if (release) {
      setForm({
        version: release.version,
        title: release.title,
        date: release.date,
        image: release.image,
        excerpt: release.excerpt,
        content: release.content.length
          ? release.content
          : [{ heading: "", items: [""] }],
        contributors: release.contributors.map((url) =>
          url.replace("https://github.com/", "").replace(".png", "")
        ),
        tags: release.tags.join(", "),
        author_note: release.author_note ?? "",
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [open, release])

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((p) => ({ ...p, [key]: value }))

  /* content helpers */
  const addSection = () =>
    set("content", [...form.content, { heading: "", items: [""] }])
  const removeSection = (i: number) =>
    set("content", form.content.filter((_, idx) => idx !== i))
  const updateHeading = (i: number, v: string) => {
    const c = [...form.content]
    c[i] = { ...c[i], heading: v }
    set("content", c)
  }
  const addItem = (si: number) => {
    const c = [...form.content]
    c[si] = { ...c[si], items: [...c[si].items, ""] }
    set("content", c)
  }
  const removeItem = (si: number, ii: number) => {
    const c = [...form.content]
    c[si] = { ...c[si], items: c[si].items.filter((_, idx) => idx !== ii) }
    set("content", c)
  }
  const updateItem = (si: number, ii: number, v: string) => {
    const c = [...form.content]
    const items = [...c[si].items]
    items[ii] = v
    c[si] = { ...c[si], items }
    set("content", c)
  }

  /* contributor helpers */
  const addContributor = () => set("contributors", [...form.contributors, ""])
  const removeContributor = (i: number) =>
    set("contributors", form.contributors.filter((_, idx) => idx !== i))
  const updateContributor = (i: number, v: string) => {
    const c = [...form.contributors]
    c[i] = v
    set("contributors", c)
  }

  /* validation */
  const canContinue =
    step === 1
      ? !!(form.version && form.title && form.date && form.excerpt)
      : step === 2
      ? form.content.some(
          (s) => s.heading.trim() && s.items.some((i) => i.trim())
        )
      : true

  /* submit */
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        version: form.version.trim(),
        title: form.title.trim(),
        date: form.date.trim(),
        image: form.image.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content
          .filter((s) => s.heading.trim())
          .map((s) => ({
            heading: s.heading.trim(),
            items: s.items.filter((i) => i.trim()),
          })),
        contributors: form.contributors
          .filter((u) => u.trim())
          .map(
            (u) =>
              `https://github.com/${u.trim().replace(/^@/, "").replace(/\.png$/, "")}.png`
          ),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        author_note: form.author_note.trim() || null,
      }

      const isEdit = release && !release.id.startsWith("static-")
      const url = isEdit ? `/api/releases/${release.id}` : "/api/releases"
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col gap-0 p-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent z-10 pointer-events-none rounded-t-2xl" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0 border-b border-white/[0.06]">
          <DialogHeader>
            <DialogTitle>
              {release && !release.id.startsWith("static-")
                ? "Edit Release"
                : "New Release"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-center gap-4">
            <StepIndicator step={step} />
            <span className="text-xs text-zinc-500">{STEP_LABELS[step - 1]}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <Field
                  label="Version"
                  placeholder="v1.2.0"
                  value={form.version}
                  onChange={(v) => set("version", v)}
                />
                <Field
                  label="Title"
                  placeholder="v1.2.0: New Features & Fixes"
                  value={form.title}
                  onChange={(v) => set("title", v)}
                />
                <Field
                  label="Date"
                  placeholder="June 13, 2025"
                  value={form.date}
                  onChange={(v) => set("date", v)}
                />
                <Field
                  label="Image URL"
                  placeholder="https://placehold.co/1200x700/0a0a0a/7c3aed/png?text=v1.2.0"
                  value={form.image}
                  onChange={(v) => set("image", v)}
                />
                <Field
                  label="Description (excerpt)"
                  placeholder="Short summary of what changed in this release…"
                  value={form.excerpt}
                  onChange={(v) => set("excerpt", v)}
                  textarea
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <p className="text-xs text-zinc-500 mb-1">
                  Build the release notes with sections and bullet points.
                </p>
                {form.content.map((section, si) => (
                  <div
                    key={si}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        value={section.heading}
                        onChange={(e) => updateHeading(si, e.target.value)}
                        placeholder="Section heading (e.g. Navigation)"
                        className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-zinc-700 border-b border-white/10 pb-1 focus:outline-none focus:border-violet-500/50"
                      />
                      {form.content.length > 1 && (
                        <button
                          onClick={() => removeSection(si)}
                          className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 pl-1">
                      {section.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-2">
                          <span className="text-zinc-600 text-xs shrink-0">•</span>
                          <input
                            value={item}
                            onChange={(e) => updateItem(si, ii, e.target.value)}
                            placeholder="Bullet point…"
                            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none"
                          />
                          {section.items.length > 1 && (
                            <button
                              onClick={() => removeItem(si, ii)}
                              className="text-zinc-700 hover:text-red-400 transition-colors shrink-0"
                            >
                              <X className="size-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addItem(si)}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1 pl-3 mt-1"
                      >
                        <Plus className="size-3" /> Add item
                      </button>
                    </div>
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
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* Contributors */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-2 block">
                    Contributors (GitHub usernames)
                  </label>
                  <div className="space-y-2">
                    {form.contributors.map((u, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-zinc-600 text-xs shrink-0">
                          github.com/
                        </span>
                        <input
                          value={u}
                          onChange={(e) => updateContributor(i, e.target.value)}
                          placeholder="username"
                          className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-700 border-b border-white/10 pb-1 focus:outline-none focus:border-violet-500/50"
                        />
                        {form.contributors.length > 1 && (
                          <button
                            onClick={() => removeContributor(i)}
                            className="text-zinc-700 hover:text-red-400 transition-colors shrink-0"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addContributor}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1 mt-1"
                    >
                      <Plus className="size-3" /> Add contributor
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                    Tags{" "}
                    <span className="text-zinc-600 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    value={form.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    placeholder="ui, navigation, bugfix"
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/40 transition-colors"
                  />
                </div>

                {/* Author note */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                    Author note{" "}
                    <span className="text-zinc-600 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.author_note}
                    onChange={(e) => set("author_note", e.target.value)}
                    placeholder="A personal note about this release, thoughts, context…"
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/40 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer navigation */}
        <div className="px-6 pb-6 pt-4 shrink-0 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {step > 1 && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="overflow-hidden"
                >
                  <Button
                    variant="ghost"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-full border border-white/10 text-zinc-300 hover:text-white"
                  >
                    Back
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              onClick={
                step < 3 ? () => setStep((s) => s + 1) : handleSubmit
              }
              disabled={!canContinue || loading}
              className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40"
            >
              <span className="flex items-center justify-center gap-2">
                {step === 3 && !loading && <CircleCheck className="size-4" />}
                {loading
                  ? "Publishing…"
                  : step === 3
                  ? "Publish Release"
                  : "Continue"}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
