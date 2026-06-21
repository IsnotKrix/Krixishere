"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import type { DBRelease } from "@/lib/types"

const HERO_IMAGE = "https://www.iclarified.com/images/news/94502/451898/451898.jpg"

function ReleaseEntry({ item, index }: { item: DBRelease; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index === 0 ? 0.1 : 0 }}
      id={item.version}
      className="relative grid md:grid-cols-[180px_1fr] gap-6 md:gap-14 py-14 scroll-mt-24"
    >
      {/* Left: meta */}
      <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:pt-0.5">
        <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.25em] hidden md:block">
          {item.version}
        </span>
        <time className="text-xs text-muted-foreground font-mono">{item.date}</time>
        <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-[0.2em] md:hidden">
          {item.version}
        </span>
      </div>

      {/* Right: content */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight tracking-tight">
          {item.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-7 max-w-xl">
          {item.excerpt}
        </p>

        <div className="space-y-6 mb-7">
          {item.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-mono mb-2.5">
                {section.heading}
              </p>
              <ul className="space-y-2">
                {section.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-foreground/20 shrink-0 font-mono mt-0.5">—</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-foreground/[0.04] border border-border rounded font-mono text-muted-foreground tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </motion.div>
  )
}

type Props = { releases: DBRelease[] }

export function Changelog({ releases }: Props) {
  const totalChanges = releases.reduce(
    (acc, r) => acc + r.content.reduce((a, s) => a + s.items.length, 0),
    0
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero image banner */}
      <div className="relative w-full h-[45vh] min-h-[280px] overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-6 pb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.35em] text-white/40 mb-3 font-mono"
          >
            Changelog
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight"
          >
            What&apos;s new
          </motion.h1>
        </div>
      </div>

      {/* Sub-hero */}
      <section className="pt-10 pb-12 px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-muted-foreground leading-relaxed max-w-sm text-sm"
        >
          Every update, fix, and improvement to krixishere.org — newest first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="flex items-center gap-3 mt-5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
            <span className="text-xs font-mono text-muted-foreground">
              {releases.length} releases
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
            <span className="text-xs font-mono text-muted-foreground">
              {totalChanges} changes
            </span>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Entries */}
      <section className="max-w-4xl mx-auto px-6">
        {releases.map((item, i) => (
          <ReleaseEntry key={item.id} item={item} index={i} />
        ))}
      </section>

      {/* End marker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-16 flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono text-foreground/20 uppercase tracking-[0.3em]">
          beginning
        </span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>
    </div>
  )
}
