"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GithubIcon } from "@/components/icons"

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-foreground font-bold font-mono tracking-tight text-base hover:text-foreground/80 transition-colors">
          krix<span className="text-muted-foreground">.</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono rounded-md hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-border mx-2" />
          <a
            href="https://github.com/isnotkrix/krixishere"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/[0.04]"
            aria-label="GitHub"
          >
            <GithubIcon size={15} />
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
