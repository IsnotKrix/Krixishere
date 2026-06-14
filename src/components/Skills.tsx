"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillGroups = [
  {
    category: "Frontend",
    skills: [
      "Roblox Studio", "Lua",
    ],
  },
   {
    category: "Sigma Boy",
    skills: [
      "Skididi", "Shaur",
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="py-28 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-4">
            Stack
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14 leading-tight">
            Tools I work with
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {skillGroups.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * gi }}
              >
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-5">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, si) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.05 * si + 0.1 * gi }}
                      className="px-3 py-1.5 text-sm rounded-lg border border-white/5 bg-white/[0.03] text-zinc-300 hover:border-violet-400/30 hover:text-violet-300 hover:bg-violet-400/5 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
