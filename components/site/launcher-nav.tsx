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
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,18,0.78),rgba(10,14,11,0.68))] px-3 py-2 shadow-[0_18px_48px_rgba(0,0,0,0.28),0_0_24px_rgba(120,146,129,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
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
              className="rounded-full px-3 py-2 text-sm text-mist transition hover:bg-white/[0.05] hover:text-white"
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
          className="rounded-full border border-[#a7bead]/22 bg-[#7f9a88]/12 px-4 py-2 text-sm text-[#e8efea] transition hover:border-[#a7bead]/38 hover:bg-[#7f9a88]/18"
        >
          Resume
        </a>
      </div>
    </motion.header>
  );
}
