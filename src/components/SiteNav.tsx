"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { GithubIcon } from "@/components/icons"

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Changelog", href: "/changelog" },
]

export function SiteNav() {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center"
    >
      <div
        className="pointer-events-auto mt-4 rounded-2xl bg-[#161616]/90 backdrop-blur-2xl ring-1 ring-white/[0.07] shadow-[0_4px_32px_rgba(0,0,0,0.5)] overflow-hidden"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="h-10 flex items-center px-3">
          {/* Hamburger icon — always visible */}
          <div className="flex flex-col gap-[4px] w-6 items-center justify-center shrink-0">
            <span className="block w-3.5 h-px bg-white/55 rounded-full" />
            <span className="block w-3.5 h-px bg-white/55 rounded-full" />
            <span className="block w-2.5 h-px bg-white/55 rounded-full" />
          </div>

          {/* Expandable nav links */}
          <motion.div
            animate={{
              maxWidth: expanded ? 480 : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden flex items-center"
            style={{ pointerEvents: expanded ? "auto" : "none" }}
          >
            <div className="flex items-center whitespace-nowrap pl-1 pr-2 gap-0.5">
              <div className="w-px h-3 bg-white/10 mx-2" />
              <Link
                href="/"
                className="px-2 py-1 text-xs font-bold font-mono text-foreground/90 hover:text-foreground transition-colors duration-150 tracking-tight"
              >
                krix<span className="text-muted-foreground/50">.</span>
              </Link>
              <div className="w-px h-3 bg-white/10 mx-1.5" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground/90 transition-colors duration-150 font-mono rounded-lg hover:bg-white/[0.05] tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-3 bg-white/10 mx-1.5" />
              <a
                href="https://github.com/isnotkrix/krixishere"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-foreground/90 transition-colors duration-150 rounded-lg hover:bg-white/[0.05]"
                aria-label="GitHub"
              >
                <GithubIcon size={13} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
