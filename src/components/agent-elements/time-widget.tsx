"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // refresh AI insight every 5 min

function useTime() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function DigitGroup({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="block font-mono text-4xl font-bold tracking-tighter text-foreground tabular-nums"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="mb-5 select-none font-mono text-3xl font-light text-primary/60">
      :
    </span>
  );
}

interface TimeWidgetProps {
  className?: string;
}

export function TimeWidget({ className }: TimeWidgetProps) {
  const now = useTime();
  const [insight, setInsight] = React.useState<string>("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const lastFetchRef = React.useRef<number>(0);

  const fetchInsight = React.useCallback(async (h: number, m: number) => {
    setIsStreaming(true);
    setInsight("");
    try {
      const res = await fetch(`/api/time-insight?hour=${h}&minute=${m}`);
      if (!res.ok || !res.body) { setInsight("time flows quietly"); return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setInsight((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setInsight("time flows quietly");
    } finally {
      setIsStreaming(false);
    }
  }, []);

  React.useEffect(() => {
    if (!now) return;
    const elapsed = Date.now() - lastFetchRef.current;
    if (elapsed < REFRESH_INTERVAL_MS && lastFetchRef.current !== 0) return;
    lastFetchRef.current = Date.now();
    fetchInsight(now.getHours(), now.getMinutes());
  }, [now, fetchInsight]);

  if (!now) return null;

  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/30 px-8 py-6 backdrop-blur-sm",
        className,
      )}
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/5" />

      {/* Clock */}
      <div className="flex items-end gap-2">
        <DigitGroup value={h} label="hr" />
        <Separator />
        <DigitGroup value={m} label="min" />
        <Separator />
        <DigitGroup value={s} label="sec" />
      </div>

      {/* Date */}
      <p className="text-xs text-muted-foreground">{dateStr}</p>

      {/* AI insight */}
      <div className="flex min-h-[20px] items-center gap-2">
        {isStreaming && (
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        <AnimatePresence mode="wait">
          {insight && (
            <motion.p
              key={insight.slice(0, 10)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center text-sm italic text-primary/80"
            >
              {insight}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
