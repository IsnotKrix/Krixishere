"use client";

import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentChat, type UIMessage, type ChatStatus } from "@/components/agent-elements/agent-chat";

/* ── config ──────────────────────────────────────────────────── */

const SUGGESTIONS = [
  { id: "s1", label: "What's new?",    value: "What's new in the latest release?" },
  { id: "s2", label: "Tech stack",     value: "What tech stack is this site built with?" },
  { id: "s3", label: "v1.1 features",  value: "What features were added in v1.1.0?" },
  { id: "s4", label: "Who made this?", value: "Who built krixishere.org?" },
];

/* ── helpers ─────────────────────────────────────────────────── */

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ── animation variants ──────────────────────────────────────── */

const desktopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 360, damping: 26, mass: 0.85 },
  },
  exit: {
    opacity: 0, scale: 0.92, y: 14, filter: "blur(4px)",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
};

const mobileVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 32, mass: 1.0 },
  },
  exit: {
    y: "100%", opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

const fabVariants: Variants = {
  initial: { scale: 0, opacity: 0, rotate: -20 },
  animate: {
    scale: 1, opacity: 1, rotate: 0,
    transition: { type: "spring" as const, stiffness: 360, damping: 22, delay: 0.15 },
  },
};

/* ── panel header ────────────────────────────────────────────── */

function Header({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  return (
    <div className="relative shrink-0 overflow-hidden">
      {/* Aurora glow blobs */}
      <div className="absolute -top-10 -left-6 w-44 h-20 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -top-6 right-2 w-28 h-14 bg-purple-700/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
        {/* avatar */}
        <div className="relative shrink-0">
          {/* breathing glow behind avatar */}
          <motion.div
            className="absolute inset-0 rounded-full bg-violet-500/40 blur-md"
            animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-violet-400/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {/* pulsing online dot */}
          <motion.span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0c10]"
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white leading-tight tracking-tight">
            Krix Support
          </p>
          <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
            Powered by Claude ·{" "}
            <span className="text-emerald-500/80">Online</span>
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-violet-500/12 transition-all duration-150"
            aria-label="New conversation"
            title="New conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-white/8 transition-all duration-150"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── FAB ─────────────────────────────────────────────────────── */

function Fab({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <motion.button
      variants={fabVariants}
      initial="initial"
      animate="animate"
      onClick={onClick}
      whileHover={{ scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      whileTap={{ scale: 0.91 }}
      aria-label={open ? "Close chat" : "Open support chat"}
      className={cn(
        "fixed bottom-20 right-5 z-[196] w-12 h-12 rounded-full flex items-center justify-center text-white",
        open
          ? "bg-zinc-800 hover:bg-zinc-700 shadow-lg shadow-black/40"
          : "bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700 shadow-lg shadow-violet-600/40",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span
            key="x"
            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{   rotate:  90, opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            <X className="w-4.5 h-4.5" />
          </motion.span>
        ) : (
          <motion.span
            key="chat"
            initial={{ rotate: 90,  opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1 }}
            exit={{   rotate: -90,  opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          />
        )}
      </AnimatePresence>

      {/* double pulse rings when closed */}
      {!open && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-violet-500/35"
            animate={{ scale: [1, 1.65], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-violet-500/20"
            animate={{ scale: [1, 1.95], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.55 }}
          />
        </>
      )}
    </motion.button>
  );
}

/* ── main ────────────────────────────────────────────────────── */

export function ChangelogChat() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState<UIMessage[]>([]);
  const [status, setStatus]     = React.useState<ChatStatus>("ready");
  const [error, setError]       = React.useState<Error | undefined>();
  const abortRef                = React.useRef<AbortController | null>(null);

  const reset = () => { setMessages([]); setStatus("ready"); setError(undefined); };

  const handleSend = async ({ content }: { role: "user"; content: string }) => {
    setError(undefined);
    const userMsg: UIMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text: content }],
      createdAt: new Date(),
    };
    const aId = `a-${Date.now()}`;
    const assistantMsg: UIMessage = {
      id: aId,
      role: "assistant",
      parts: [{ type: "text", text: "" }],
    };

    setMessages((p) => [...p, userMsg, assistantMsg]);
    setStatus("streaming");

    abortRef.current = new AbortController();
    try {
      const history = [...messages, userMsg].map(({ role, parts }) => ({
        role,
        content: parts.map((p) => p.text).join(""),
      }));

      const res = await fetch("/api/changelog-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((p) =>
          p.map((m) =>
            m.id === aId
              ? { ...m, parts: [{ type: "text", text: m.parts[0].text + chunk }] }
              : m,
          ),
        );
      }
      setStatus("ready");
    } catch (e) {
      if ((e as Error).name === "AbortError") { setStatus("ready"); return; }
      setError(e as Error);
      setMessages((p) =>
        p.map((m) =>
          m.id === aId
            ? { ...m, parts: [{ type: "text", text: "Something went wrong — please try again." }] }
            : m,
        ),
      );
      setStatus("error");
    }
  };

  const handleStop = () => { abortRef.current?.abort(); setStatus("ready"); };

  return (
    <>
      {/* Backdrop (mobile only) */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[190] bg-black/65 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed z-[195] flex flex-col overflow-hidden",
              "bg-[#0c0c10] border border-violet-500/20",
              "shadow-2xl shadow-violet-950/50",
              isMobile
                ? "bottom-0 left-0 right-0 h-[72vh] rounded-t-3xl"
                : "bottom-[84px] right-5 w-[370px] h-[530px] rounded-2xl",
            )}
          >
            {/* Hair-line shimmer along the top edge */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/55 to-transparent pointer-events-none z-10" />

            {/* Mobile drag pill */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-0.5 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            <Header onClose={() => setOpen(false)} onReset={reset} />

            <AgentChat
              messages={messages}
              status={status}
              onSend={handleSend}
              onStop={handleStop}
              error={error}
              showCopyToolbar
              emptyStatePosition="center"
              emptySuggestionsPlacement="empty"
              emptySuggestionsPosition="bottom"
              suggestions={{ items: SUGGESTIONS }}
              className="flex-1 min-h-0"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Fab open={open} onClick={() => setOpen((v) => !v)} />
    </>
  );
}
