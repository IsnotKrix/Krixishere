"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { DBPost } from "@/lib/types"

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" },
  }),
}

const slideUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
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
    month: "short",
    day: "numeric",
  })
}

function HeroPost({ post }: { post: DBPost }) {
  const mins = readingTime(post)
  return (
    <motion.div custom={1} initial="hidden" animate="visible" variants={slideUp}>
      <Link href={`/blog/${post.slug}`} className="group relative block overflow-hidden rounded-2xl">
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] overflow-hidden bg-card">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.03] transition-all duration-700 ease-out"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/[0.02]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="flex items-center gap-2 mb-3">
              {post.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/15 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-3 max-w-3xl">
              {post.title}
            </h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-xl mb-4 hidden sm:block line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-white/30">
              <time>{formatDate(post.published_at)}</time>
              <span>·</span>
              <span>{mins} min read</span>
              <span className="ml-auto text-white/25 group-hover:text-white/50 transition-colors hidden sm:block">
                Read article →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function MediumCard({ post, index }: { post: DBPost; index: number }) {
  const mins = readingTime(post)
  return (
    <motion.div custom={index + 2} initial="hidden" animate="visible" variants={slideUp}>
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-card mb-4">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover opacity-45 group-hover:opacity-60 group-hover:scale-[1.04] transition-all duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/8 to-foreground/[0.02]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {post.tags.slice(0, 1).map((t) => (
              <span key={t} className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/35 border border-white/10 px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-foreground/70 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/25">
          <time>{formatDate(post.published_at)}</time>
          <span>·</span>
          <span>{mins} min</span>
        </div>
      </Link>
    </motion.div>
  )
}

function CompactRow({ post, index }: { post: DBPost; index: number }) {
  const mins = readingTime(post)
  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={fade}>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-baseline gap-4 py-3.5 border-b border-border/50 hover:border-border transition-colors"
      >
        <time className="text-[10px] font-mono text-foreground/20 shrink-0 w-[72px]">
          {formatDate(post.published_at)}
        </time>
        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-snug flex-1 min-w-0 truncate">
          {post.title}
        </span>
        <div className="flex items-center gap-2 shrink-0 hidden sm:flex">
          {post.tags.slice(0, 1).map((t) => (
            <span key={t} className="text-[9px] font-mono text-foreground/20">{t}</span>
          ))}
          <span className="text-[10px] font-mono text-foreground/15">{mins}m</span>
        </div>
        <span className="text-[10px] font-mono text-foreground/15 group-hover:text-foreground/40 transition-colors shrink-0">→</span>
      </Link>
    </motion.div>
  )
}

export function BlogListing({ posts }: { posts: DBPost[] }) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )

  const [hero, ...rest] = sorted
  const secondary = rest.slice(0, 4)
  const all = sorted

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-24 pb-10">
        <motion.div custom={0} initial="hidden" animate="visible" variants={slideUp} className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-foreground/25 mb-2">
              krix · blog
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-none">
              Writing
            </h1>
          </div>
          <p className="text-xs text-muted-foreground max-w-[200px] text-right leading-relaxed hidden sm:block">
            Notes on building games and web things.
          </p>
        </motion.div>

        {/* Hero post */}
        {hero && <HeroPost post={hero} />}
      </div>

      {/* Secondary grid */}
      {secondary.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {secondary.map((post, i) => (
              <MediumCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* All posts index */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-foreground/25 shrink-0">
            All posts
          </p>
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-[9px] font-mono text-foreground/15">{all.length}</span>
        </div>

        <div>
          {all.map((post, i) => (
            <CompactRow key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12">
        <div className="h-px bg-border/40" />
      </div>
    </div>
  )
}
