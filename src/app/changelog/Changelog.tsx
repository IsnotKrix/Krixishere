"use client"

import { useState } from "react"
import { Copy, ExternalLink, GitPullRequest, Maximize2, Shield, LogOut, Sparkles } from "lucide-react"
import dynamic from "next/dynamic"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "@/components/DiscordIcon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ContentRenderer } from "@/components/ContentRenderer"
import { ChangelogAIPanel } from "@/components/ChangelogAIPanel"
import type { DBRelease } from "@/lib/types"

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
)

type Props = { releases: DBRelease[] }

export function Changelog({ releases }: Props) {
  const { data: session, status } = useSession()
  const authReady = status !== "loading"
  const user = session?.user ?? null
  const adminUser = session?.user?.isAdmin ?? false
  const [aiOpen, setAiOpen] = useState(false)

  const handleCopy = (version: string) => {
    const url = `${window.location.origin}/changelog#${version}`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Shader header */}
      <div className="relative w-full overflow-hidden min-h-[220px]">
        <MeshGradient
          colors={["#5b00ff", "#00ffa3", "#ff9a00", "#ea00ff"]}
          swirl={0.55}
          distortion={0.85}
          speed={0.1}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50" />

        <div className="relative container mx-auto px-6 py-14">
          <div className="flex flex-col gap-3 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="size-4" />
                  <p>Changelog</p>
                </div>

                {/* Ask AI button */}
                <button
                  onClick={() => setAiOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/70 hover:text-white hover:bg-violet-500/15 hover:border-violet-500/30 transition-all text-xs font-medium"
                >
                  <Sparkles className="size-3 text-violet-400" />
                  Ask AI
                </button>
              </div>

              {/* Auth bar */}
              {authReady && (
                <div className="flex items-center gap-2">
                  {user ? (
                    <>
                      {adminUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 rounded-full text-xs"
                        >
                          <a href="/admin">
                            <Shield className="size-3.5 mr-1.5" />
                            Admin Panel
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut()}
                        className="text-zinc-400 hover:text-white rounded-full text-xs"
                      >
                        <LogOut className="size-3.5 mr-1.5" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-white/80 border border-white/15 hover:bg-white/10 rounded-full text-xs gap-1.5"
                    >
                      <a href="/consent?callbackUrl=/changelog">
                        <DiscordIcon className="size-3.5" />
                        Login with Discord
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-4xl font-semibold text-white leading-snug">
              Latest product updates
              <br />& this website
            </h1>
          </div>
        </div>
      </div>

      {/* Release list */}
      <div className="container mx-auto px-6 border-x border-border max-w-5xl">
        {releases.map((item, idx) => (
          <Dialog key={idx}>
            <div
              id={item.version}
              className="relative flex flex-col lg:flex-row w-full py-16 gap-6 lg:gap-0 scroll-mt-20"
            >
              {/* Date column */}
              <div className="lg:sticky top-20 h-fit lg:w-36 shrink-0">
                <time className="text-muted-foreground text-sm font-medium">
                  {item.date}
                </time>
              </div>

              {/* Main content */}
              <div className="flex max-w-prose flex-col gap-4 lg:mx-auto">
                <h3 className="text-3xl font-medium lg:pt-10">{item.title}</h3>

                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="border-border max-h-96 w-full rounded-lg border object-cover transition-opacity group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-lg" />
                  </div>
                </DialogTrigger>

                <p className="text-muted-foreground text-sm font-medium">
                  {item.excerpt}
                </p>

                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-2">
                      {item.contributors.slice(0, 3).map((src, id) => (
                        <img
                          key={id}
                          src={src}
                          alt="Contributor"
                          className="border-border size-7 rounded-full border-2 border-[#0a0a0a] bg-zinc-800"
                        />
                      ))}
                    </div>
                    {item.contributors.length > 3 && (
                      <span className="text-muted-foreground text-sm">
                        +{item.contributors.length - 3} contributors
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Maximize2 className="size-4" />
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Show full release</p></TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(item.version)}
                          >
                            <Copy className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Copy link</p></TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={`/changelog#${item.version}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Open in new tab</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[200vw] bg-border" />
            </div>

            {/* Dialog */}
            <DialogContent className="p-0 gap-0 sm:max-w-prose max-h-[90vh] flex flex-col">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent z-10 pointer-events-none rounded-t-2xl" />

              <div className="relative shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-t-[calc(var(--radius-2xl)-1px)]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65 rounded-t-[calc(var(--radius-2xl)-1px)]" />
                <span className="absolute bottom-4 left-5 px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-600/75 text-white border border-violet-400/25 backdrop-blur-sm tracking-wide">
                  {item.version}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-5 space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-left text-xl leading-snug">
                      {item.title}
                    </DialogTitle>
                    <DialogDescription className="text-left leading-relaxed">
                      {item.excerpt}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="h-px bg-white/[0.06]" />

                  <ContentRenderer sections={item.content} />

                  {item.author_note && (
                    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
                      <p className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider mb-1">
                        Author note
                      </p>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {item.author_note}
                      </p>
                    </div>
                  )}

                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <time className="text-xs text-zinc-500">{item.date}</time>
                    <div className="flex items-center -space-x-2">
                      {item.contributors.map((src, id) => (
                        <img
                          key={id}
                          src={src}
                          alt="Contributor"
                          className="size-6 rounded-full border-2 border-[#111] bg-zinc-800"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <ChangelogAIPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </section>
  )
}
