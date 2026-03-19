"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteContent } from "@/content/site";

const responses: Record<string, string[]> = {
  help: [
    "Available commands:",
    "about, projects, stack, now, resume, contact, clear"
  ],
  about: [
    "Clark Thompson",
    "Background in analytics, reporting, workflow problem-solving, and business-facing technical work.",
    "Current direction: deeper software, automation, and applied AI systems work."
  ],
  projects: siteContent.projects.map(
    (project) => `${project.title} -> ${project.summary}`
  ),
  stack: siteContent.skills.map((group) => `${group.title}: ${group.items.join(", ")}`),
  now: [...siteContent.now],
  resume: [`Resume path: ${siteContent.resumePath}`],
  contact: siteContent.contact.links.map((link) => `${link.label}: ${link.href}`)
};

export function TerminalWidget() {
  const reduceMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Type `help` to inspect the workspace."
  ]);

  const knownCommands = useMemo(() => Object.keys(responses), []);

  function handleCommand(command: string) {
    const trimmed = command.trim().toLowerCase();
    if (!trimmed) {
      return;
    }

    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const nextLines = responses[trimmed] ?? [
      `Unknown command: ${trimmed}`,
      `Try: ${knownCommands.join(", ")}`
    ];

    setHistory((current) => [...current, `> ${trimmed}`, ...nextLines]);
    setInput("");
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/30 p-4 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
          Utility Terminal
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
          Keyboard ready
        </p>
      </div>

      <div className="mask-fade h-64 overflow-y-auto rounded-[22px] border border-white/8 bg-ink-950/90 p-4 font-mono text-sm leading-7 text-slate-200">
        <AnimatePresence initial={false}>
          {history.map((line, index) => (
            <motion.div
              key={`${line}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form
        className="mt-4 flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleCommand(input);
        }}
      >
        <span className="font-mono text-sm text-signal">{">"}</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="help"
          aria-label="Terminal command input"
          className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-mist"
        />
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {siteContent.terminal.commands.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => handleCommand(command)}
            className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-mist transition hover:border-white/20 hover:text-white"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
