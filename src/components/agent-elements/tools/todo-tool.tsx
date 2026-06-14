import { memo } from "react";
import { IconChecklist } from "@tabler/icons-react";
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

type TodoItem = {
  id?: string;
  content: string;
  status?: "pending" | "in_progress" | "completed";
};

export type TodoToolRowProps = {
  step: Extract<TimelineStep, { type: "tool-call" }>;
  state: StepState;
  onComplete: () => void;
  todos?: TodoItem[];
};

export function TodoToolRow({ step, state, onComplete, todos }: TodoToolRowProps) {
  useToolComplete(state === "animating", step.duration, onComplete);
  const isPending = state === "animating";

  if (!todos || todos.length === 0) {
    return (
      <ToolRowBase
        icon={<IconChecklist className="w-full h-full shrink-0 text-zinc-500" />}
        shimmerLabel="Updating todos"
        completeLabel="Updated todos"
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
              <IconChecklist className="w-full h-full text-zinc-500" />
            </span>
            <span className="font-[450] whitespace-nowrap shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center leading-none h-4 m-0">
                  Updating todos
                </TextShimmer>
              ) : (
                "Updated todos"
              )}
            </span>
            <span className="text-zinc-700 text-xs">{todos.length} item{todos.length !== 1 ? "s" : ""}</span>
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
        <div className="flex flex-col gap-1 pl-1">
          {todos.map((todo, i) => (
            <div key={todo.id ?? i} className="flex items-start gap-2 text-xs text-zinc-500">
              <span
                className={cn(
                  "mt-0.5 w-3 h-3 rounded-sm border shrink-0 flex items-center justify-center",
                  todo.status === "completed"
                    ? "bg-emerald-500/20 border-emerald-500/40"
                    : todo.status === "in_progress"
                      ? "border-amber-500/40"
                      : "border-zinc-600",
                )}
              >
                {todo.status === "completed" && (
                  <svg viewBox="0 0 8 8" className="w-2 h-2 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 4l2 2 4-4" />
                  </svg>
                )}
              </span>
              <span className={cn(todo.status === "completed" && "line-through text-zinc-700")}>
                {todo.content}
              </span>
            </div>
          ))}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type TodoToolProps = {
  part: unknown;
};

export const TodoTool = memo(function TodoTool({ part }: TodoToolProps) {
  const p = part as Record<string, unknown>;
  const rawState =
    p.state === "output-available"
      ? "result"
      : p.state === "input-streaming"
        ? "partial-call"
        : "call";
  const args = (p.input ?? p.args ?? {}) as Record<string, unknown>;
  const todos = Array.isArray(args.todos) ? (args.todos as TodoItem[]) : undefined;

  const step = mapToolInvocationToStep(String(p.toolCallId ?? p.id ?? "todo"), {
    toolName: "TodoWrite",
    args,
    state: rawState,
    result: p.output ?? p.result,
  });
  const stepState = mapToolStateToStepState(rawState);

  return <TodoToolRow step={step} state={stepState} onComplete={() => {}} todos={todos} />;
});
