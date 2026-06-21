"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import Link from "next/link"
import { CanvasRevealEffect } from "@/components/ui/sign-in-flow-1"
import { ConsentDialog } from "@/components/ConsentDialog"
import { DiscordIcon } from "@/components/DiscordIcon"

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const { status } = useSession()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border border-white/20 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated dot matrix background */}
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[255, 255, 255], [255, 255, 255]]}
          dotSize={6}
          showGradient={false}
          reverse={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(0,0,0,0.88)_0%,transparent_100%)]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-10 text-center"
        >
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/25 mb-6">
              krixishere.org
            </p>
            <h1 className="text-5xl font-bold text-white tracking-tight leading-none mb-3">
              Welcome
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Sign in to access your account.
            </p>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={() => setDialogOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/25 text-white text-sm font-mono transition-all duration-200 backdrop-blur-sm"
            >
              <DiscordIcon className="size-4 text-[#5865F2]" />
              Continue with Discord
            </button>

            <Link
              href="/"
              className="block text-[11px] font-mono text-white/20 hover:text-white/50 transition-colors"
            >
              ← back to home
            </Link>
          </div>

          <p className="text-[10px] font-mono text-white/15 leading-relaxed max-w-xs">
            By signing in you agree to our{" "}
            <Link href="/terms" className="text-white/30 hover:text-white/55 underline underline-offset-2 transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-white/30 hover:text-white/55 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>

      <ConsentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        callbackUrl={callbackUrl}
      />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
