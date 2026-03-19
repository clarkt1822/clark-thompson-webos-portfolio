"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionWindow } from "@/components/ui/section-window";
import { Tag } from "@/components/ui/tag";
import { siteContent } from "@/content/site";

type WorkspaceTab = "projects" | "about" | "resume" | "contact" | "now";

const launcherItems: Array<{
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  tone: string;
}> = [
  { id: "projects", label: "Projects", shortLabel: "PRJ", tone: "bg-sky-400/14 text-sky-100" },
  { id: "about", label: "About", shortLabel: "ABT", tone: "bg-white/8 text-white" },
  { id: "resume", label: "Resume", shortLabel: "PDF", tone: "bg-amber-300/14 text-amber-100" },
  { id: "contact", label: "Contact", shortLabel: "COM", tone: "bg-signal/14 text-signal" },
  { id: "now", label: "Now", shortLabel: "NOW", tone: "bg-white/8 text-white" }
];

export function DesktopWorkspace() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = React.useState<WorkspaceTab>("projects");
  const { hero } = siteContent;

  return (
    <section id="top" className="space-y-6">
      <SectionWindow label="Workspace Shell" rightLabel="Clark Thompson / Active Session">
        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border-b border-white/8 bg-black/18 p-5 lg:border-b-0 lg:border-r">
            <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-5">
              <Tag>{hero.eyebrow}</Tag>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.32em] text-signal">
                {hero.name}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                {hero.headline}
              </h1>
              <p className="mt-4 text-sm leading-7 text-mist">{hero.subheadline}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <StatusCard label="Current focus" value={hero.focus} />
                <StatusCard label="Status" value={hero.status} />
                <StatusCard label="Availability" value={hero.availability} />
              </div>
            </div>

            <div className="mt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mist">
                Desktop items
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {launcherItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === "resume") {
                        window.open(siteContent.resumePath, "_blank");
                        return;
                      }
                      setActiveTab(item.id);
                    }}
                    className={`rounded-[24px] border px-4 py-4 text-left transition ${
                      activeTab === item.id && item.id !== "resume"
                        ? "border-sky-300/30 bg-sky-400/10 shadow-glow"
                        : "border-white/8 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span
                      className={`inline-flex rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${item.tone}`}
                    >
                      {item.shortLabel}
                    </span>
                    <p className="mt-4 text-base font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mist">
                      {item.id === "resume" ? "Open file" : "Launch module"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {hero.ctas
                .filter((cta) => cta.label !== "View Resume")
                .map((cta) => (
                  <Button key={cta.label} href={cta.href} variant={cta.variant} className="flex-1">
                    {cta.label}
                  </Button>
                ))}
              <Button href={siteContent.resumePath} variant="secondary" className="flex-1">
                View Resume
              </Button>
            </div>
          </aside>

          <div className="relative min-h-[44rem] bg-[radial-gradient(circle_at_top_right,rgba(88,198,255,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-[28px] border border-white/10 bg-ink-950/72 shadow-panel backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">
                      Active Window
                    </p>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
                    {activeTab}
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeTab}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? {} : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <WorkspaceContent activeTab={activeTab} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-4">
                <MiniUtility
                  label="Current mode"
                  value="Builder / Analyst / Systems thinker"
                />
                <MiniUtility label="Bias" value="Useful systems over hype" />
                <MiniUtility
                  label="Trajectory"
                  value="Analytics to software to applied AI systems"
                />
                <MiniUtility label="Workspace feel" value="Focused modules, fewer open windows" />
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-mist">
                  Quick profile
                </span>
                {hero.metrics.map((metric) => (
                  <span
                    key={metric.label}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200"
                  >
                    <span className="font-mono uppercase tracking-[0.2em] text-mist">
                      {metric.label}
                    </span>{" "}
                    / {metric.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWindow>
    </section>
  );
}

function WorkspaceContent({ activeTab }: { activeTab: WorkspaceTab }) {
  if (activeTab === "projects") {
    return <ProjectsWorkspace />;
  }

  if (activeTab === "about") {
    return <AboutWorkspace />;
  }

  if (activeTab === "contact") {
    return <ContactWorkspace />;
  }

  return <NowWorkspace />;
}

function ProjectsWorkspace() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            Work directory
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Practical systems, not portfolio filler.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-mist">
          Use this window as the primary proof-of-work view. Real projects can replace the
          placeholders later without changing layout structure.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {siteContent.projects.slice(0, 4).map((project, index) => (
          <article
            key={project.title}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <Tag>0{index + 1}</Tag>
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
                {project.stack.slice(0, 2).join(" / ")}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">{project.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-200">{project.summary}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              Why it matters
            </p>
            <p className="mt-2 text-sm leading-7 text-mist">{project.impact}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function AboutWorkspace() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
          Operating profile
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Started in analytics and workflow reality. Moving deeper into systems.
        </h2>
        <div className="mt-5 space-y-4">
          {[siteContent.about.intro, ...siteContent.about.body].map((paragraph) => (
            <p key={paragraph} className="text-sm leading-8 text-mist sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {siteContent.about.principles.map((item, index) => (
          <div
            key={item}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
              Principle 0{index + 1}
            </p>
            <p className="mt-3 text-base leading-7 text-white">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NowWorkspace() {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Now / queue</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Current momentum, shown as an active build list.
        </h2>
      </div>
      <div className="grid gap-3">
        {siteContent.now.map((item, index) => (
          <div
            key={item}
            className="flex gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
          >
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
              0{index + 1}
            </span>
            <p className="text-sm leading-7 text-mist">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactWorkspace() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
          Access channel
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Open to good conversations around data, software, automation, and AI work.
        </h2>
        <p className="mt-4 text-sm leading-8 text-mist sm:text-base">
          {siteContent.contact.prompt}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {siteContent.contact.links.map((link, index) => (
            <Button
              key={link.label}
              href={link.href}
              variant={index === 2 ? "primary" : "secondary"}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <MiniUtility label="Best for" value="Practical systems and visible growth" />
        <MiniUtility label="Strength" value="Business problem to technical implementation" />
        <MiniUtility label="Preference" value="No AI theater, no empty polish" />
      </div>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white">{value}</p>
    </div>
  );
}

function MiniUtility({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white">{value}</p>
    </div>
  );
}
