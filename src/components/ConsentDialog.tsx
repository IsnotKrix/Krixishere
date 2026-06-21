"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "@/components/DiscordIcon"

interface Props {
  open: boolean
  onClose: () => void
  callbackUrl?: string
}

export function ConsentDialog({ open, onClose, callbackUrl = "/" }: Props) {
  const { signIn, fetchStatus } = useSignIn()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading]   = useState(false)

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

  const handleClose = () => {
    if (loading) return
    setAccepted(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden border-white/[0.08] bg-[#111]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent pointer-events-none" />

        <div className="flex flex-col items-center gap-6 px-6 py-8">
          <div className="size-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
            <DiscordIcon className="size-8 text-[#5865F2]" />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-semibold text-white">Login with Discord</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Before continuing, please review our policies.
            </p>
          </div>

          <div className="w-full rounded-xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05]">
            <a
              href="/terms"
              target="_blank"
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-white">Terms of Service</p>
                <p className="text-xs text-zinc-500 mt-0.5">Rules for using krixishere.org</p>
              </div>
              <svg className="size-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="/privacy"
              target="_blank"
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-white">Privacy Policy</p>
                <p className="text-xs text-zinc-500 mt-0.5">We only collect Discord username, avatar &amp; ID</p>
              </div>
              <svg className="size-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div className="w-full">
            <Checkbox checked={accepted} onChange={setAccepted}>
              I have read and accept the{" "}
              <a href="/terms" target="_blank" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                Privacy Policy
              </a>
            </Checkbox>
          </div>

          <Button
            onClick={handleLogin}
            disabled={!accepted || loading || fetchStatus !== "idle"}
            className="w-full rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2.5 h-11 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <DiscordIcon className="size-4" />
            {loading ? "Redirecting…" : "Continue with Discord"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
