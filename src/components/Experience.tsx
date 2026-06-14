"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const events = [
  {
    period: "Early 2022",
    title: "Started Roblox Development",
    description:
      "Picked up Lua and Roblox Studio — began building game mechanics, scripts, and learning how to think like a developer.",
  },
  {
    period: "2025",
    title: "Moved into Web Development",
    description:
      "Started learning Next.js, TypeScript, and Tailwind CSS. Expanded my skills beyond game dev into building real web experiences.",
  },
  {
    period: "June 2025",
    title: "Launched krixishere.org",
    description:
      "Built and shipped this portfolio from scratch — WebGL shaders, Framer Motion animations, a changelog system, and more.",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="py-28 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-4">
            Journey
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            How I got here
          </h2>
        </motion.div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/5" />

          <div className="space-y-10">
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative pl-8"
              >
                {/* dot */}
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border border-violet-400/50 bg-violet-400/10" />

                <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-1">
                  {event.period}
                </p>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {event.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                  {event.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
