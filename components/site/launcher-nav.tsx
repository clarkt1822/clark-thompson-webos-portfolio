"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/site";

const links = [
  { label: "Workspace", href: "#top" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#skills" }
];

export function LauncherNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-4 z-30 mb-6"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-ink-950/70 px-3 py-2 shadow-panel backdrop-blur-xl">
        <a
          href="#top"
          className="rounded-full px-3 py-2 text-sm font-medium tracking-[0.24em] text-white"
        >
          CT / OS
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-mist transition hover:bg-white/6 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={siteContent.resumePath}
          className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-400/15"
        >
          Resume
        </a>
      </div>
    </motion.header>
  );
}
