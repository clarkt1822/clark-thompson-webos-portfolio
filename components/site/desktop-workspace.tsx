"use client";

import * as React from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
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
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
};
type WindowState = {
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
};
type StageSize = { width: number; height: number };
type ResizeState = {
  id: WindowId;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
};

const stagePadding = 16;
const dockReserve = 92;
const sideRailWidth = 272;

const windowConfigs: Record<WindowId, WindowConfig> = {
  about: { id: "about", title: "About", shortLabel: "ABT", tone: "bg-white/8 text-white", defaultWidth: 760, defaultHeight: 580, minWidth: 560, minHeight: 360 },
  projects: { id: "projects", title: "Projects", shortLabel: "PRJ", tone: "bg-sky-400/14 text-sky-100", defaultWidth: 720, defaultHeight: 540, minWidth: 520, minHeight: 340 },
  resume: { id: "resume", title: "Resume", shortLabel: "PDF", tone: "bg-amber-300/14 text-amber-100", defaultWidth: 480, defaultHeight: 320, minWidth: 400, minHeight: 240 },
  contact: { id: "contact", title: "Contact", shortLabel: "COM", tone: "bg-signal/14 text-signal", defaultWidth: 500, defaultHeight: 420, minWidth: 400, minHeight: 280 },
  now: { id: "now", title: "Now", shortLabel: "NOW", tone: "bg-white/8 text-white", defaultWidth: 560, defaultHeight: 460, minWidth: 420, minHeight: 300 },
};

const windowOrder: WindowId[] = ["about", "projects", "resume", "contact", "now"];
const hiddenWindowBase = { isOpen: false, isMinimized: false, x: 0, y: 0, z: 1, width: 0, height: 0 };
const baseWindows: Record<WindowId, WindowState> = {
  about: { ...hiddenWindowBase, isOpen: true, z: 5 },
  projects: { ...hiddenWindowBase },
  resume: { ...hiddenWindowBase },
  contact: { ...hiddenWindowBase },
  now: { ...hiddenWindowBase },
};

