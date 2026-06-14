import { memo } from "react";
import { IconRobot } from "@tabler/icons-react";
import type { TimelineStep, StepState } from "../types/timeline";
import { useToolComplete } from "../hooks/use-tool-complete";
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "../utils/tool-adapters";
import { ToolRowBase } from "./tool-row-base";

export type SubagentToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  agentName?: string;
};

export function SubagentToolRow({ step, state, onComplete, agentName }: SubagentToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";
  const name = agentName ?? step.toolDetail ?? "subagent";

  return (
    <ToolRowBase
      icon={<IconRobot className="w-full h-full shrink-0 text-zinc-500" />}
      shimmerLabel={`Spawning ${name}`}
      completeLabel={`Ran ${name}`}
      isAnimating={isPending}
    />
  );
}

export type SubagentToolProps = {
  part: unknown;
  agentName?: string;
};

export const SubagentTool = memo(function SubagentTool({ part, agentName }: SubagentToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const args = (p.input ?? p.args ?? {}) as Record<string, unknown>;
  const resolvedName =
    agentName ??
    (typeof args.agent === "string" ? args.agent : undefined) ??
    (typeof args.name === "string" ? args.name : undefined);

  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "subagent"), {
    toolName: String(p.toolName ?? "Agent"),
    args,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <SubagentToolRow step={step} state={stepState} onComplete={() => {}} agentName={resolvedName} />;
});
