"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "@/components/DiscordIcon"

function ConsentForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!accepted) return
    setLoading(true)
    await signIn("discord", { callbackUrl })
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-[bounceUp_0.55s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
      {/* Discord icon */}
      <div className="size-20 rounded-3xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center">
        <DiscordIcon className="size-10 text-[#5865F2]" />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-white">Login with Discord</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Before continuing, please review our policies.
        </p>
      </div>

      {/* Policy links */}
      <div className="w-full rounded-xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05]">
        <a
          href="/terms"
          target="_blank"
          className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors group"
        >
          <div>
            <p className="text-sm font-medium text-white">Terms of Service</p>
            <p className="text-xs text-zinc-500 mt-0.5">Rules for using krixishere.org</p>
          </div>
          <svg className="size-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a
          href="/privacy"
          target="_blank"
          className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors group"
        >
          <div>
            <p className="text-sm font-medium text-white">Privacy Policy</p>
            <p className="text-xs text-zinc-500 mt-0.5">We only collect your Discord username, avatar & ID</p>
          </div>
          <svg className="size-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Checkbox */}
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

      {/* Login button */}
      <Button
        onClick={handleLogin}
        disabled={!accepted || loading}
        className="w-full rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2.5 h-11 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
      >
        <DiscordIcon className="size-4" />
        {loading ? "Redirecting…" : "Continue with Discord"}
      </Button>

      <a href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
        ← Go back
      </a>
    </div>
  )
}

export default function ConsentPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-16">
      <Suspense>
        <ConsentForm />
      </Suspense>
    </div>
  )
}
