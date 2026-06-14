"use client";

import { IconArrowUp, IconPlayerStopFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type SendButtonState = "idle" | "typing" | "streaming";

export type SendButtonProps = {
  state: SendButtonState;
  onClick?: () => void;
  className?: string;
};

export function SendButton({ state, onClick, className }: SendButtonProps) {
  const isStreaming = state === "streaming";
  const isTyping = state === "typing";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0",
        isStreaming
          ? "bg-zinc-200 hover:bg-white cursor-pointer"
          : isTyping
            ? "bg-zinc-200 hover:bg-white cursor-pointer"
            : "bg-white/10 cursor-default",
        className,
      )}
      aria-label={isStreaming ? "Stop" : "Send"}
    >
      {isStreaming ? (
        <IconPlayerStopFilled className="w-3.5 h-3.5 text-zinc-900" />
      ) : (
        <IconArrowUp
          className={cn(
            "w-3.5 h-3.5",
            isTyping ? "text-zinc-900" : "text-zinc-600",
          )}
        />
      )}
    </button>
  );
}
