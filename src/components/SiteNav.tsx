"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GithubIcon } from "@/components/icons"

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
]

const glassStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
  backdropFilter: "blur(48px) saturate(200%)",
  WebkitBackdropFilter: "blur(48px) saturate(200%)",
  boxShadow:
    "0 0 0 1px rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
}

export function SiteNav() {
  const [hovered, setHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false)
    }
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  const isExpanded = isMobile ? mobileOpen : hovered

  const closeMenu = () => setMobileOpen(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center"
    >
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={closeMenu}
        />
      )}

      <motion.div
        layout
        transition={{ layout: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }}
        className="pointer-events-auto mt-4 rounded-2xl overflow-hidden"
        style={glassStyle}
        onHoverStart={() => !isMobile && setHovered(true)}
        onHoverEnd={() => !isMobile && setHovered(false)}
      >
        <div className="h-10 flex items-center px-3 min-w-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {isExpanded ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-0.5 whitespace-nowrap"
              >
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="px-2.5 py-1 text-xs font-bold font-mono text-white/85 hover:text-white transition-colors duration-150 tracking-tight"
                >
                  krix<span className="text-white/30">.</span>
                </Link>
                <div className="w-px h-3 bg-white/[0.12] mx-1.5" />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="px-2.5 py-1 text-xs text-white/55 hover:text-white/90 transition-colors duration-150 font-mono rounded-lg hover:bg-white/[0.07] tracking-wide"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="w-px h-3 bg-white/[0.12] mx-1.5" />
                <a
                  href="https://github.com/isnotkrix/krixishere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-white/55 hover:text-white/90 transition-colors duration-150 rounded-lg hover:bg-white/[0.07]"
                  aria-label="GitHub"
                >
                  <GithubIcon size={13} />
                </a>
              </motion.div>
            ) : (
              <motion.button
                key="burger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                onClick={() => isMobile && setMobileOpen(true)}
                className="flex flex-col gap-[4.5px] items-center justify-center w-5 h-5 cursor-pointer md:cursor-default"
                aria-label="Open navigation"
              >
                <span className="block w-3.5 h-px bg-white/55 rounded-full" />
                <span className="block w-3.5 h-px bg-white/55 rounded-full" />
                <span className="block w-2.5 h-px bg-white/55 rounded-full" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.header>
  )
}