export function DesktopWorkspace() {
  const reduceMotion = !!useReducedMotion();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const topZ = React.useRef(5);
  const initializedRef = React.useRef(false);
  const [stageSize, setStageSize] = React.useState<StageSize>({ width: 0, height: 0 });
  const [windows, setWindows] = React.useState<Record<WindowId, WindowState>>(baseWindows);
  const [mobileActive, setMobileActive] = React.useState<WindowId>("about");
  const [resizeState, setResizeState] = React.useState<ResizeState | null>(null);
  const visibleDesktopWindows = windowOrder.filter((id) => windows[id].isOpen && !windows[id].isMinimized);

  React.useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const syncStageSize = () => setStageSize({ width: element.clientWidth, height: element.clientHeight });
    syncStageSize();
    const observer = new ResizeObserver(syncStageSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!stageSize.width || !stageSize.height) return;
    setWindows((current) => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        return createInitialWindowLayout(stageSize);
      }
      return clampAllWindows(current, stageSize);
    });
  }, [stageSize]);

  const bringToFront = React.useCallback((id: WindowId) => {
    topZ.current += 1;
    setWindows((current) => ({ ...current, [id]: { ...current[id], isOpen: true, isMinimized: false, z: topZ.current } }));
  }, []);

  const openWindow = React.useCallback((id: WindowId) => {
    topZ.current += 1;
    setWindows((current) => {
      const next = current[id];
      if (next.isOpen && !next.isMinimized) {
        return { ...current, [id]: { ...next, z: topZ.current } };
      }
      const layout = next.width > 0 && next.height > 0 ? next : createWindowFromConfig(id, stageSize, topZ.current);
      return { ...current, [id]: { ...layout, isOpen: true, isMinimized: false, z: topZ.current } };
    });
  }, [stageSize]);

  const closeWindow = React.useCallback((id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], isOpen: false, isMinimized: false } }));
  }, []);

  const minimizeWindow = React.useCallback((id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], isMinimized: true } }));
  }, []);

  const setWindowPosition = React.useCallback((id: WindowId, nextX: number, nextY: number) => {
    setWindows((current) => ({ ...current, [id]: clampWindow({ ...current[id], x: nextX, y: nextY }, windowConfigs[id], stageSize) }));
  }, [stageSize]);

  const resizeWindow = React.useCallback((id: WindowId, nextWidth: number, nextHeight: number) => {
    setWindows((current) => {
      const config = windowConfigs[id];
      const maxWidth = Math.max(config.minWidth, stageSize.width - current[id].x - stagePadding);
      const maxHeight = Math.max(config.minHeight, stageSize.height - current[id].y - dockReserve);
      const resized = clampWindow(
        { ...current[id], width: clamp(nextWidth, config.minWidth, maxWidth), height: clamp(nextHeight, config.minHeight, maxHeight) },
        config,
        stageSize
      );
      return { ...current, [id]: resized };
    });
  }, [stageSize]);

  const beginResize = React.useCallback((id: WindowId, event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    bringToFront(id);
    const current = windows[id];
    setResizeState({ id, startX: event.clientX, startY: event.clientY, startWidth: current.width, startHeight: current.height });
  }, [bringToFront, windows]);

  React.useEffect(() => {
    if (!resizeState) return;
    const handlePointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - resizeState.startX;
      const deltaY = event.clientY - resizeState.startY;
      resizeWindow(resizeState.id, resizeState.startWidth + deltaX, resizeState.startHeight + deltaY);
    };
    const handlePointerUp = () => setResizeState(null);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [resizeState, resizeWindow]);

  return (
    <section id="top" className="space-y-5 md:h-full">
      <div className="hidden md:block md:h-full">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-ink-950/70 shadow-panel backdrop-blur-xl md:h-full">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">Personal Workspace</p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              <span>{siteContent.hero.name}</span>
              <span className="rounded-full border border-signal/15 bg-signal/8 px-2.5 py-1 text-signal">Live</span>
            </div>
          </div>

          <div ref={stageRef} className="relative h-[calc(100vh-7.4rem)] min-h-[700px] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(88,198,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(126,240,195,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
            <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-20" />
            <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(4,7,11,0.45),transparent)]" />

            <div className="absolute left-6 top-6 z-10 w-[240px] space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-black/24 p-5 backdrop-blur-xl">
                <Tag>{siteContent.hero.eyebrow}</Tag>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.28em] text-signal">{siteContent.hero.name}</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">From analytics and operations into software and AI systems.</h1>
                <p className="mt-4 text-sm leading-7 text-mist">{siteContent.hero.subheadline}</p>
              </div>

              <div className="grid gap-3">
                {windowOrder.map((id) => {
                  const config = windowConfigs[id];
                  const state = windows[id];
                  return (
                    <button key={id} type="button" onClick={() => openWindow(id)} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]">
                      <span className={cn("inline-flex rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em]", config.tone)}>{config.shortLabel}</span>
                      <p className="mt-3 text-base font-medium text-white">{config.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mist">{!state.isOpen ? "Open window" : state.isMinimized ? "Restore window" : "Focus window"}</p>
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
                if (!state.isOpen || state.isMinimized || !state.width || !state.height) return null;
                const active = state.z === Math.max(...windowOrder.map((key) => windows[key].z));
                return (
                  <DesktopWindow
                    key={id}
                    id={id}
                    title={config.title}
                    state={state}
                    active={active}
                    stageSize={stageSize}
                    reduceMotion={reduceMotion}
                    onFocus={bringToFront}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    onDragComplete={setWindowPosition}
                    onResizeStart={beginResize}
                  >
                    <WindowBody id={id} />
                  </DesktopWindow>
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
                    <button key={id} type="button" onClick={() => openWindow(id)} className={cn("flex min-w-[92px] flex-col items-center rounded-[18px] border px-3 py-2 text-center transition", isVisible ? "border-sky-300/24 bg-sky-400/10 text-white" : state.isMinimized ? "border-white/12 bg-white/[0.06] text-white" : "border-transparent bg-transparent text-mist hover:border-white/10 hover:bg-white/[0.05]")}>
                      <span className={cn("rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em]", config.tone)}>{config.shortLabel}</span>
                      <span className="mt-2 text-xs uppercase tracking-[0.16em]">{config.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {visibleDesktopWindows.length === 0 ? (
              <div className="absolute inset-0 z-0 flex items-center justify-center px-8">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-8 text-center backdrop-blur-xl">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-mist">Workspace idle</p>
                  <p className="mt-3 text-lg text-white">Open a module from the desktop icons or dock.</p>
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
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-signal">{siteContent.hero.name}</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">Building practical systems across data, software, automation, and AI.</h1>
            <p className="mt-4 text-sm leading-7 text-mist">{siteContent.hero.subheadline}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {windowOrder.map((id) => (
              <button key={id} type="button" onClick={() => setMobileActive(id)} className={cn("rounded-[18px] border px-3 py-3 text-center text-xs uppercase tracking-[0.18em] transition", mobileActive === id ? "border-sky-300/24 bg-sky-400/10 text-white" : "border-white/10 bg-white/[0.04] text-mist")}>
                {windowConfigs[id].title}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">Active module</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">{mobileActive}</p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <WindowBody id={mobileActive} mobile />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopWindow({ id, title, state, active, stageSize, reduceMotion, children, onFocus, onClose, onMinimize, onDragComplete, onResizeStart }: { id: WindowId; title: string; state: WindowState; active: boolean; stageSize: StageSize; reduceMotion: boolean; children: React.ReactNode; onFocus: (id: WindowId) => void; onClose: (id: WindowId) => void; onMinimize: (id: WindowId) => void; onDragComplete: (id: WindowId, x: number, y: number) => void; onResizeStart: (id: WindowId, event: React.PointerEvent<HTMLButtonElement>) => void }) {
  const dragControls = useDragControls();
  const dragConstraints = React.useMemo(() => ({
    left: stagePadding - state.x,
    top: stagePadding - state.y,
    right: Math.max(stagePadding - state.x, stageSize.width - state.width - stagePadding - state.x),
    bottom: Math.max(stagePadding - state.y, stageSize.height - state.height - dockReserve - state.y),
  }), [stageSize.height, stageSize.width, state.height, state.width, state.x, state.y]);

  return (
    <motion.section
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.03}
      dragConstraints={dragConstraints}
      onMouseDown={() => onFocus(id)}
      onDragStart={() => onFocus(id)}
      onDragEnd={(_, info) => onDragComplete(id, state.x + info.offset.x, state.y + info.offset.y)}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: state.y, x: state.x }}
      exit={reduceMotion ? {} : { opacity: 0, scale: 0.985, y: state.y + 14 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ width: state.width, height: state.height, zIndex: state.z }}
      className={cn("absolute left-0 top-0 overflow-hidden rounded-[28px] border bg-ink-950/92 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl", active ? "border-sky-300/22" : "border-white/10")}
    >
      <WindowFrame title={title} active={active} onFocus={() => onFocus(id)} onClose={() => onClose(id)} onMinimize={() => onMinimize(id)} onDragStart={(event) => dragControls.start(event)}>
        {children}
      </WindowFrame>
      <button type="button" aria-label={`Resize ${title}`} onPointerDown={(event) => onResizeStart(id, event)} className="absolute bottom-2 right-2 h-5 w-5 cursor-se-resize rounded-sm border border-white/10 bg-white/[0.04]">
        <span className="absolute bottom-1 right-1 h-2.5 w-2.5 border-b border-r border-mist/80" />
      </button>
    </motion.section>
  );
}

function WindowFrame({ title, active, children, onFocus, onClose, onMinimize, onDragStart }: { title: string; active: boolean; children: React.ReactNode; onFocus: () => void; onClose: () => void; onMinimize: () => void; onDragStart: (event: React.PointerEvent<HTMLDivElement>) => void }) {
  return (
    <>
      <div className={cn("flex cursor-grab items-center justify-between border-b px-4 py-3 active:cursor-grabbing", active ? "border-sky-300/18 bg-sky-400/[0.07]" : "border-white/8 bg-white/[0.03]")} onMouseDown={onFocus} onPointerDown={onDragStart}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label={`Close ${title}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onClose(); }} className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
            <button type="button" aria-label={`Minimize ${title}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onMinimize(); }} className="h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-white">{title}</p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">drag / resize</p>
      </div>
      <div className="h-[calc(100%-53px)] overflow-y-auto p-5">{children}</div>
    </>
  );
}

function WindowBody({ id, mobile = false }: { id: WindowId; mobile?: boolean }) {
  if (id === "about") return <AboutWindow mobile={mobile} />;
  if (id === "projects") return <ProjectsWindow mobile={mobile} />;
  if (id === "resume") return <ResumeWindow />;
  if (id === "contact") return <ContactWindow />;
  return <NowWindow />;
}

function AboutWindow({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Operating profile</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Grounded in analytics and operations. Moving deeper into systems.</h2>
          <div className="mt-5 space-y-4">
            {[siteContent.about.intro, ...siteContent.about.body].map((paragraph) => (
              <p key={paragraph} className="text-sm leading-8 text-mist sm:text-base">{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {siteContent.about.principles.map((item, index) => (
            <div key={item} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">Principle 0{index + 1}</p>
              <p className="mt-3 text-base leading-7 text-white">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-4", mobile ? "" : "xl:grid-cols-[1.05fr_0.95fr]")}>
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Experience</p>
          <div className="mt-4 space-y-3">
            {siteContent.experience.map((item) => (
              <div key={`${item.period}-${item.role}`} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{item.period}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist">{item.company}</p>
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">{item.role}</h3>
                <p className="mt-2 text-sm leading-7 text-mist">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Capability map</p>
          <div className="mt-4 space-y-3">
            {siteContent.skills.map((group) => (
              <div key={group.title} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">{group.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-100">{item}</span>
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
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Work directory</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Practical work with clear technical and workflow value.</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-mist">Replace these placeholders with real screenshots and links later. The structure is already set up to read like shipped work, not course exercises.</p>
      </div>

      <div className={cn("grid gap-4", mobile ? "" : "xl:grid-cols-2")}>
        {siteContent.projects.map((project, index) => (
          <article key={project.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3">
              <Tag>0{index + 1}</Tag>
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{project.stack.slice(0, 3).join(" / ")}</span>
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">{project.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-200">{project.summary}</p>
            <div className="mt-4 rounded-[20px] border border-white/8 bg-black/18 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">What I built</p>
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
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Straightforward handoff for recruiters and hiring managers.</h2>
        <p className="mt-4 text-sm leading-8 text-mist sm:text-base">Keep this window simple. Open the PDF when you need it, or download it directly.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={siteContent.resumePath} variant="primary">Open Resume</Button>
          <Button href={siteContent.resumePath} variant="secondary">Download PDF</Button>
        </div>
      </div>
    </div>
  );
}

function ContactWindow() {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Access channel</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Open to good conversations around data, software, automation, and AI work.</h2>
        <p className="mt-4 text-sm leading-8 text-mist sm:text-base">{siteContent.contact.prompt}</p>
      </div>
      <div className="grid gap-4">
        {siteContent.contact.links.map((link, index) => (
          <div key={link.label} className="rounded-[24px] border border-white/8 bg-black/18 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">Channel 0{index + 1}</p>
            <h3 className="mt-3 text-lg font-medium text-white">{link.label}</h3>
            <div className="mt-4">
              <Button href={link.href} variant={index <= 1 ? "primary" : "secondary"}>Open {link.label}</Button>
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
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Current momentum, shown as live build work.</h2>
      </div>
      <div className="grid gap-3">
        {siteContent.now.map((item, index) => (
          <div key={item} className="flex gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-signal">0{index + 1}</span>
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

function createInitialWindowLayout(stageSize: StageSize): Record<WindowId, WindowState> {
  const about = createWindowFromConfig("about", stageSize, 5, { centered: true });
  const projects = createWindowFromConfig("projects", stageSize, 2, { x: Math.min(stageSize.width - 760, about.x + 170), y: Math.min(stageSize.height - 420, about.y + 54) });
  const resume = createWindowFromConfig("resume", stageSize, 1, { x: Math.min(stageSize.width - 520, about.x + 240), y: Math.min(stageSize.height - 320, about.y + 92) });
  const contact = createWindowFromConfig("contact", stageSize, 1, { x: Math.min(stageSize.width - 520, about.x + 300), y: Math.min(stageSize.height - 420, about.y + 150) });
  const now = createWindowFromConfig("now", stageSize, 1, { x: Math.min(stageSize.width - 580, about.x + 330), y: Math.min(stageSize.height - 440, about.y + 40) });

  return {
    about: { ...about, isOpen: true, isMinimized: false, z: 5 },
    projects: { ...projects, isOpen: false, isMinimized: false, z: 2 },
    resume: { ...resume, isOpen: false, isMinimized: false, z: 1 },
    contact: { ...contact, isOpen: false, isMinimized: false, z: 1 },
    now: { ...now, isOpen: false, isMinimized: false, z: 1 },
  };
}

function createWindowFromConfig(id: WindowId, stageSize: StageSize, z: number, options?: { x?: number; y?: number; centered?: boolean }): WindowState {
  const config = windowConfigs[id];
  const maxWidth = Math.max(config.minWidth, stageSize.width - sideRailWidth - stagePadding * 3);
  const maxHeight = Math.max(config.minHeight, stageSize.height - dockReserve - stagePadding * 2);
  const width = clamp(config.defaultWidth, config.minWidth, maxWidth);
  const height = clamp(config.defaultHeight, config.minHeight, maxHeight);
  const centeredX = sideRailWidth + (stageSize.width - sideRailWidth - width) / 2;
  const centeredY = Math.max(30, (stageSize.height - dockReserve - height) / 2);

  return clampWindow(
    { isOpen: false, isMinimized: false, x: options?.centered ? centeredX : options?.x ?? centeredX, y: options?.centered ? centeredY : options?.y ?? centeredY, z, width, height },
    config,
    stageSize
  );
}

function clampAllWindows(windows: Record<WindowId, WindowState>, stageSize: StageSize): Record<WindowId, WindowState> {
  return {
    about: clampWindow(windows.about, windowConfigs.about, stageSize),
    projects: clampWindow(windows.projects, windowConfigs.projects, stageSize),
    resume: clampWindow(windows.resume, windowConfigs.resume, stageSize),
    contact: clampWindow(windows.contact, windowConfigs.contact, stageSize),
    now: clampWindow(windows.now, windowConfigs.now, stageSize),
  };
}

function clampWindow(windowState: WindowState, config: WindowConfig, stageSize: StageSize): WindowState {
  if (!stageSize.width || !stageSize.height) return windowState;
  const maxWidth = Math.max(config.minWidth, stageSize.width - stagePadding * 2);
  const maxHeight = Math.max(config.minHeight, stageSize.height - dockReserve - stagePadding);
  const width = clamp(windowState.width || config.defaultWidth, config.minWidth, maxWidth);
  const height = clamp(windowState.height || config.defaultHeight, config.minHeight, maxHeight);
  const maxX = Math.max(sideRailWidth, stageSize.width - width - stagePadding);
  const maxY = Math.max(stagePadding, stageSize.height - height - dockReserve);
  return { ...windowState, width, height, x: clamp(windowState.x, sideRailWidth, maxX), y: clamp(windowState.y, stagePadding, maxY) };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
