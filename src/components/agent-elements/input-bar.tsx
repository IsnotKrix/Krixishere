"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { IconInfinity } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SendButton } from "./input/send-button";
import { ModelPicker } from "./input/model-picker";
import { ModeSelector } from "./input/mode-selector";
import type {
  ChatStatus,
  SuggestionItem,
  AttachedImage,
  AttachedFile,
  QuestionConfig,
  QuestionAnswer,
} from "./types";

/* ── internal types ──────────────────────────────────────────── */

interface InfoBarConfig {
  title?: string;
  description?: string;
  onClose?: () => void;
  position?: "top" | "bottom";
  action?: { label: string; onClick: () => void };
}

interface QuestionBarConfig {
  id: string;
  questions: QuestionConfig[];
  questionIndex?: number;
  totalQuestions?: number;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  submitLabel?: string;
  skipLabel?: string;
  allowSkip?: boolean;
  onSubmit: (answer: QuestionAnswer) => void;
  onSkip?: () => void;
}

interface TypingAnimationConfig {
  text: string;
  duration: number;
  image?: string;
  isActive: boolean;
  onComplete: () => void;
}

type SuggestionsConfig =
  | SuggestionItem[]
  | { items: SuggestionItem[]; className?: string; itemClassName?: string };

export interface InputBarProps {
  onSend: (message: { role: "user"; content: string }) => void;
  status: ChatStatus;
  onStop: () => void;
  placeholder?: string;
  className?: string;
  onAttach?: () => void;
  attachedImages?: AttachedImage[];
  attachedFiles?: AttachedFile[];
  onRemoveImage?: (id: string) => void;
  onRemoveFile?: (id: string) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  isDragOver?: boolean;
  enableImagePreview?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  suggestions?: SuggestionsConfig;
  typingAnimation?: TypingAnimationConfig;
  infoBar?: InfoBarConfig;
  questionBar?: QuestionBarConfig;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

/* ── helpers ─────────────────────────────────────────────────── */

function normalizeSuggestions(s: SuggestionsConfig) {
  return Array.isArray(s) ? { items: s } : s;
}

function formatBytes(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── info bar ────────────────────────────────────────────────── */

function InfoBar({ config }: { config: InfoBarConfig }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-xs text-zinc-400">
      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
      <div className="flex-1 min-w-0">
        {config.title && <span className="font-medium text-zinc-200 mr-1">{config.title}</span>}
        {config.description && <span>{config.description}</span>}
      </div>
      {config.action && (
        <button onClick={config.action.onClick} className="shrink-0 text-primary hover:text-primary/80 font-medium transition-colors">
          {config.action.label}
        </button>
      )}
      {config.onClose && (
        <button onClick={config.onClose} className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors" aria-label="Dismiss">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ── question bar ────────────────────────────────────────────── */

function QuestionBar({ config }: { config: QuestionBarConfig }) {
  const idx = config.questionIndex ?? 0;
  const question = config.questions[idx];
  const total = config.totalQuestions ?? config.questions.length;
  const [selected, setSelected] = React.useState<string[]>([]);
  const [custom, setCustom] = React.useState("");
  if (!question) return null;

  const toggle = (id: string) => {
    setSelected(question.kind === "single" ? [id] : (prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const submit = () => {
    config.onSubmit(
      question.kind === "single"
        ? { optionId: selected[0] ?? "", custom: custom || undefined }
        : { optionIds: selected, custom: custom || undefined }
    );
    setSelected([]); setCustom("");
  };

  return (
    <div className="px-3 py-3 border border-white/8 rounded-xl bg-white/3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-200">{question.title}</p>
        {total > 1 && (
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            {config.onPreviousQuestion && <button onClick={config.onPreviousQuestion} disabled={idx === 0} className="p-0.5 disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5" /></button>}
            <span>{idx + 1}/{total}</span>
            {config.onNextQuestion && <button onClick={config.onNextQuestion} disabled={idx >= total - 1} className="p-0.5 disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5" /></button>}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {question.options.map((opt) => (
          <button key={opt.id} onClick={() => toggle(opt.id)}
            className={cn("px-3 py-1.5 rounded-full text-xs border transition-all",
              selected.includes(opt.id) ? "bg-primary/20 border-primary/60 text-primary" : "bg-white/4 border-white/10 text-zinc-400 hover:border-white/25 hover:text-white")}>
            {opt.label}
          </button>
        ))}
      </div>
      {question.allowCustom && (
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Or type your own…"
          className="w-full bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none border-b border-white/10 pb-1 focus:border-primary/50 transition-colors" />
      )}
      <div className="flex items-center gap-2 justify-end">
        {(config.allowSkip ?? true) && config.onSkip && (
          <button onClick={config.onSkip} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">{config.skipLabel ?? "Skip"}</button>
        )}
        <button onClick={submit} disabled={selected.length === 0 && !custom}
          className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium disabled:opacity-30 hover:bg-primary/80 transition-colors">
          {config.submitLabel ?? "Submit"}
        </button>
      </div>
    </div>
  );
}

/* ── typing animation ────────────────────────────────────────── */

function TypingAnimation({ config }: { config: TypingAnimationConfig }) {
  const [displayed, setDisplayed] = React.useState("");
  React.useEffect(() => {
    if (!config.isActive) { setDisplayed(""); return; }
    setDisplayed("");
    const chars = config.text.split("");
    const interval = config.duration / chars.length;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + chars[i]);
      i++;
      if (i >= chars.length) { clearInterval(timer); config.onComplete(); }
    }, interval);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.isActive, config.text]);
  if (!config.isActive && !displayed) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/8 text-xs text-zinc-400">
      {config.image && <img src={config.image} alt="" className="w-5 h-5 rounded object-cover shrink-0" />}
      <span className="text-zinc-200 text-sm">{displayed}</span>
      {config.isActive && displayed.length < config.text.length && <span className="w-0.5 h-4 bg-primary/70 animate-pulse" />}
    </div>
  );
}

/* ── input bar ───────────────────────────────────────────────── */

export function InputBar({
  onSend,
  status,
  onStop,
  placeholder = "Send a message…",
  className,
  onAttach,
  attachedImages = [],
  attachedFiles = [],
  onRemoveImage,
  onRemoveFile,
  onPaste,
  isDragOver,
  enableImagePreview,
  value: controlledValue,
  onChange,
  disabled,
  autoFocus,
  suggestions,
  typingAnimation,
  infoBar,
  questionBar,
  leftActions,
  rightActions,
}: InputBarProps) {
  const [uncontrolled, setUncontrolled] = React.useState("");
  const value = controlledValue ?? uncontrolled;
  const setValue = onChange ?? setUncontrolled;
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "loading" || status === "streaming";
  const hasAttachments = attachedImages.length > 0 || attachedFiles.length > 0;

  React.useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const handleSend = () => {
    const text = value.trim();
    if (!text || isLoading || disabled) return;
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSend({ role: "user", content: text });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Info bar — top */}
      <AnimatePresence>
        {infoBar && infoBar.position !== "bottom" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <InfoBar config={infoBar} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question bar */}
      <AnimatePresence>
        {questionBar && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
            <QuestionBar config={questionBar} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing animation */}
      <AnimatePresence>
        {typingAnimation?.isActive && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
            <TypingAnimation config={typingAnimation} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions */}
      {suggestions && (() => {
        const { items, className: cls, itemClassName } = normalizeSuggestions(suggestions);
        return (
          <div className={cn("flex flex-wrap gap-1.5", cls)}>
            {items.map((item) => (
              <button key={item.id} onClick={() => setValue(item.value)}
                className={cn("px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-xs text-zinc-400 hover:text-white hover:border-primary/40 hover:bg-primary/8 transition-all", itemClassName)}>
                {item.label}
              </button>
            ))}
          </div>
        );
      })()}

      {/* ── main surface ──────────────────────────────────────── */}
      <div
        className={cn(
          "rounded-2xl border border-white/10 bg-[#1a1a1a] overflow-hidden transition-colors",
          isDragOver && "border-primary/50 bg-primary/5",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        {/* Attachment previews */}
        <AnimatePresence>
          {hasAttachments && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-4 pt-3 space-y-2">
              {attachedImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachedImages.map((img) => (
                    <div key={img.id} className="relative group w-14 h-14 shrink-0">
                      {enableImagePreview
                        ? <img src={img.url} alt={img.filename} className="w-full h-full rounded-lg object-cover border border-white/10" />
                        : <div className="w-full h-full rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-[10px] text-zinc-500 text-center px-1 leading-tight">{img.filename}</div>}
                      {onRemoveImage && (
                        <button onClick={() => onRemoveImage(img.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/6 border border-white/10 text-xs text-zinc-400">
                      <span className="truncate max-w-[120px]">{file.filename}</span>
                      {file.size && <span className="text-zinc-600 shrink-0">{formatBytes(file.size)}</span>}
                      {onRemoveFile && (
                        <button onClick={() => onRemoveFile(file.id)} className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors ml-1" aria-label="Remove">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="px-4 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); autoResize(e.target); }}
            onKeyDown={handleKeyDown}
            onPaste={onPaste}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading || disabled}
            className="w-full bg-transparent text-[13px] text-zinc-100 placeholder:text-zinc-600 outline-none resize-none disabled:opacity-50 leading-relaxed"
          />
        </div>

        {/* Toolbar row */}
        <div className="flex items-center justify-between px-2.5 pb-2.5">
          <div className="flex items-center gap-0.5">
            {/* Attach button */}
            <button
              onClick={onAttach}
              disabled={!onAttach}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/8 transition-colors disabled:opacity-0 disabled:pointer-events-none"
              aria-label="Attach"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Left actions (mode/model pickers) or defaults */}
            {leftActions ?? (
              <>
                <ModeSelector
                  modes={[{ id: "agent", label: "Agent", icon: IconInfinity }]}
                  defaultValue="agent"
                />
                <ModelPicker
                  models={[
                    { id: "sonnet", name: "Claude", version: "Sonnet 4.6" },
                    { id: "haiku",  name: "Claude", version: "Haiku 4.5" },
                  ]}
                  defaultValue="sonnet"
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {rightActions}
            <SendButton
              state={isLoading ? "streaming" : value.trim() ? "typing" : "idle"}
              onClick={isLoading ? onStop : handleSend}
            />
          </div>
        </div>
      </div>

      {/* Info bar — bottom */}
      <AnimatePresence>
        {infoBar && infoBar.position === "bottom" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <InfoBar config={infoBar} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
