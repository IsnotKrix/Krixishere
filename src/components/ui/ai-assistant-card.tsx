"use client"

import React, { useRef } from "react"
import {
  ChartNetwork,
  Image,
  Map,
  PenTool,
  ScanText,
  Sparkles,
  Paperclip,
  Keyboard,
  Mic,
  X,
  LayoutGrid,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const SUGGESTIONS = [
  { icon: <Image  className="text-blue-500"   aria-hidden />, label: "What's new?",      value: "What's new in the latest release?" },
  { icon: <ChartNetwork className="text-orange-500" aria-hidden />, label: "Analyze stack", value: "Analyze the tech stack used on this site." },
  { icon: <Map    className="text-green-500"  aria-hidden />, label: "Roadmap",          value: "What's coming next on this site?" },
  { icon: <ScanText className="text-pink-500"  aria-hidden />, label: "Summarize",       value: "Summarize all the changelog releases." },
  { icon: <PenTool className="text-yellow-500" aria-hidden />, label: "Help me write",   value: "Help me write a message for Krix." },
  { icon: <Sparkles className="text-purple-500" aria-hidden />, label: "More",           value: "What else can you help me with?" },
]

interface Props {
  onSend?: (message: string) => void
  onClose?: () => void
  userName?: string
}

export function AIAssistantCard({ onSend, onClose, userName = "there" }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = textareaRef.current?.value.trim()
    if (val) {
      onSend?.(val)
      if (textareaRef.current) textareaRef.current.value = ""
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <Card className="flex h-full w-full flex-col gap-6 p-4 shadow-none rounded-none border-0 bg-transparent">
      {/* Top actions */}
      <div className="flex flex-row items-center justify-end p-0 gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
          <LayoutGrid className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <CardContent className="flex flex-1 flex-col p-0 min-h-0">
        {/* Hero area */}
        <div className="flex flex-col items-center justify-center space-y-8 p-6">
          {/* Sparkles orb */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl scale-150" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/40 to-purple-900/60 border border-violet-500/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-white/90" />
            </div>
          </div>

          {/* Greeting */}
          <div className="flex flex-col space-y-2.5 text-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-medium tracking-tight text-muted-foreground">
                Hi {userName},
              </h2>
              <h3 className="text-lg font-medium tracking-tight">
                What can I help you with?
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ask about releases, the tech stack, or anything else about this site.
            </p>
          </div>

          {/* Suggestion badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <Badge
                key={s.label}
                variant="secondary"
                className="h-7 cursor-pointer gap-1.5 text-xs rounded-md px-2.5 hover:bg-accent transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0"
                onClick={() => onSend?.(s.value)}
              >
                {s.icon}
                {s.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="relative mt-auto flex-col rounded-md ring-1 ring-border">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything…"
              className="peer bg-transparent min-h-[100px] resize-none rounded-b-none border-none py-3 pl-9 pr-9 shadow-none focus-visible:ring-0"
              onKeyDown={handleKeyDown}
            />

            {/* Search icon */}
            <div className="pointer-events-none absolute left-0 top-[14px] flex items-center justify-center pl-3 text-muted-foreground/80">
              <Sparkles className="size-4" />
            </div>

            {/* Mic button */}
            <button
              type="button"
              aria-label="Record audio"
              className="absolute right-0 bottom-7 flex h-full w-9 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <Mic className="size-4" />
            </button>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between rounded-b-md border-t bg-muted/50 px-3 py-2">
            <Select defaultValue="haiku">
              <SelectTrigger size="sm" className="h-7 bg-background text-xs w-[110px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs" value="haiku">Claude Haiku</SelectItem>
                <SelectItem className="text-xs" value="sonnet">Claude Sonnet</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button type="button" className="h-7 px-2 gap-1.5 text-xs" variant="ghost">
                <Paperclip className="size-3.5 text-muted-foreground" />
                Attach
              </Button>
              <Button type="submit" className="h-7 px-2 gap-1.5 text-xs" variant="ghost">
                <Keyboard className="size-3.5 text-muted-foreground" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AIAssistantCard
