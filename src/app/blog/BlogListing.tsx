"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { DBPost } from "@/lib/types"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
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

function PostCard({ post, index }: { post: DBPost; index: number }) {
  const mins = readingTime(post)
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-all duration-300"
      >
        {post.image && (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/30 bg-foreground/[0.05] border border-border px-1.5 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-foreground/80 transition-colors">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <time className="text-[10px] font-mono text-foreground/25">{formatDate(post.published_at)}</time>
            <span className="text-[10px] font-mono text-foreground/25">{mins} min read</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function PostRow({ post, index }: { post: DBPost; index: number }) {
  const mins = readingTime(post)
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group grid md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 py-4 border-b border-border hover:bg-foreground/[0.015] -mx-6 px-6 transition-colors"
      >
        <div className="flex md:flex-col items-start gap-2 md:gap-0.5">
          <time className="text-[10px] font-mono text-foreground/30">{formatDate(post.published_at)}</time>
          <span className="text-[10px] font-mono text-foreground/20">{mins} min</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground/70 transition-colors truncate">
            {post.title}
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] font-mono text-muted-foreground bg-foreground/[0.04] border border-border px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
        <span className="text-[10px] font-mono text-foreground/20 group-hover:text-foreground/50 transition-colors self-center shrink-0 hidden md:block">
          read →
        </span>
      </Link>
    </motion.div>
  )
}

export function BlogListing({ posts }: { posts: DBPost[] }) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )
  const latest = sorted.slice(0, 3)
  const popular = [...posts]
    .sort((a, b) => b.view_count - a.view_count)
    .filter((p) => p.view_count > 0)
    .slice(0, 3)
  const featured = posts.filter((p) => p.is_featured)
  const showPopular = popular.length > 0
  const showFeatured = featured.length > 0 && !showPopular

  const totalMins = posts.reduce((acc, p) => acc + readingTime(p), 0)
  const avgMins = posts.length ? Math.round(totalMins / posts.length) : 0

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-mono mb-3">
            krix. / blog
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-4">
            Blog
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
            Thoughts on Roblox development, web building, and everything in between.
          </p>
        </motion.div>
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">{posts.length} posts</span>
          </div>
          {avgMins > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.04] border border-border rounded-full">
              <span className="text-xs font-mono text-muted-foreground">{avgMins} min avg read</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Latest */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[10px] uppercase tracking-[0.3em] text-foreground/25 font-mono mb-6"
        >
          Latest
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map((post, i) => (
            <PostCard key={post.id} post={post} index={i + 3} />
          ))}
        </div>
      </section>

      {/* Popular / Featured */}
      {(showPopular || showFeatured) && (
        <>
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[9px] font-mono text-foreground/15 uppercase tracking-[0.3em]">
                {showPopular ? "popular" : "featured"}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
          </div>
          <section className="max-w-5xl mx-auto px-6 py-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showPopular ? popular : featured).map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* All posts */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[9px] font-mono text-foreground/15 uppercase tracking-[0.3em]">all posts</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div>
          {sorted.map((post, i) => (
            <PostRow key={post.id} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* End marker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-16 flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono text-foreground/15 uppercase tracking-[0.3em]">end</span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>
    </div>
  )
}
