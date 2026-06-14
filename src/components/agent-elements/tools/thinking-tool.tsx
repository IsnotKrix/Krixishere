import { memo } from "react";
import type { TimelineStep, StepState } from "../types/timeline";
import { useToolComplete } from "../hooks/use-tool-complete";
import { ToolRowBase } from "./tool-row-base";
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "../utils/tool-adapters";

export type ThinkingCollapsedProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  defaultOpen?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
};

export function ThinkingCollapsed({
  step,
  state,
  onComplete,
  defaultOpen,
  expanded,
  onToggleExpand,
}: ThinkingCollapsedProps) {
  useToolComplete(state === "animating", step.duration, onComplete);

  return (
    <ToolRowBase
      shimmerLabel="Thinking"
      completeLabel="Thought"
      isAnimating={state === "animating"}
      expandable={!!step.thoughtContent}
      defaultOpen={defaultOpen}
      expanded={expanded}
      onToggleExpand={onToggleExpand}
    >
      <div className="max-h-[175px] overflow-y-auto">
        <p className="text-sm text-zinc-500 whitespace-pre-wrap">
          {step.thoughtContent}
        </p>
      </div>
    </ToolRowBase>
  );
}

export type ThinkingToolProps = {
  part?: unknown;
  step?: Extract<TimelineStep, { type: "tool-call" }>;
  state?: StepState;
  onComplete?: () => void;
  defaultOpen?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
};

export const ThinkingTool = memo(function ThinkingTool({
  part,
  step: externalStep,
  state: externalState,
  onComplete: externalOnComplete,
  defaultOpen,
  expanded,
  onToggleExpand,
}: ThinkingToolProps) {
  let step: Extract<TimelineStep, { type: "tool-call" }>;
  let stepState: StepState;
  let onComplete: () => void;

  if (externalStep && externalState && externalOnComplete) {
    step = externalStep;
    stepState = externalState;
    onComplete = externalOnComplete;
  } else if (part) {
    const p = part as Record<string, unknown>;
    step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "thinking"), {
      toolName: "Thinking",
      args: (p.input ?? p.args ?? {}) as Record<string, unknown>,
      state:
        p.state === "output-available"
          ? "result"
          : p.state === "input-streaming"
            ? "partial-call"
            : "call",
      result: p.output ?? p.result,
    });
    stepState = mapToolStateToStepState(
      p.state === "output-available"
        ? "result"
        : p.state === "input-streaming"
          ? "partial-call"
          : "call",
    );
    onComplete = () => {};
  } else {
    return null;
  }

  return (
    <ThinkingCollapsed
      step={step}
      state={stepState}
      onComplete={onComplete}
      defaultOpen={defaultOpen}
      expanded={expanded}
      onToggleExpand={onToggleExpand}
    />
  );
});
