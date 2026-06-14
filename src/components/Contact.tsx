"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, XIcon, LinkedinIcon } from "@/components/icons";

const socials = [
  {
    label: "GitHub",
    handle: "@isnotkrix",
    href: "https://github.com/isnotkrix",
    Icon: GithubIcon,
  },
  {
    label: "Twitter / X",
    handle: "@krix",
    href: "#",
    Icon: XIcon,
  },
  {
    label: "Email",
    handle: "hello@krixishere.org",
    href: "mailto:hello@krixishere.org",
    Icon: Mail,
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-28 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-4">
              Contact
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Let&apos;s work
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                together
              </span>
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Currently open to freelance work and full-time positions. If you have a
              project in mind or just want to chat, I&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hello@krixishere.org"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Mail size={15} />
              Send me an email
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-3"
          >
            {socials.map(({ label, handle, href, Icon }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 * i + 0.2 }}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-400/20 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-violet-400 group-hover:bg-violet-400/10 transition-all duration-200">
                    <Icon size={15} />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-600 mb-0.5">{label}</div>
                    <div className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                      {handle}
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-zinc-600 group-hover:text-violet-400 transition-colors"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
