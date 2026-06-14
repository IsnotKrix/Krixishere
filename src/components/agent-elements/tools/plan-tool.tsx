import { memo } from "react";
import { IconMap } from "@tabler/icons-react";
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
import { TextShimmer } from "../text-shimmer";

export type PlanToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  planContent?: string;
};

export function PlanToolRow({ step, state, onComplete, planContent }: PlanToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";

  if (!planContent) {
    return (
      <ToolRowBase
        icon={<IconMap className="w-full h-full shrink-0 text-zinc-500" />}
        shimmerLabel="Writing plan"
        completeLabel="Wrote plan"
        isAnimating={isPending}
      />
    );
  }

  return (
    <Collapsible.Root className="flex flex-col gap-2 w-full">
      <Collapsible.Trigger className="group flex">
        <div className="flex items-center gap-1 select-none cursor-pointer">
          <div className="flex items-center gap-2 min-w-0 text-sm text-zinc-500">
            <span className="flex items-center justify-center size-3 shrink-0">
              <IconMap className="w-full h-full text-zinc-500" />
            </span>
            <span className="font-[450] whitespace-nowrap shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center leading-none h-4 m-0">
                  Writing plan
                </TextShimmer>
              ) : (
                "Wrote plan"
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
        <div className="rounded-md border border-white/8 bg-[#0f0f0f] px-3 py-2 max-h-[200px] overflow-y-auto">
          <p className="text-xs text-zinc-500 whitespace-pre-wrap leading-relaxed">{planContent}</p>
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type PlanToolProps = {
  part: unknown;
};

export const PlanTool = memo(function PlanTool({ part }: PlanToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const args = (p.input ?? p.args ?? {}) as Record<string, unknown>;
  const planContent =
    typeof args.plan === "string"
      ? args.plan
      : typeof args.content === "string"
        ? args.content
        : undefined;

  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "plan"), {
    toolName: "PlanWrite",
    args,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <PlanToolRow step={step} state={stepState} onComplete={() => {}} planContent={planContent} />;
});
