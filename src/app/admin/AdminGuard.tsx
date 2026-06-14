"use client"

import { useSession } from "next-auth/react"
import { Loader2, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "@/components/DiscordIcon"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") return <Fullscreen><LoadingView /></Fullscreen>
  if (status === "unauthenticated") return <Fullscreen><UnauthenticatedView /></Fullscreen>
  if (!session?.user?.isAdmin) return <Fullscreen><UnauthorizedView /></Fullscreen>

  return <>{children}</>
}

function Fullscreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      {children}
    </div>
  )
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center gap-4 animate-[fadeSlideIn_0.35s_ease_forwards]">
      <Loader2 className="size-8 text-violet-400 animate-spin" />
      <p className="text-zinc-400 text-sm font-medium tracking-wide">
        Checking authorization…
      </p>
    </div>
  )
}

function UnauthenticatedView() {
  return (
    <div className="flex flex-col items-center gap-6 animate-[bounceUp_0.65s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
      <div className="size-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/25 flex items-center justify-center">
        <DiscordIcon className="size-8 text-[#5865F2]" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-white text-xl font-semibold">Login required</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
          Login with Discord to verify your identity
          <br />
          and get access to the admin panel.
        </p>
      </div>

      <Button
        asChild
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full px-6 gap-2.5 font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      >
        <a href="/consent?callbackUrl=/admin">
          <DiscordIcon className="size-4" />
          Login with Discord
        </a>
      </Button>
    </div>
  )
}

function UnauthorizedView() {
  return (
    <div className="flex flex-col items-center gap-5 animate-[fadeSlideIn_0.4s_ease_forwards]">
      <div className="size-16 rounded-2xl bg-red-500/8 border border-red-500/20 flex items-center justify-center">
        <ShieldOff className="size-7 text-red-400" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-white text-xl font-semibold">Access denied</h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
          You are not authorized to access this section.
          <br />
          Contact the administrator.
        </p>
      </div>

      <a
        href="/changelog"
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
      >
        Back to Changelog
      </a>
    </div>
  )
}
