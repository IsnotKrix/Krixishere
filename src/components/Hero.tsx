"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GithubIcon, XIcon, LinkedinIcon } from "@/components/icons";
import ShaderBackground from "@/components/GradFlowBackground";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Layer 1 — WebGL shader */}
      <div className="absolute inset-0">
        <ShaderBackground />
      </div>

      {/* Layer 2 — dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #374151 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
          opacity: 0.35,
        }}
      />

      <div className="relative z-[10] max-w-5xl mx-auto w-full pointer-events-none flex flex-col items-center text-center">
        <motion.h1
          {...fadeUp(0.2)}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-white">Hello My Name Is</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400">
            Krix
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.35)}
          className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
        >
          I'm already here <span className="text-white font-medium">3+ years</span>, In roblox programmer and I will create a website
        </motion.p>

        <motion.div {...fadeUp(0.5)} className="flex flex-wrap justify-center items-center gap-4 mb-16 pointer-events-auto">
          <a
            href="#projects"
            className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll arrow — above everything */}
      <motion.a
        href="#about"
        {...fadeUp(0.9)}
        className="absolute bottom-10 z-[10] text-zinc-600 hover:text-zinc-400 transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.a>
    </section>
  );
}
