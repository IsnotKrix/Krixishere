"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GithubIcon } from "@/components/icons"

interface RepoButtonClientProps {
  stars: number | null
}

export function RepoButtonClient({ stars }: RepoButtonClientProps) {
  const [showStars, setShowStars] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href="https://github.com/isnotkrix/krixishere.org"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/70 backdrop-blur-md text-xs text-zinc-400 hover:text-white hover:border-white/25 transition-colors duration-200 overflow-hidden"
    >
      <span className="shrink-0"><GithubIcon size={13} /></span>

      <AnimatePresence mode="wait">
        {!showStars ? (
          <motion.span
            key="name"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-medium whitespace-nowrap"
          >
            isnotkrix/krixishere.org
          </motion.span>
        ) : (
          <motion.span
            key="stars"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-1.5 font-medium whitespace-nowrap"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-yellow-400"
              aria-hidden
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {stars !== null ? stars.toLocaleString() : "—"}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  )
}
