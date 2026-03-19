"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

type WindowId = "about" | "projects" | "resume" | "contact" | "now";

type WindowConfig = {
  id: WindowId;
  title: string;
  shortLabel: string;
  tone: string;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
};

type WindowState = {
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  z: number;
};

const windowConfigs: Record<WindowId, WindowConfig> = {
  about: {
    id: "about",
    title: "About",
    shortLabel: "ABT",
    tone: "bg-white/8 text-white",
    width: 720,
    height: 540,
    initialX: 120,
    initialY: 68
  },
  projects: {
    id: "projects",
    title: "Projects",
    shortLabel: "PRJ",
    tone: "bg-sky-400/14 text-sky-100",
    width: 680,
    height: 520,
    initialX: 400,
    initialY: 110
  },
  resume: {
    id: "resume",
    title: "Resume",
    shortLabel: "PDF",
    tone: "bg-amber-300/14 text-amber-100",
    width: 520,
    height: 420,
    initialX: 280,
    initialY: 140
  },
  contact: {
    id: "contact",
    title: "Contact",
    shortLabel: "COM",
    tone: "bg-signal/14 text-signal",
    width: 500,
    height: 410,
    initialX: 580,
    initialY: 180
  },
  now: {
    id: "now",
    title: "Now",
    shortLabel: "NOW",
    tone: "bg-white/8 text-white",
    width: 560,
    height: 450,
    initialX: 650,
    initialY: 90
  }
};

const windowOrder: WindowId[] = ["about", "projects", "resume", "contact", "now"];

const initialWindows: Record<WindowId, WindowState> = {
  about: { isOpen: true, isMinimized: false, x: 120, y: 68, z: 3 },
  projects: { isOpen: false, isMinimized: false, x: 400, y: 110, z: 1 },
  resume: { isOpen: false, isMinimized: false, x: 280, y: 140, z: 1 },
  contact: { isOpen: false, isMinimized: false, x: 580, y: 180, z: 1 },
  now: { isOpen: false, isMinimized: false, x: 650, y: 90, z: 1 }
};

