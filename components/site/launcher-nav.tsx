"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/content/site";

const links = [
  { label: "Desktop", href: "#top" }
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
          <span className="rounded-full px-3 py-2 text-sm text-mist">
            Windowed Portfolio
          </span>
        </nav>
        <a
          href={siteContent.resumePath}
          className="rounded-full border border-[#9ec8a8]/20 bg-[#7ca88b]/10 px-4 py-2 text-sm text-[#e6efe8] transition hover:border-[#9ec8a8]/40 hover:bg-[#7ca88b]/15"
        >
          Resume
        </a>
      </div>
    </motion.header>
  );
}
