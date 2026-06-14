"use client";

import dynamic from "next/dynamic";

const GradFlow = dynamic(
  () => import("gradflow").then((m) => ({ default: m.GradFlow })),
  { ssr: false }
);

export default function GradFlowBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <GradFlow
        config={{
          color1: { r: 129, g: 6, b: 190 },
          color2: { r: 10, g: 10, b: 30 },
          color3: { r: 66, g: 20, b: 233 },
          speed: 0.35,
          scale: 1.2,
          type: "silk",
          noise: 0.1,
        }}
      />
    </div>
  );
}
