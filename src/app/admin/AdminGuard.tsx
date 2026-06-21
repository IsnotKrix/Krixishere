"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { ShieldOff, Loader2 } from "lucide-react"
import { DiscordIcon } from "@/components/DiscordIcon"
import { ConsentDialog } from "@/components/ConsentDialog"
import Link from "next/link"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") return <Fullscreen><LoadingView /></Fullscreen>
  if (status === "unauthenticated") return <Fullscreen><UnauthenticatedView /></Fullscreen>
  if (!session?.user?.isAdmin) return <Fullscreen><UnauthorizedView /></Fullscreen>

  return <>{children}</>
}

function Fullscreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      {children}
    </div>
  )
}

function LoadingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-5"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-border" />
        <Loader2 className="size-4 text-foreground/40 animate-spin" />
      </div>
      <p className="text-xs font-mono text-foreground/30 uppercase tracking-[0.3em]">
        checking auth…
      </p>
    </motion.div>
  )
}

function UnauthenticatedView() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-8 text-center max-w-xs"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/25 font-mono mb-4">
            krix. / admin
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent mx-auto mb-4" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">Login required</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in with Discord to verify your identity and access the admin panel.
          </p>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center justify-center gap-2.5 w-full px-5 py-2.5 border border-border rounded-lg text-sm font-mono text-foreground/70 hover:text-foreground hover:border-foreground/30 hover:bg-foreground/[0.04] transition-all"
          >
            <DiscordIcon className="size-4 text-[#5865F2]" />
            Login with Discord
          </button>
          <Link
            href="/"
            className="block text-xs font-mono text-foreground/25 hover:text-foreground/50 transition-colors"
          >
            ← back to home
          </Link>
        </div>
      </motion.div>

      <ConsentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        callbackUrl="/admin"
      />
    </>
  )
}

function UnauthorizedView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-8 text-center max-w-xs"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/25 font-mono mb-4">
          krix. / admin
        </p>
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent mx-auto mb-4" />
        <div className="flex items-center justify-center mb-3">
          <ShieldOff className="size-5 text-foreground/20" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Access denied</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your account does not have admin privileges. Contact the administrator.
        </p>
      </div>

      <Link
        href="/changelog"
        className="text-xs font-mono text-foreground/25 hover:text-foreground/50 transition-colors"
      >
        ← back to changelog
      </Link>
    </motion.div>
  )
}
