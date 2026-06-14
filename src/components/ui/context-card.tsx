"use client";

import React, { useMemo } from "react";
import { Tooltip } from "react-tooltip";

interface ContextCardTriggerProps {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const ContextCardTrigger = ({ content, side = "top", children }: ContextCardTriggerProps) => {
  const id = useMemo(() => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }, []);

  return (
    <>
      <div id={id} className="inline-flex">{children}</div>
      <Tooltip
        anchorSelect={`#${id}`}
        place={side}
        opacity={1}
        style={{
          border: "1px solid var(--context-card-border)",
          background: "var(--ds-background-100)",
          color: "var(--ds-gray-1000)",
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          padding: "0.375rem 0.625rem",
          fontFamily: "inherit",
          zIndex: 9999,
        }}
      >
        {content}
      </Tooltip>
    </>
  );
};

export const ContextCard = {
  Trigger: ContextCardTrigger,
};
