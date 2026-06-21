"use client"

import { useEffect, useRef, useState } from "react"
import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowLeft } from "lucide-react"
import type { DBPost } from "@/lib/types"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

function readingTime(post: DBPost): number {
  const words = post.content.reduce((acc, s) => {
    return acc + s.body.split(" ").length + (s.items?.join(" ").split(" ").length ?? 0)
  }, 0)
  return Math.max(1, Math.round(words / 200))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-2.5 my-10">
      <div className="h-px flex-1 bg-border/60" />
      <div className="flex gap-1">
        <div className="w-1 h-1 rounded-full bg-border" />
        <div className="w-1 h-1 rounded-full bg-foreground/15" />
        <div className="w-1 h-1 rounded-full bg-border" />
      </div>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  )
}

export function PostPage({ post }: { post: DBPost }) {
  const [activeId, setActiveId] = useState<string>(post.content[0]?.id ?? "")
  const [progress, setProgress] = useState(0)
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const [fillPx, setFillPx] = useState(0)
  const mins = readingTime(post)

  const activeIdx = post.content.findIndex(({ id }) => id === activeId)

  useEffect(() => {
    fetch(`/api/posts/${post.slug}/views`, { method: "POST" }).catch(() => {})
  }, [post.slug])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    post.content.forEach(({ id }) => {
      const el = sectionRefs.current.get(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [post.content])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    const activeEl = itemRefs.current[activeIdx]
    if (!nav || !activeEl) { setFillPx(0); return }
    const navRect = nav.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()
    setFillPx(itemRect.top - navRect.top + itemRect.height / 2)
  }, [activeId, activeIdx])

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-foreground/5">
        <div className="h-full bg-foreground/35 transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>

      {/* Hero */}
      <div className="relative w-full h-[52vh] min-h-[320px] overflow-hidden">
        {post.image ? (
          <Image src={post.image} alt={post.title} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-foreground/[0.04]" />
        )}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end max-w-5xl mx-auto px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex items-center gap-1.5 font-mono text-[11px] text-white/30 mb-4"
          >
            <Link href="/" className="hover:text-white/60 transition-colors">krix</Link>
            <ChevronRight className="size-2.5" />
            <Link href="/blog" className="hover:text-white/60 transition-colors">blog</Link>
            <ChevronRight className="size-2.5" />
            <span className="text-white/50 truncate max-w-[200px]">{post.slug}</span>
          </motion.div>

          {post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-1.5 flex-wrap mb-3"
            >
              {post.tags.map((t) => (
                <span key={t} className="text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-white/15 text-white/40">
                  {t}
                </span>
              ))}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-3 max-w-3xl"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="flex items-center gap-3 text-[11px] font-mono text-white/30"
          >
            <time>{formatDate(post.published_at)}</time>
            <span>·</span>
            <span>{mins} min read</span>
            {post.view_count > 0 && (
              <>
                <span>·</span>
                <span>{post.view_count} views</span>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="md:grid md:grid-cols-[180px_1fr] md:gap-16">

          {/* TOC sidebar — vertical timeline */}
          <aside className="hidden md:block">
            <div className="sticky top-20">
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-foreground/20 mb-4">
                Contents
              </p>

              <div ref={navRef} className="relative pl-4">
                {/* Track */}
                <div className="absolute left-[3px] top-0 bottom-0 w-px bg-border/35" />

                {/* Fill line */}
                <motion.div
                  className="absolute left-[3px] top-0 w-px bg-foreground/45 origin-top"
                  animate={{ height: fillPx }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {post.content.map(({ id, heading }, i) => {
                  const isActive = activeId === id
                  const isPast = i < activeIdx
                  return (
                    <button
                      key={id}
                      ref={(el) => { itemRefs.current[i] = el }}
                      onClick={() => scrollTo(id)}
                      className="relative block w-full text-left py-1.5 group"
                    >
                      <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                        isActive
                          ? "w-[7px] h-[7px] bg-foreground/70 shadow-[0_0_0_2px_rgba(255,255,255,0.08)]"
                          : isPast
                          ? "w-[5px] h-[5px] bg-foreground/35"
                          : "w-[5px] h-[5px] bg-border/60"
                      }`} />
                      <span className={`text-[11px] font-mono leading-snug transition-all duration-200 ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-foreground/28 group-hover:text-foreground/55"
                      }`}>
                        {heading}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <Link
                  href="/blog"
                  className="flex items-center gap-1.5 text-[10px] font-mono text-foreground/20 hover:text-foreground/50 transition-colors"
                >
                  <ArrowLeft className="size-2.5" />
                  all posts
                </Link>
              </div>
            </div>
          </aside>

          {/* Mobile TOC */}
          <div className="md:hidden mb-8 p-4 border border-border/50 rounded-xl bg-foreground/[0.02]">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-foreground/20 mb-3">Contents</p>
            <div className="relative pl-4 space-y-0">
              <div className="absolute left-[3px] top-0 bottom-0 w-px bg-border/35" />
              {post.content.map(({ id, heading }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="relative block w-full text-left py-1 group"
                >
                  <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 rounded-full w-[5px] h-[5px] transition-colors ${
                    activeId === id ? "bg-foreground/60" : "bg-border/50"
                  }`} />
                  <span className={`text-xs font-mono transition-colors ${activeId === id ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/70"}`}>
                    {heading}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Article */}
          <article className="min-w-0">
            <motion.p
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              className="text-base text-muted-foreground leading-relaxed mb-10 border-l-2 border-border/60 pl-4 italic"
            >
              {post.excerpt}
            </motion.p>

            <div>
              {post.content.map((section, i) => (
                <div key={section.id}>
                  {i > 0 && <SectionDivider />}
                  <motion.section
                    id={section.id}
                    ref={(el) => {
                      if (el) sectionRefs.current.set(section.id, el)
                      else sectionRefs.current.delete(section.id)
                    }}
                    custom={i + 1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">
                      {section.heading}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.body}
                    </p>
                    {section.items && section.items.length > 0 && (
                      <ul className="mt-4 space-y-2.5">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                            <span className="text-foreground/20 shrink-0 font-mono mt-0.5 select-none">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.section>
                </div>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-border/50 flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono text-muted-foreground bg-foreground/[0.04] border border-border/50 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href="/blog"
                className="flex items-center gap-1.5 text-xs font-mono text-foreground/25 hover:text-foreground/55 transition-colors shrink-0"
              >
                <ArrowLeft className="size-3" />
                back to blog
              </Link>
            </div>
          </article>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 flex items-center gap-4">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-[9px] font-mono text-foreground/15 uppercase tracking-[0.3em]">end</span>
        <div className="h-px flex-1 bg-border/40" />
      </div>
    </div>
  )
}
