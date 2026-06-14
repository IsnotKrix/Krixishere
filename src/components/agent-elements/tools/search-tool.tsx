import { memo } from "react";
import { IconSearch, IconCode } from "@tabler/icons-react";
import type { TimelineStep, StepState } from "../types/timeline";
import { useToolComplete } from "../hooks/use-tool-complete";
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "../utils/tool-adapters";
import { ToolRowBase } from "./tool-row-base";

export type SearchToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
};

export function SearchToolRow({ step, state, onComplete }: SearchToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";
  const isWeb = step.searchSource === "web";
  const Icon = isWeb ? IconSearch : IconCode;
  const shimmerLabel = isWeb ? "Searching web" : "Searching codebase";
  const completeLabel = isWeb ? "Searched web" : "Searched codebase";

  return (
    <ToolRowBase
      icon={<Icon className="w-full h-full shrink-0 text-zinc-500" />}
      shimmerLabel={shimmerLabel}
      completeLabel={completeLabel}
      isAnimating={isPending}
      detail={step.searchQuery ?? step.toolDetail}
    />
  );
}

export type SearchToolProps = {
  part: unknown;
};

export const SearchTool = memo(function SearchTool({ part }: SearchToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const toolName = String(p.toolName ?? p.name ?? "WebSearch");
  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "search"), {
    toolName,
    args: (p.input ?? p.args ?? {}) as Record<string, unknown>,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <SearchToolRow step={step} state={stepState} onComplete={() => {}} />;
});
