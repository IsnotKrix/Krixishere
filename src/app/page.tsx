"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"
import { ExternalLink, Clock, Mail, Briefcase } from "lucide-react"
import { HeadphonesIcon } from "lucide-react"
import { motion, type Variants } from "framer-motion"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" },
  }),
}

export default function Home() {
  const screenSize = useScreenSize()

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <img
          src="https://www.iclarified.com/images/news/94502/451898/451898.jpg"
          alt="Background"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/55" />

        <GooeyFilter id="gooey-filter-hero" strength={8} />
        <div
          className="absolute inset-0 z-0"
          style={{ filter: "url(#gooey-filter-hero)" }}
        >
          <PixelTrail
            pixelSize={screenSize.lessThan("md") ? 20 : 28}
            fadeDuration={600}
            delay={0}
            pixelClassName="bg-white/40 rounded-full"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.3em] text-white/50 mb-5 font-mono"
          >
            Roblox Developer
          </motion.p>
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-tight leading-none"
          >
            Krix
          </motion.h1>
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-lg text-white/60 max-w-md mx-auto leading-relaxed"
          >
            I build experiences in Roblox and on the web. Developer, creator, and builder of things that matter.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 tracking-widest uppercase font-mono">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* About */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 font-mono">About</p>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Roblox developer<br />turned web builder.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I started as a Roblox developer, designing and scripting games for millions of players. Over time, that passion evolved into building on the web &mdash; crafting clean, fast, purposeful digital products.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether it&apos;s a Roblox game or a web platform, the goal is always the same: build something people actually want to use.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Platform", value: "Roblox" },
              { label: "Specialty", value: "Game Dev & Web Dev" },
              { label: "Focus", value: "User Experience" },
              { label: "Status", value: "Building" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground text-sm font-mono">{item.label}</span>
                <span className="text-foreground text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 font-mono">Projects</p>
        <h2 className="text-4xl font-bold mb-12">What I&apos;ve built</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/"
            className="group block p-8 bg-card border border-border rounded-[var(--radius)] hover:border-foreground/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold font-mono">
                K
              </div>
              <ExternalLink className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <h3 className="text-lg font-semibold mb-2">krixishere.org</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              This website &mdash; my personal hub for projects, experiments, and everything I&apos;m working on.
            </p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-foreground/5 border border-border rounded text-muted-foreground font-mono">
                Next.js
              </span>
              <span className="text-xs px-2 py-1 bg-foreground/5 border border-border rounded text-muted-foreground font-mono">
                Tailwind
              </span>
            </div>
          </a>

          <div className="p-8 bg-card border border-dashed border-border rounded-[var(--radius)] opacity-60">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                <Clock className="size-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">More coming soon</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              New projects are in the works. Stay tuned.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-14 sm:py-20 md:py-24 px-5 sm:px-6 max-w-4xl mx-auto scroll-mt-14">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3 font-mono">Contact</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12">Get in touch</h2>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <a
            href="mailto:hello@krixishere.org"
            className="group flex flex-col gap-4 p-6 sm:p-8 bg-card border border-border rounded-[var(--radius)] hover:border-foreground/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                <Briefcase className="size-4 text-foreground/50" />
              </div>
              <Mail className="size-3.5 sm:size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Business</p>
              <p className="text-sm sm:text-base font-semibold text-foreground group-hover:text-foreground/80 transition-colors">hello@krixishere.org</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Partnerships, collaborations, and business inquiries.</p>
            </div>
          </a>

          <a
            href="mailto:support@krixishere.org"
            className="group flex flex-col gap-4 p-6 sm:p-8 bg-card border border-border rounded-[var(--radius)] hover:border-foreground/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                <HeadphonesIcon className="size-4 text-foreground/50" />
              </div>
              <Mail className="size-3.5 sm:size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Technical Support</p>
              <p className="text-sm sm:text-base font-semibold text-foreground group-hover:text-foreground/80 transition-colors">support@krixishere.org</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Bug reports, technical issues, and support requests.</p>
            </div>
          </a>
        </div>
      </section>

      <div className="h-16" />
    </div>
  )
}
