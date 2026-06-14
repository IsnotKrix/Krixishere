import { memo } from "react";
import { IconPlug } from "@tabler/icons-react";
import type { TimelineStep, StepState } from "../types/timeline";
import { useToolComplete } from "../hooks/use-tool-complete";
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "../utils/tool-adapters";
import { ToolRowBase } from "./tool-row-base";

export type McpToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  serverName?: string;
};

export function McpToolRow({ step, state, onComplete, serverName }: McpToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";
  const toolLabel = step.toolName ?? "MCP tool";
  const detail = serverName ? `${serverName} · ${step.toolDetail}` : step.toolDetail;

  return (
    <ToolRowBase
      icon={<IconPlug className="w-full h-full shrink-0 text-zinc-500" />}
      shimmerLabel={`Calling ${toolLabel}`}
      completeLabel={`Called ${toolLabel}`}
      isAnimating={isPending}
      detail={detail}
    />
  );
}

export type McpToolProps = {
  part: unknown;
  serverName?: string;
};

export const McpTool = memo(function McpTool({ part, serverName }: McpToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const args = (p.input ?? p.args ?? {}) as Record<string, unknown>;
  const toolName = String(p.toolName ?? p.name ?? "McpTool");
  const resolvedServer =
    serverName ??
    (typeof args.server === "string" ? args.server : undefined) ??
    (typeof p.serverName === "string" ? p.serverName : undefined);

  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "mcp"), {
    toolName,
    args,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <McpToolRow step={step} state={stepState} onComplete={() => {}} serverName={resolvedServer} />;
});
