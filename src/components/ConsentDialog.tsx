"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DiscordIcon } from "@/components/DiscordIcon"

interface ConsentDialogProps {
  open: boolean
  onClose: () => void
  callbackUrl?: string
}

export function ConsentDialog({ open, onClose, callbackUrl = "/" }: ConsentDialogProps) {
  const { signIn, fetchStatus } = useSignIn()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!accepted || loading || !signIn || fetchStatus !== "idle") return
    setLoading(true)
    const { error } = await signIn.sso({
      strategy: "oauth_discord",
      redirectUrl: callbackUrl,
      redirectCallbackUrl: "/",
    })
    if (error) setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <DiscordIcon className="size-4 text-[#5865F2]" />
                  <span className="text-sm font-semibold text-foreground">Login with Discord</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-foreground/30 hover:text-foreground/60 transition-colors rounded"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Before continuing, please review and accept the policies below.
                </p>

                {/* Policy links */}
                <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
                  <a
                    href="/terms"
                    target="_blank"
                    className="flex items-center justify-between px-3.5 py-3 hover:bg-foreground/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-medium text-foreground">Terms of Service</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Rules for using krixishere.org</p>
                    </div>
                    <svg className="size-3 text-foreground/20 group-hover:text-foreground/40 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a
                    href="/privacy"
                    target="_blank"
                    className="flex items-center justify-between px-3.5 py-3 hover:bg-foreground/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-medium text-foreground">Privacy Policy</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">Discord username, avatar &amp; ID only</p>
                    </div>
                    <svg className="size-3 text-foreground/20 group-hover:text-foreground/40 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                {/* Checkbox */}
                <Checkbox checked={accepted} onChange={setAccepted}>
                  <span className="text-[12px] text-muted-foreground leading-snug">
                    I have read and accept the{" "}
                    <a href="/terms" target="_blank" className="text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </Checkbox>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-1 flex flex-col gap-2">
                <button
                  onClick={handleLogin}
                  disabled={!accepted || loading || fetchStatus !== "idle"}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-sm font-mono border border-border text-foreground/70 hover:text-foreground hover:border-foreground/30 hover:bg-foreground/[0.04] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <DiscordIcon className="size-4 text-[#5865F2]" />
                  {loading ? "Redirecting…" : "Continue with Discord"}
                </button>
                <button
                  onClick={onClose}
                  className="text-[11px] font-mono text-foreground/20 hover:text-foreground/40 transition-colors text-center"
                >
                  cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
