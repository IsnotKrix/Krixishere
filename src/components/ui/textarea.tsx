import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white shadow-sm transition-shadow placeholder:text-zinc-600 focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
