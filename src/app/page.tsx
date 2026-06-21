"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"
import { ExternalLink, Clock } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import Image from "next/image"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13, ease: "easeOut" },
  }),
}

export default function Home() {
  const screenSize = useScreenSize()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://www.iclarified.com/images/news/94502/451898/451898.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />

        <GooeyFilter id="gooey-filter-hero" strength={8} />
        <div
          className="absolute inset-0 z-0"
          style={{ filter: "url(#gooey-filter-hero)" }}
        >
          <PixelTrail
            pixelSize={screenSize.lessThan("md") ? 16 : 28}
            fadeDuration={600}
            delay={0}
            pixelClassName="bg-white/40 rounded-full"
          />
        </div>

        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 mb-4 font-mono"
          >
            Roblox Developer
          </motion.p>
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[clamp(4rem,16vw,9rem)] font-bold text-white mb-5 tracking-tight leading-none"
          >
            Krix
          </motion.h1>
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-xs sm:max-w-sm md:max-w-md mx-auto leading-relaxed"
          >
            I build experiences in Roblox and on the web. Developer, creator, and builder of things that matter.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/30 tracking-widest uppercase font-mono">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-24 md:py-32 px-5 sm:px-6 max-w-4xl mx-auto scroll-mt-14">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3 font-mono">About</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              Roblox developer<br />turned web builder.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
              I started as a Roblox developer, designing and scripting games for millions of players. Over time, that passion evolved into building on the web — crafting clean, fast, purposeful digital products.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Whether it&apos;s a Roblox game or a web platform, the goal is always the same: build something people actually want to use.
            </p>
          </div>
          <div className="space-y-0">
            {[
              { label: "Platform", value: "Roblox" },
              { label: "Specialty", value: "Game Dev & Web Dev" },
              { label: "Focus", value: "User Experience" },
              { label: "Status", value: "Building" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-border">
                <span className="text-muted-foreground text-xs sm:text-sm font-mono">{item.label}</span>
                <span className="text-foreground text-xs sm:text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-14 sm:py-20 md:py-24 px-5 sm:px-6 max-w-4xl mx-auto scroll-mt-14">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3 font-mono">Projects</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12">What I&apos;ve built</h2>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <a
            href="/"
            className="group block p-6 sm:p-8 bg-card border border-border rounded-[var(--radius)] hover:border-foreground/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold font-mono">
                K
              </div>
              <ExternalLink className="size-3.5 sm:size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">krixishere.org</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              This website — my personal hub for projects, experiments, and everything I&apos;m working on.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 bg-foreground/5 border border-border rounded text-muted-foreground font-mono">
                Next.js
              </span>
              <span className="text-xs px-2 py-1 bg-foreground/5 border border-border rounded text-muted-foreground font-mono">
                Tailwind
              </span>
            </div>
          </a>

          <div className="p-6 sm:p-8 bg-card border border-dashed border-border rounded-[var(--radius)] opacity-60">
            <div className="flex items-start justify-between mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                <Clock className="size-3.5 sm:size-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">More coming soon</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              New projects are in the works. Stay tuned.
            </p>
          </div>
        </div>
      </section>

      <div className="h-10 sm:h-16" />
    </div>
  )
}