export function DesktopWorkspace() {
  const reduceMotion = useReducedMotion();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const topZ = React.useRef(3);
  const [windows, setWindows] = React.useState<Record<WindowId, WindowState>>(initialWindows);
  const [mobileActive, setMobileActive] = React.useState<WindowId>("about");
  const openDesktopCount = windowOrder.filter(
    (id) => windows[id].isOpen && !windows[id].isMinimized
  ).length;

  const bringToFront = React.useCallback((id: WindowId) => {
    topZ.current += 1;
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        isOpen: true,
        isMinimized: false,
        z: topZ.current
      }
    }));
  }, []);

  const openWindow = React.useCallback(
    (id: WindowId) => {
      const next = windows[id];
      if (next.isOpen && !next.isMinimized) {
        bringToFront(id);
        return;
      }

      topZ.current += 1;
      setWindows((current) => ({
        ...current,
        [id]: {
          ...current[id],
          isOpen: true,
          isMinimized: false,
          z: topZ.current
        }
      }));
    },
    [bringToFront, windows]
  );

  const closeWindow = React.useCallback((id: WindowId) => {
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        isOpen: false,
        isMinimized: false
      }
    }));
  }, []);

  const minimizeWindow = React.useCallback((id: WindowId) => {
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        isMinimized: true
      }
    }));
  }, []);

  const updateWindowPosition = React.useCallback(
    (id: WindowId, offsetX: number, offsetY: number) => {
      const node = stageRef.current;
      const config = windowConfigs[id];

      setWindows((current) => {
        const nextXUnclamped = current[id].x + offsetX;
        const nextYUnclamped = current[id].y + offsetY;

        if (!node) {
          return {
            ...current,
            [id]: {
              ...current[id],
              x: nextXUnclamped,
              y: nextYUnclamped
            }
          };
        }

        const maxX = Math.max(16, node.clientWidth - config.width - 16);
        const maxY = Math.max(24, node.clientHeight - config.height - 90);

        return {
          ...current,
          [id]: {
            ...current[id],
            x: clamp(nextXUnclamped, 12, maxX),
            y: clamp(nextYUnclamped, 12, maxY)
          }
        };
      });
    },
    []
  );

  return (
    <section id="top" className="space-y-5">
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-ink-950/70 shadow-panel backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">
                Personal Workspace
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              <span>{siteContent.hero.name}</span>
              <span className="rounded-full border border-signal/15 bg-signal/8 px-2.5 py-1 text-signal">
                Live
              </span>
            </div>
          </div>

          <div
            ref={stageRef}
            className="relative h-[calc(100vh-9.5rem)] min-h-[720px] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(88,198,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(126,240,195,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]"
          >
            <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
            <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(4,7,11,0.45),transparent)]" />

            <div className="absolute left-6 top-6 z-10 w-[240px] space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-black/24 p-5 backdrop-blur-xl">
                <Tag>{siteContent.hero.eyebrow}</Tag>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.28em] text-signal">
                  {siteContent.hero.name}
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">
                  From analytics and operations into software and AI systems.
                </h1>
                <p className="mt-4 text-sm leading-7 text-mist">
                  {siteContent.hero.subheadline}
                </p>
              </div>

              <div className="grid gap-3">
                {windowOrder.map((id) => {
                  const config = windowConfigs[id];
                  const state = windows[id];

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openWindow(id)}
                      className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
                    >
                      <span
                        className={cn(
                          "inline-flex rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em]",
                          config.tone
                        )}
                      >
                        {config.shortLabel}
                      </span>
                      <p className="mt-3 text-base font-medium text-white">{config.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mist">
                        {!state.isOpen ? "Open window" : state.isMinimized ? "Restore window" : "Focus window"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="absolute right-6 top-6 z-10 w-[240px] space-y-3">
              <MetricCard label="Current focus" value={siteContent.hero.focus} />
              <MetricCard label="Status" value={siteContent.hero.status} />
              <MetricCard label="Availability" value={siteContent.hero.availability} />
            </div>

            <AnimatePresence>
              {windowOrder.map((id) => {
                const state = windows[id];
                const config = windowConfigs[id];

                if (!state.isOpen || state.isMinimized) {
                  return null;
                }

                const active = state.z === Math.max(...windowOrder.map((key) => windows[key].z));

                return (
                  <motion.section
                    key={id}
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    onMouseDown={() => bringToFront(id)}
                    onDragStart={() => bringToFront(id)}
                    onDragEnd={(_, info) => updateWindowPosition(id, info.offset.x, info.offset.y)}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? {} : { opacity: 0, scale: 0.98, y: 18 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{
                      width: config.width,
                      height: config.height,
                      left: state.x,
                      top: state.y,
                      zIndex: state.z
                    }}
                    className={cn(
                      "absolute overflow-hidden rounded-[28px] border bg-ink-950/92 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl",
                      active ? "border-sky-300/22" : "border-white/10"
                    )}
                  >
                    <WindowFrame
                      title={config.title}
                      active={active}
                      onFocus={() => bringToFront(id)}
                      onClose={() => closeWindow(id)}
                      onMinimize={() => minimizeWindow(id)}
                    >
                      <WindowBody id={id} />
                    </WindowFrame>
                  </motion.section>
                );
              })}
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4">
              <div className="mx-auto flex max-w-fit items-center gap-2 rounded-[26px] border border-white/10 bg-black/40 px-3 py-3 shadow-panel backdrop-blur-xl">
                {windowOrder.map((id) => {
                  const config = windowConfigs[id];
                  const state = windows[id];
                  const isVisible = state.isOpen && !state.isMinimized;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openWindow(id)}
                      className={cn(
                        "flex min-w-[92px] flex-col items-center rounded-[18px] border px-3 py-2 text-center transition",
                        isVisible
                          ? "border-sky-300/24 bg-sky-400/10 text-white"
                          : state.isMinimized
                            ? "border-white/12 bg-white/[0.06] text-white"
                            : "border-transparent bg-transparent text-mist hover:border-white/10 hover:bg-white/[0.05]"
                      )}
                    >
                      <span
                        className={cn(
                          "rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em]",
                          config.tone
                        )}
                      >
                        {config.shortLabel}
                      </span>
                      <span className="mt-2 text-xs uppercase tracking-[0.16em]">
                        {config.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {openDesktopCount === 0 ? (
              <div className="absolute inset-0 z-0 flex items-center justify-center px-8">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-8 text-center backdrop-blur-xl">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-mist">
                    Workspace idle
                  </p>
                  <p className="mt-3 text-lg text-white">
                    Open a module from the desktop icons or dock.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="space-y-4 rounded-[30px] border border-white/10 bg-ink-950/72 p-4 shadow-panel backdrop-blur-xl">
          <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
            <Tag>{siteContent.hero.eyebrow}</Tag>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-signal">
              {siteContent.hero.name}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">
              Building practical systems across data, software, automation, and AI.
            </h1>
            <p className="mt-4 text-sm leading-7 text-mist">{siteContent.hero.subheadline}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {windowOrder.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobileActive(id)}
                className={cn(
                  "rounded-[18px] border px-3 py-3 text-center text-xs uppercase tracking-[0.18em] transition",
                  mobileActive === id
                    ? "border-sky-300/24 bg-sky-400/10 text-white"
                    : "border-white/10 bg-white/[0.04] text-mist"
                )}
              >
                {windowConfigs[id].title}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">
                Active module
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
                {mobileActive}
              </p>
            </div>
            <div className="p-4">
              <WindowBody id={mobileActive} mobile />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WindowFrame({
  title,
  active,
  children,
  onFocus,
  onClose,
  onMinimize
}: {
  title: string;
  active: boolean;
  children: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "flex cursor-grab items-center justify-between border-b px-4 py-3 active:cursor-grabbing",
          active ? "border-sky-300/18 bg-sky-400/[0.07]" : "border-white/8 bg-white/[0.03]"
        )}
        onMouseDown={onFocus}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Close ${title}`}
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]"
            />
            <button
              type="button"
              aria-label={`Minimize ${title}`}
              onClick={(event) => {
                event.stopPropagation();
                onMinimize();
              }}
              className="h-2.5 w-2.5 rounded-full bg-[#febb2e]"
            />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-white">{title}</p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
          draggable
        </p>
      </div>
      <div className="h-[calc(100%-53px)] overflow-y-auto p-5">{children}</div>
    </>
  );
}

function WindowBody({ id, mobile = false }: { id: WindowId; mobile?: boolean }) {
  if (id === "about") {
    return <AboutWindow mobile={mobile} />;
  }

  if (id === "projects") {
    return <ProjectsWindow mobile={mobile} />;
  }

  if (id === "resume") {
    return <ResumeWindow />;
  }

  if (id === "contact") {
    return <ContactWindow />;
  }

  return <NowWindow />;
}

function AboutWindow({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            Operating profile
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Grounded in analytics and operations. Moving deeper into systems.
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

      <div className={cn("grid gap-4", mobile ? "" : "xl:grid-cols-[1.05fr_0.95fr]")}>
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
            Experience
          </p>
          <div className="mt-4 space-y-3">
            {siteContent.experience.map((item) => (
              <div
                key={`${item.period}-${item.role}`}
                className="rounded-[20px] border border-white/8 bg-black/18 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">
                    {item.period}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist">
                    {item.company}
                  </p>
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">{item.role}</h3>
                <p className="mt-2 text-sm leading-7 text-mist">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
            Capability map
          </p>
          <div className="mt-4 space-y-3">
            {siteContent.skills.map((group) => (
              <div
                key={group.title}
                className="rounded-[20px] border border-white/8 bg-black/18 p-4"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
                  {group.title}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsWindow({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            Work directory
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Practical work with clear technical and workflow value.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-mist">
          Replace these placeholders with real screenshots and links later. The structure is
          already set up to read like shipped work, not course exercises.
        </p>
      </div>

      <div className={cn("grid gap-4", mobile ? "" : "xl:grid-cols-2")}>
        {siteContent.projects.map((project, index) => (
          <article
            key={project.title}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <Tag>0{index + 1}</Tag>
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
                {project.stack.slice(0, 3).join(" / ")}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">{project.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-200">{project.summary}</p>
            <div className="mt-4 rounded-[20px] border border-white/8 bg-black/18 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
                What I built
              </p>
              <p className="mt-2 text-sm leading-7 text-mist">{project.built}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-mist">{project.impact}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ResumeWindow() {
  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Resume</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Clean handoff for recruiters and hiring managers.
        </h2>
        <p className="mt-4 text-sm leading-8 text-mist sm:text-base">
          Keep resume access simple here. The module behaves like a window, but the actual
          asset stays a normal PDF for easy download, forwarding, and ATS-safe review.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-white/8 bg-black/18 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
            Public path
          </p>
          <p className="mt-3 break-all text-sm leading-7 text-white">{siteContent.resumePath}</p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-black/18 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
            Placement
          </p>
          <p className="mt-3 text-sm leading-7 text-white">
            Store the PDF in `public/resume/clark-thompson-resume.pdf`
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href={siteContent.resumePath} variant="primary">
          Open Resume
        </Button>
        <Button href={siteContent.resumePath} variant="secondary">
          Download PDF
        </Button>
      </div>
    </div>
  );
}

function ContactWindow() {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
          Access channel
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          Open to good conversations around data, software, automation, and AI work.
        </h2>
        <p className="mt-4 text-sm leading-8 text-mist sm:text-base">
          {siteContent.contact.prompt}
        </p>
      </div>
      <div className="grid gap-4">
        {siteContent.contact.links.map((link, index) => (
          <div
            key={link.label}
            className="rounded-[24px] border border-white/8 bg-black/18 p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              Channel 0{index + 1}
            </p>
            <h3 className="mt-3 text-lg font-medium text-white">{link.label}</h3>
            <div className="mt-4">
              <Button href={link.href} variant={index === 2 ? "primary" : "secondary"}>
                Open {link.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NowWindow() {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Now / queue</p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          Current momentum, shown as live build work.
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/22 p-4 backdrop-blur-xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white">{value}</p>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
