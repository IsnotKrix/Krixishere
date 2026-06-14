"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  UIMessage,
  ChatStatus,
  CustomToolRendererProps,
} from "./types";

/* ── copy button ─────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
      }
      className="p-1 rounded text-zinc-600 hover:text-zinc-400 transition-colors"
      aria-label="Copy"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
            <Check className="w-3.5 h-3.5 text-primary" />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
            <Copy className="w-3.5 h-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ── default user message ────────────────────────────────────── */

function DefaultUserMessage({
  message,
  className,
}: {
  message: UIMessage;
  className?: string;
  enableImagePreview?: boolean;
}) {
  const text = message.parts.map((p) => p.text).join("");
  return (
    <div className={cn("flex justify-end", className)}>
      <div className="max-w-[78%] px-4 py-2.5 rounded-[20px] bg-[#2a2a2a] text-[13px] leading-[1.55] text-zinc-100">
        {text}
      </div>
    </div>
  );
}

/* ── assistant message ───────────────────────────────────────── */

function AssistantMessage({
  message,
  showCopy,
  streaming,
}: {
  message: UIMessage;
  showCopy?: boolean;
  streaming?: boolean;
}) {
  const text = message.parts.map((p) => p.text).join("");
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[13px] leading-[1.65] text-zinc-200 whitespace-pre-wrap">
        {text}
        {streaming && (
          <span className="inline-flex gap-0.5 ml-1.5 align-middle">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block w-1 h-1 rounded-full bg-zinc-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, delay: i * 0.17, repeat: Infinity }}
              />
            ))}
          </span>
        )}
      </p>
      {showCopy && text && !streaming && <CopyButton text={text} />}
    </div>
  );
}

/* ── message list ────────────────────────────────────────────── */

interface MessageListSlots {
  UserMessage?: React.ComponentType<{
    message: UIMessage;
    className?: string;
    enableImagePreview?: boolean;
  }>;
  ToolRenderer?: React.ComponentType<CustomToolRendererProps>;
}

interface MessageListClassNames {
  userMessage?: string;
}

interface MessageListProps {
  messages: UIMessage[];
  status: ChatStatus;
  className?: string;
  showCopyToolbar?: boolean;
  suppressQuestionTool?: boolean;
  initialScrollBehavior?: "bottom" | "top";
  enableImagePreview?: boolean;
  slots?: MessageListSlots;
  classNames?: MessageListClassNames;
  toolRenderers?: Record<string, React.ComponentType<CustomToolRendererProps>>;
}

export function MessageList({
  messages,
  status,
  className,
  showCopyToolbar,
  initialScrollBehavior = "bottom",
  enableImagePreview,
  slots,
  classNames,
}: MessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const UserMessageComponent = slots?.UserMessage ?? DefaultUserMessage;

  React.useEffect(() => {
    if (initialScrollBehavior === "bottom") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, initialScrollBehavior]);

  return (
    <div className={cn("flex-1 overflow-y-auto px-4 py-5 space-y-5", className)}>
      {messages.map((msg, i) => {
        const isStreaming =
          status === "streaming" &&
          i === messages.length - 1 &&
          msg.role === "assistant";

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {msg.role === "user" ? (
              <UserMessageComponent
                message={msg}
                className={classNames?.userMessage}
                enableImagePreview={enableImagePreview}
              />
            ) : (
              <AssistantMessage
                message={msg}
                showCopy={showCopyToolbar}
                streaming={isStreaming}
              />
            )}
          </motion.div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
