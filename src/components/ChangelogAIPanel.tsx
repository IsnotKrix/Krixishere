"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { X, Sparkles } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { AgentChat } from "@/components/agent-elements/agent-chat"
import type { UIMessage, ChatStatus } from "@/components/agent-elements/agent-chat"
import { AIAssistantCard } from "@/components/ui/ai-assistant-card"
import { ModelPicker } from "@/components/agent-elements/input/model-picker"
import { ModeSelector } from "@/components/agent-elements/input/mode-selector"
import { IconInfinity } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const MODELS = [
  { id: "gpt-5-mini",     name: "GPT",    version: "5 mini" },
  { id: "gemini-3-flash", name: "Gemini", version: "3 Flash" },
]

interface Props {
  open: boolean
  onClose: () => void
  /** When set, this message is auto-sent as soon as the panel opens */
  initialMessage?: string
}

export function ChangelogAIPanel({ open, onClose, initialMessage }: Props) {
  const { user }                = useUser()
  const userName                = user?.firstName ?? user?.username?.split(" ")[0] ?? "there"
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [status, setStatus]     = useState<ChatStatus>("ready")
  const [error, setError]       = useState<Error | undefined>()
  const [model, setModel]       = useState("gpt-5-mini")
  const abortRef                = useRef<AbortController | null>(null)
  const sentInitialRef          = useRef<string>("")

  const sendMessage = useCallback((content: string, selectedModel?: string) => {
    const userMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: content }],
      createdAt: new Date(),
    }
    const assistantId = crypto.randomUUID()
    const assistantMsg: UIMessage = {
      id: assistantId,
      role: "assistant",
      parts: [{ type: "text", text: "" }],
      createdAt: new Date(),
    }

    setMessages((prev) => {
      const next = [...prev, userMsg, assistantMsg]
      const apiMessages = next
        .filter((m) => m.id !== assistantId)
        .map((m) => ({ role: m.role, content: m.parts[0].text }))

      abortRef.current = new AbortController()
      setStatus("loading")
      setError(undefined)

      fetch("/api/changelog-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model: selectedModel ?? model }),
        signal: abortRef.current.signal,
      })
        .then(async (res) => {
          if (!res.ok || !res.body) throw new Error("Request failed")
          setStatus("streaming")
          const reader  = res.body.getReader()
          const decoder = new TextDecoder()
          let text = ""
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            text += decoder.decode(value, { stream: true })
            setMessages((ms) =>
              ms.map((m) =>
                m.id === assistantId
                  ? { ...m, parts: [{ type: "text" as const, text }] }
                  : m
              )
            )
          }
          setStatus("ready")
        })
        .catch((err) => {
          if ((err as Error).name === "AbortError") {
            setStatus("ready")
          } else {
            setError(err as Error)
            setStatus("error")
          }
        })

      return next
    })
  }, [])

  const handleSend = useCallback(
    (msg: { role: "user"; content: string }) => sendMessage(msg.content, model),
    [sendMessage, model]
  )

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    setStatus("ready")
  }, [])

  useEffect(() => {
    if (open && initialMessage && sentInitialRef.current !== initialMessage) {
      sentInitialRef.current = initialMessage
      setMessages([])
      const t = setTimeout(() => sendMessage(initialMessage), 200)
      return () => clearTimeout(t)
    }
  }, [open, initialMessage, sendMessage])

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort()
      sentInitialRef.current = ""
    }
  }, [open])

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 flex flex-col",
          "w-full sm:w-[380px]",
          "bg-[#0d0d0d] border-l border-white/[0.08]",
          "shadow-2xl shadow-black/60",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-md scale-150" />
              <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-700/30 border border-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Krix Assistant</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {messages.length === 0 ? (
            <AIAssistantCard
              userName={userName}
              onSend={(msg) => sendMessage(msg, model)}
              onClose={onClose}
              model={model}
              onModelChange={setModel}
            />
          ) : (
            <AgentChat
              messages={messages}
              onSend={handleSend}
              status={status}
              onStop={handleStop}
              error={error}
              className="h-full"
              leftActions={
                <>
                  <ModeSelector
                    modes={[{ id: "agent", label: "Agent", icon: IconInfinity }]}
                    defaultValue="agent"
                  />
                  <ModelPicker
                    models={MODELS}
                    value={model}
                    onChange={setModel}
                  />
                </>
              }
            />
          )}
        </div>
      </div>
    </>
  )
}
