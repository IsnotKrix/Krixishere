import { memo } from "react";
import { TextShimmer } from "../text-shimmer";
import type { TimelineStep, StepState } from "../types/timeline";
import { useToolComplete } from "../hooks/use-tool-complete";
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "../utils/tool-adapters";
import { ToolRowBase } from "./tool-row-base";
import { cn } from "@/lib/utils";
import { Collapsible } from "@base-ui/react/collapsible";
import { IconChevronRight } from "@tabler/icons-react";

export type EditToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
};

export function EditToolRow({ step, state, onComplete }: EditToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";
  const fileName = step.filePath?.split("/").pop() ?? step.toolDetail;
  const hasDiff = !isPending && step.diffLines && step.diffLines.length > 0;

  if (!hasDiff) {
    return (
      <ToolRowBase
        shimmerLabel={`Editing ${fileName}`}
        completeLabel={`Edited ${fileName}`}
        isAnimating={isPending}
        detail={step.diffStats}
      />
    );
  }

  return (
    <Collapsible.Root className="flex flex-col gap-2 w-full">
      <Collapsible.Trigger className="group flex">
        <div className="flex items-center gap-1 select-none cursor-pointer">
          <div className="flex items-center gap-2 min-w-0 text-sm text-zinc-500">
            <span className="font-[450] whitespace-nowrap shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center leading-none h-4 m-0">
                  Editing {fileName}
                </TextShimmer>
              ) : (
                `Edited ${fileName}`
              )}
            </span>
            {step.diffStats && (
              <span className="font-mono text-xs text-zinc-600">{step.diffStats}</span>
            )}
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
        <div className="rounded-md border border-white/8 bg-[#0f0f0f] overflow-hidden max-h-[200px] overflow-y-auto">
          <div className="font-mono text-[11px] leading-[18px]">
            {step.diffLines!.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "px-3 whitespace-pre",
                  line.type === "add" && "bg-emerald-950/40 text-emerald-400",
                  line.type === "remove" && "bg-red-950/40 text-red-400",
                  line.type === "context" && "text-zinc-600",
                )}
              >
                <span className="select-none mr-1 text-zinc-700">
                  {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                </span>
                {line.content}
              </div>
            ))}
          </div>
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type EditToolProps = {
  part: unknown;
};

export const EditTool = memo(function EditTool({ part }: EditToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "edit"), {
    toolName: "Edit",
    args: (p.input ?? p.args ?? {}) as Record<string, unknown>,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <EditToolRow step={step} state={stepState} onComplete={() => {}} />;
});
