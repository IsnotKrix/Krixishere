import { memo } from "react";
import { IconQuestionMark } from "@tabler/icons-react";
import type { TimelineStep, StepState } from "../types/timeline";
import { useToolComplete } from "../hooks/use-tool-complete";
import {
  mapToolInvocationToStep,
  mapToolStateToStepState,
} from "../utils/tool-adapters";
import { cn } from "@/lib/utils";
import { Collapsible } from "@base-ui/react/collapsible";
import { IconChevronRight } from "@tabler/icons-react";
import { TextShimmer } from "../text-shimmer";
import { ToolRowBase } from "./tool-row-base";

export type QuestionToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  question?: string;
};

export function QuestionToolRow({ step, state, onComplete, question }: QuestionToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";

  if (!question) {
    return (
      <ToolRowBase
        icon={<IconQuestionMark className="w-full h-full shrink-0 text-zinc-500" />}
        shimmerLabel="Asking question"
        completeLabel="Asked question"
        isAnimating={isPending}
      />
    );
  }

  return (
    <Collapsible.Root className="flex flex-col gap-2 w-full" defaultOpen>
      <Collapsible.Trigger className="group flex">
        <div className="flex items-center gap-1 select-none cursor-pointer">
          <div className="flex items-center gap-2 min-w-0 text-sm text-zinc-500">
            <span className="flex items-center justify-center size-3 shrink-0">
              <IconQuestionMark className="w-full h-full text-zinc-500" />
            </span>
            <span className="font-[450] whitespace-nowrap shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center leading-none h-4 m-0">
                  Asking question
                </TextShimmer>
              ) : (
                "Asked question"
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
        <div className="rounded-md border border-amber-500/20 bg-amber-950/10 px-3 py-2">
          <p className="text-xs text-amber-300/80 leading-relaxed">{question}</p>
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type QuestionToolProps = {
  part: unknown;
};

export const QuestionTool = memo(function QuestionTool({ part }: QuestionToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const args = (p.input ?? p.args ?? {}) as Record<string, unknown>;
  const question =
    typeof args.question === "string"
      ? args.question
      : typeof args.prompt === "string"
        ? args.prompt
        : undefined;

  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "question"), {
    toolName: String(p.toolName ?? "AskUserQuestion"),
    args,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <QuestionToolRow step={step} state={stepState} onComplete={() => {}} question={question} />;
});
