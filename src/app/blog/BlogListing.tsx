"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FileText } from "lucide-react"
import type { DBPost } from "@/lib/types"

const slideUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
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
        <div className="relative w-full aspect-[21/9] overflow-hidden bg-card">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover opacity-55 group-hover:opacity-70 group-hover:scale-[1.02] transition-all duration-700 ease-out"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/8 to-foreground/[0.02]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-12">
            <div className="flex items-center gap-2 mb-3">
              {post.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/15 px-2 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-bold text-white leading-tight tracking-tight mb-3 max-w-3xl">
              {post.title}
            </h2>
            <p className="text-sm text-white/45 leading-relaxed max-w-2xl mb-5 hidden sm:block line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-white/30">
              <time>{formatDate(post.published_at)}</time>
              <span>·</span>
              <span>{mins} min read</span>
              <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors hidden sm:block tracking-wide">
                Read article →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function PostCard({ post, index }: { post: DBPost; index: number }) {
  const mins = readingTime(post)
  return (
    <motion.div custom={index + 2} initial="hidden" animate="visible" variants={slideUp} className="flex flex-col h-full">
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-card mb-4 shrink-0">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.04] transition-all duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/8 to-foreground/[0.02]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            {post.tags.slice(0, 1).map((t) => (
              <span key={t} className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/35 border border-white/10 px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-foreground/65 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/25 mt-auto">
          <time>{formatDate(post.published_at)}</time>
          <span>·</span>
          <span>{mins} min read</span>
        </div>
      </Link>
    </motion.div>
  )
}

const HERO_IMAGE = "https://www.iclarified.com/images/news/94502/451898/451898.jpg"

export function BlogListing({ posts }: { posts: DBPost[] }) {
  const isFromDB = posts.some((p) => !p.id.startsWith("static-") && p.view_count === 0)
  const hasNoPosts = posts.length === 0

  const sorted = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  )

  const [hero, ...rest] = sorted

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

        <div className="absolute inset-0 flex flex-col justify-end max-w-6xl mx-auto px-5 sm:px-6 pb-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.35em] text-white/40 mb-2 font-mono"
          >
            Blog
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight mb-3"
          >
            Writing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="text-white/50 text-sm max-w-sm leading-relaxed"
          >
            Notes on Roblox development, web building, and everything in between.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
        {hasNoPosts ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 py-24 text-center"
          >
            <FileText className="size-10 text-foreground/15" />
            <p className="text-sm font-mono text-foreground/30 tracking-wide">
              No posts have been registered yet.
            </p>
            <p className="text-xs text-foreground/18 font-mono">Check back later.</p>
          </motion.div>
        ) : (
          <>
            {/* Hero post */}
            {hero && (
              <div className="mb-10">
                <HeroPost post={hero} />
              </div>
            )}

            {/* Remaining posts grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-7">
                  <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-foreground/25 shrink-0">
                    More articles
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
                  {rest.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
        <div className="h-px bg-border/40" />
      </div>
    </div>
  )
}
