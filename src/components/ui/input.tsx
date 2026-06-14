import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white shadow-sm transition-shadow placeholder:text-zinc-600 focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        type === "search" &&
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
        type === "file" &&
          "p-0 pr-3 italic text-zinc-500 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-white/10 file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-white",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
