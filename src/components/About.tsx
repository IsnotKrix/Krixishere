"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "3+", label: "Years experience" },
  { value: "20+", label: "Projects shipped" },
  { value: "10+", label: "Happy clients" },
  { value: "∞", label: "Coffees brewed" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-4">
              About me
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Developer who cares about
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                {" "}craft and detail
              </span>
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p>
                I build web applications that are fast, reliable, and actually enjoyable to use.
                I focus on clean code and thoughtful UX — because great software should feel effortless.
              </p>
              <p>
                When I&apos;m not coding, I&apos;m exploring new technologies, contributing to open source,
                or thinking about how systems can be better designed.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/resume.pdf"
                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors group"
              >
                Download resume
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-400/20 transition-all duration-300"
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
