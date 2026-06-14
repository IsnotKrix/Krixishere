"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";

const projects = [
  {
    title: "Krixishere.org",
    description:
      "This very portfolio — built with Next.js 16, Framer Motion, and Tailwind CSS. Designed with a dark minimal aesthetic.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    github: "https://github.com/isnotkrix/krixishere.org",
    live: "#",
    featured: true,
  },
    {
    title: "CmdCore",
    description:
      "A command-line interface for managing and automating development tasks.",
    tags: ["Roblox Studio", "exe 6", "Apps"],
    github: "https://github.com/isnotkrix",
    live: "#",
    featured: true,
  },
];

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: (typeof projects)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-400/20 transition-all duration-300 flex flex-col ${
        project.featured ? "md:col-span-1" : ""
      }`}
    >
      {project.featured && (
        <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full border border-violet-400/30 text-violet-400 font-medium tracking-wider uppercase">
          Featured
        </span>
      )}

      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-violet-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-white/5">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <GithubIcon size={13} />
          Source
        </a>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors"
        >
          <ExternalLink size={13} />
          Live demo
        </a>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-28 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-4">
            Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Things I&apos;ve built
            </h2>
            <a
              href="https://github.com/isnotkrix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-white transition-colors self-start md:self-auto"
            >
              All projects →
            </a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
