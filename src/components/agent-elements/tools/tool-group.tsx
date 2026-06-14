import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Collapsible } from "@base-ui/react/collapsible";
import { IconChevronRight, IconStack2 } from "@tabler/icons-react";
import { TextShimmer } from "../text-shimmer";

export type ToolGroupProps = {
  label?: string;
  isPending?: boolean;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
};

export const ToolGroup = memo(function ToolGroup({
  label,
  isPending = false,
  count,
  children,
  defaultOpen = false,
}: ToolGroupProps) {
  const displayLabel = label ?? (count != null ? `${count} tool call${count !== 1 ? "s" : ""}` : "Tool calls");

  return (
    <Collapsible.Root className="flex flex-col gap-2 w-full" defaultOpen={defaultOpen}>
      <Collapsible.Trigger className="group flex">
        <div className="flex items-center gap-1 select-none cursor-pointer">
          <div className="flex items-center gap-2 min-w-0 text-sm text-zinc-500">
            <span className="flex items-center justify-center size-3 shrink-0">
              <IconStack2 className="w-full h-full text-zinc-500" />
            </span>
            <span className="font-[450] whitespace-nowrap shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center leading-none h-4 m-0">
                  {displayLabel}
                </TextShimmer>
              ) : (
                displayLabel
              )}
            </span>
          </div>
          <IconChevronRight
            className={cn(
              "shrink-0 text-zinc-500 transition-transform duration-150 ease-out size-3",
              "rotate-0 group-data-panel-open:rotate-90",
            )}
          />
        </div>
      </Collapsible.Trigger>
      <Collapsible.Panel
        className={cn(
          "overflow-hidden",
          "h-[var(--collapsible-panel-height)] transition-all duration-150 ease-out",
          "data-ending-style:h-0 data-starting-style:h-0",
          "[&[hidden]:not([hidden='until-found'])]:hidden",
        )}
      >
        <div className="flex flex-col gap-2 pl-4 border-l border-white/8">
          {children}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
});
