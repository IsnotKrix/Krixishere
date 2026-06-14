import { memo, useMemo, useState } from "react";

export type ToolApproval = {
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
};

export type ToolApprovalFooterProps = ToolApproval & {
  isPending?: boolean;
};

export const ToolApprovalFooter = memo(function ToolApprovalFooter({
  isPending,
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
}: ToolApprovalFooterProps) {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  const approveText = decision === "approved" ? "Approved" : (approveLabel ?? "Next");
  const rejectText = decision === "rejected" ? "Skipped" : (rejectLabel ?? "Skip");

  const handleApprove = () => {
    if (decision) return;
    setDecision("approved");
    onApprove?.();
  };

  const handleReject = () => {
    if (decision) return;
    setDecision("rejected");
    onReject?.();
  };

  const statusConfig = useMemo(() => {
    if (decision === "approved") return { label: "Waiting", dots: true };
    if (decision === "rejected") return { label: "Canceled", dots: false };
    if (isPending) return { label: "Starting", dots: true };
    return null;
  }, [decision, isPending]);

  return (
    <div className="flex items-center justify-between py-1 pl-3 pr-2 border-t border-white/8 bg-[#1a1a1a]">
      {statusConfig ? (
        <span className="text-xs text-zinc-500">
          {statusConfig.label}
          {statusConfig.dots && (
            <span className="inline-flex" aria-hidden="true">
              <span className="text-zinc-500 animate-[loading-dots_1.4s_infinite_0.2s]">.</span>
              <span className="text-zinc-500 animate-[loading-dots_1.4s_infinite_0.4s]">.</span>
              <span className="text-zinc-500 animate-[loading-dots_1.4s_infinite_0.6s]">.</span>
            </span>
          )}
        </span>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleReject}
          disabled={Boolean(decision)}
          className="h-5 px-1.5 rounded text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/6 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {rejectText}
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={Boolean(decision)}
          className="h-5 px-1.5 rounded text-xs font-medium bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {approveText}
        </button>
      </div>
    </div>
  );
});
