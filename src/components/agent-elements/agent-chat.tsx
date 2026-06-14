"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "./error-message";
import { MessageList } from "./message-list";
import { InputBar } from "./input-bar";
import type {
  UIMessage,
  ChatStatus,
  SuggestionItem,
  CustomToolRendererProps,
  AttachedImage,
  AttachedFile,
} from "./types";

export type { UIMessage, ChatStatus, SuggestionItem };

/* ── types ───────────────────────────────────────────────────── */

export interface InputSuggestions {
  items: SuggestionItem[];
  className?: string;
  itemClassName?: string;
}

interface ChatClassNames {
  root?: string;
  messages?: string;
  input?: string;
  bubble?: string;
}

interface ChatAttachments {
  onAttach?: () => void;
  images?: AttachedImage[];
  files?: AttachedFile[];
  onRemoveImage?: (id: string) => void;
  onRemoveFile?: (id: string) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  isDragOver?: boolean;
}

interface AgentChatProps {
  messages: UIMessage[];
  onSend: (message: { role: "user"; content: string }) => void;
  status: ChatStatus;
  onStop: () => void;
  error?: Error;
  classNames?: Partial<ChatClassNames>;
  slots?: {
    UserMessage?: React.ComponentType<{
      message: UIMessage;
      className?: string;
      enableImagePreview?: boolean;
    }>;
    ToolRenderer?: React.ComponentType<CustomToolRendererProps>;
  };
  toolRenderers?: Record<string, React.ComponentType<CustomToolRendererProps>>;
  attachments?: ChatAttachments;
  showCopyToolbar?: boolean;
  initialScrollBehavior?: "bottom" | "top";
  enableImagePreview?: boolean;
  suggestions?: InputSuggestions;
  emptyStatePosition?: "default" | "center";
  emptySuggestionsPlacement?: "input" | "empty" | "both";
  emptySuggestionsPosition?: "top" | "bottom";
  questionTool?: {
    submitLabel?: string;
    skipLabel?: string;
    allowSkip?: boolean;
    onAnswer?: (payload: {
      toolCallId?: string;
      question: unknown;
      answer: unknown;
    }) => void;
  };
  className?: string;
  style?: React.CSSProperties;
}

/* ── empty state ─────────────────────────────────────────────── */

function EmptyState({
  position,
  suggestions,
  suggestionsPlacement,
  suggestionsPosition,
  onSelect,
}: {
  position: "default" | "center";
  suggestions?: InputSuggestions;
  suggestionsPlacement?: "input" | "empty" | "both";
  suggestionsPosition?: "top" | "bottom";
  onSelect: (value: string) => void;
}) {
  const showSuggestions =
    suggestions &&
    (suggestionsPlacement === "empty" || suggestionsPlacement === "both");

  const pills = showSuggestions ? (
    <div className="flex flex-wrap gap-2 justify-center max-w-[260px]">
      {suggestions.items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.value)}
          className={cn(
            "px-3 py-1.5 rounded-full border border-white/8 bg-white/4 text-[11px] text-zinc-400",
            "hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all",
            suggestions.itemClassName,
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 px-6",
        position === "center" ? "flex-1 justify-center pb-4" : "pt-10",
      )}
    >
      {/* Glow icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-150" />
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-700/30 border border-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-[13px] font-medium text-zinc-200">How can I help?</p>
        <p className="text-[11px] text-zinc-600 leading-relaxed">
          Ask about releases, features, or the tech stack.
        </p>
      </div>

      {suggestionsPosition !== "bottom" && pills}
      {suggestionsPosition === "bottom" && pills}
    </div>
  );
}

/* ── agent chat ──────────────────────────────────────────────── */

export function AgentChat({
  messages,
  onSend,
  status,
  onStop,
  error,
  classNames,
  slots,
  toolRenderers,
  attachments,
  showCopyToolbar,
  initialScrollBehavior = "bottom",
  enableImagePreview,
  suggestions,
  emptyStatePosition = "default",
  emptySuggestionsPlacement,
  emptySuggestionsPosition,
  className,
  style,
}: AgentChatProps) {
  const [injectedValue, setInjectedValue] = React.useState("");
  const isEmpty = messages.length === 0;

  const showInputSuggestions =
    suggestions &&
    isEmpty &&
    (emptySuggestionsPlacement === "input" || emptySuggestionsPlacement === "both");

  return (
    <div
      className={cn("flex flex-col h-full", className, classNames?.root)}
      style={style}
    >
      {/* Message area or empty state */}
      {isEmpty ? (
        <div className={cn("flex flex-col flex-1 min-h-0", classNames?.messages)}>
          <EmptyState
            position={emptyStatePosition}
            suggestions={suggestions}
            suggestionsPlacement={emptySuggestionsPlacement}
            suggestionsPosition={emptySuggestionsPosition}
            onSelect={(v) => setInjectedValue(v)}
          />
        </div>
      ) : (
        <MessageList
          messages={messages}
          status={status}
          className={classNames?.messages}
          showCopyToolbar={showCopyToolbar}
          initialScrollBehavior={initialScrollBehavior}
          enableImagePreview={enableImagePreview}
          slots={slots}
          toolRenderers={toolRenderers}
        />
      )}

      {error && (
        <div className="px-4 pb-2">
          <ErrorMessage message={error.message} />
        </div>
      )}

      {/* Input bar */}
      <div className={cn("shrink-0 px-3 pb-3 pt-1", classNames?.input)}>
        {showInputSuggestions && (
          <div className={cn("flex flex-wrap gap-1.5 mb-2", suggestions.className)}>
            {suggestions.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setInjectedValue(item.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-xs text-zinc-400 hover:text-white hover:border-primary/40 hover:bg-primary/8 transition-all",
                  suggestions.itemClassName,
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <InputBar
          onSend={(msg) => {
            setInjectedValue("");
            onSend(msg);
          }}
          status={status}
          onStop={onStop}
          value={injectedValue || undefined}
          onChange={setInjectedValue}
          onAttach={attachments?.onAttach}
          attachedImages={attachments?.images}
          attachedFiles={attachments?.files}
          onRemoveImage={attachments?.onRemoveImage}
          onRemoveFile={attachments?.onRemoveFile}
          onPaste={attachments?.onPaste}
          isDragOver={attachments?.isDragOver}
          enableImagePreview={enableImagePreview}
        />
      </div>
    </div>
  );
}
