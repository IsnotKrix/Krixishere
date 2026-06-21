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
    const check = () => setScrolled(window.scrollY > 50)
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div
        className={`pointer-events-auto transition-all duration-500 ease-in-out ${
          scrolled
            ? "mx-4 mt-3 rounded-2xl bg-[#161616]/90 backdrop-blur-2xl ring-1 ring-white/[0.07] shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
            : "mx-0 mt-0 rounded-none bg-transparent"
        }`}
      >
        <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-foreground/90 font-bold font-mono tracking-tight text-sm hover:text-foreground transition-colors duration-200"
          >
            krix<span className="text-muted-foreground/50">.</span>
          </Link>

          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground/90 transition-colors duration-200 font-mono rounded-lg hover:bg-white/[0.05] tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-3.5 bg-white/10 mx-1.5" />
            <a
              href="https://github.com/isnotkrix/krixishere"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground hover:text-foreground/90 transition-colors duration-200 rounded-lg hover:bg-white/[0.05]"
              aria-label="GitHub"
            >
              <GithubIcon size={14} />
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
