"use client"

import React from "react"
import {
  ChartNetwork,
  Image,
  Map,
  PenTool,
  ScanText,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { InputBar } from "@/components/agent-elements/input-bar"
import { ModelPicker } from "@/components/agent-elements/input/model-picker"

const SUGGESTIONS = [
  { icon: <Image  className="text-blue-500"   aria-hidden />, label: "What's new?",    value: "What's new in the latest release?" },
  { icon: <ChartNetwork className="text-orange-500" aria-hidden />, label: "Analyze stack", value: "Analyze the tech stack used on this site." },
  { icon: <Map    className="text-green-500"  aria-hidden />, label: "Roadmap",        value: "What's coming next on this site?" },
  { icon: <ScanText className="text-pink-500"  aria-hidden />, label: "Summarize",     value: "Summarize all the changelog releases." },
  { icon: <PenTool className="text-yellow-500" aria-hidden />, label: "Help me write", value: "Help me write a message for Krix." },
  { icon: <Sparkles className="text-purple-500" aria-hidden />, label: "More",         value: "What else can you help me with?" },
]

const MODELS = [
  { id: "haiku",  name: "Claude", version: "Haiku" },
  { id: "sonnet", name: "Claude", version: "Sonnet" },
]

interface Props {
  onSend?: (message: string) => void
  onClose?: () => void
  userName?: string
}

export function AIAssistantCard({ onSend, userName = "there" }: Props) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Hero area */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-8 p-6 min-h-0 overflow-y-auto">
        {/* Sparkles orb */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl scale-150" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/40 to-purple-900/60 border border-violet-500/30 flex items-center justify-center shadow-inner">
            <Sparkles className="w-6 h-6 text-white/90" />
          </div>
        </div>

        {/* Greeting */}
        <div className="flex flex-col space-y-2.5 text-center shrink-0">
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
        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
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

      {/* Input area — uses the existing agent-elements InputBar for consistent dark styling */}
      <div className="shrink-0 px-3 pb-3 pt-1">
        <InputBar
          onSend={(msg) => onSend?.(msg.content)}
          status="ready"
          onStop={() => {}}
          placeholder="Ask me anything…"
          leftActions={
            <ModelPicker models={MODELS} defaultValue="haiku" />
          }
        />
      </div>
    </div>
  )
}

export default AIAssistantCard
