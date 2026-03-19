"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
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

const stagePadding = 20;
const dockReserve = 120;
const sideRailWidth = 272;
const infoRailWidth = 272;
const chromeLayerZ = 10;
const dockLayerZ = 20;
const baseWindowZ = 40;
const defaultStageSize: StageSize = { width: 1280, height: 720 };

const windowConfigs: Record<WindowId, WindowConfig> = {
  about: { id: "about", title: "About", shortLabel: "ABT", tone: "bg-white/[0.08] text-white", defaultWidth: 740, defaultHeight: 500, minWidth: 560, minHeight: 360 },
  projects: { id: "projects", title: "Projects", shortLabel: "PRJ", tone: "bg-[#7d9988]/16 text-[#e0e9e3]", defaultWidth: 720, defaultHeight: 460, minWidth: 520, minHeight: 340 },
  resume: { id: "resume", title: "Resume", shortLabel: "PDF", tone: "bg-[#97ae9a]/16 text-[#edf2ee]", defaultWidth: 470, defaultHeight: 300, minWidth: 400, minHeight: 240 },
  contact: { id: "contact", title: "Contact", shortLabel: "COM", tone: "bg-[#8ca291]/16 text-[#e4ece6]", defaultWidth: 500, defaultHeight: 360, minWidth: 400, minHeight: 280 },
  now: { id: "now", title: "Now", shortLabel: "NOW", tone: "bg-white/[0.08] text-white", defaultWidth: 560, defaultHeight: 390, minWidth: 420, minHeight: 300 },
};

const windowOrder: WindowId[] = ["about", "projects", "resume", "contact", "now"];
const hiddenWindowBase = { isOpen: false, isMinimized: false, x: 0, y: 0, z: 1, width: 0, height: 0 };
const baseWindows: Record<WindowId, WindowState> = {
  about: { ...hiddenWindowBase },
  projects: { ...hiddenWindowBase },
  resume: { ...hiddenWindowBase },
  contact: { ...hiddenWindowBase },
  now: { ...hiddenWindowBase },
};

export function DesktopWorkspace() {
  const reduceMotion = !!useReducedMotion();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const topZ = React.useRef(baseWindowZ + 5);
  const initializedRef = React.useRef(false);
  const [hasMounted, setHasMounted] = React.useState(false);
  const [stageSize, setStageSize] = React.useState<StageSize>(defaultStageSize);
  const [windows, setWindows] = React.useState<Record<WindowId, WindowState>>(() => createInitialWindowLayout(defaultStageSize));
  const [mobileActive, setMobileActive] = React.useState<WindowId>("about");
  const openDesktopWindows = windowOrder.filter((id) => windows[id].isOpen);
  const visibleDesktopWindows = openDesktopWindows.filter((id) => !windows[id].isMinimized);
  const activeWindowId = React.useMemo(() => {
    const activeWindow = openDesktopWindows.reduce<{ id: WindowId; z: number } | null>((current, id) => {
      const next = windows[id];
      if (!current || next.z > current.z) return { id, z: next.z };
      return current;
    }, null);
    return activeWindow?.id ?? null;
  }, [openDesktopWindows, windows]);
  const activeWindowTitle = activeWindowId ? windowConfigs[activeWindowId].title : "No active window";

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

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
        return current.about.isOpen ? clampAllWindows(current, stageSize) : createInitialWindowLayout(stageSize);
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

  return (
    <section id="top" className="space-y-5 md:h-full md:min-h-0">
      <div className="hidden md:block md:h-full md:min-h-0">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="zen-shell-panel relative overflow-hidden rounded-[34px] md:flex md:h-full md:min-h-0 md:flex-col"
        >
          <div className="zen-shell-bar relative z-[1] flex items-center justify-between border-b px-4 py-3">
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
              <span className="rounded-full border border-[#8ca291]/20 bg-[#8ca291]/10 px-2.5 py-1 text-[#d4e1d6]">Live</span>
            </div>
          </div>

          <div
            ref={stageRef}
            className="zen-workspace-bg relative min-h-0 flex-1 overflow-hidden"
          >
            <motion.div
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0.38, scale: 1.01 }}
              animate={reduceMotion ? undefined : { opacity: [0.36, 0.48, 0.36], scale: [1, 1.014, 1] }}
              transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="zen-workspace-atmosphere zen-ambient-drift absolute inset-0"
            />
            <div className="zen-ambient-glow zen-ambient-drift-slow absolute inset-[-8%]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.028),transparent_18%,rgba(176,198,181,0.026)_52%,transparent_100%)] opacity-95" />
            <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: "linear-gradient(rgba(162,182,168,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(162,182,168,0.16) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
            <div className="absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,rgba(10,14,11,0.34),transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(7,10,8,0.22),transparent)]" />

            <div className="absolute left-6 top-6 z-10 w-[272px]" style={{ zIndex: chromeLayerZ }}>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
                className="zen-surface rounded-[28px] px-6 py-6 backdrop-blur-xl"
              >
                <Tag className="px-2.5 py-0.5 text-[11px] tracking-[0.2em] text-mist/80">{siteContent.hero.eyebrow}</Tag>
                <div className="mt-5 space-y-5">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{siteContent.hero.name}</p>
                  <h1 className="text-[2rem] font-semibold leading-[1.14] tracking-[-0.02em] text-white">From analytics and operations into software and AI systems.</h1>
                  <p className="text-[15px] leading-8 text-white/62">{siteContent.hero.subheadline}</p>
                </div>
              </motion.div>
            </div>

            <div className="absolute right-6 top-6 z-10 w-[240px] space-y-3" style={{ zIndex: chromeLayerZ }}>
              <MetricCard label="Current focus" value={activeWindowTitle} />
              <MetricCard label="Status" value={siteContent.hero.status} />
              <MetricCard label="Availability" value={siteContent.hero.availability} />
            </div>

            {hasMounted ? (
              <AnimatePresence>
                {windowOrder.map((id) => {
                  const state = windows[id];
                  const config = windowConfigs[id];
                  if (!state.isOpen || state.isMinimized || !state.width || !state.height) return null;
                  const active = id === activeWindowId;
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
                    >
                      <WindowBody id={id} />
                    </DesktopWindow>
                  );
                })}
              </AnimatePresence>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-5" style={{ zIndex: dockLayerZ }}>
              <div className="zen-dock mx-auto flex max-w-fit items-center gap-2 rounded-[28px] px-3 py-3 backdrop-blur-xl">
                {windowOrder.map((id) => {
                  const config = windowConfigs[id];
                  const state = windows[id];
                  const isVisible = state.isOpen && !state.isMinimized;
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => openWindow(id)}
                      whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }}
                      className={cn(
                        "flex min-w-[96px] flex-col items-center rounded-[20px] border px-3 py-2.5 text-center transition duration-150",
                        isVisible
                          ? "zen-dock-active text-white"
                          : state.isMinimized
                            ? "border-white/12 bg-white/[0.05] text-white"
                            : "border-transparent bg-transparent text-mist hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      <span className={cn("rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em]", config.tone)}>{config.shortLabel}</span>
                      <span className="mt-2 text-xs uppercase tracking-[0.16em]">{config.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {hasMounted && visibleDesktopWindows.length === 0 ? (
              <div className="absolute inset-0 z-0 flex items-center justify-center px-8">
                <div className="zen-surface rounded-[28px] p-8 text-center backdrop-blur-xl">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-mist">Workspace idle</p>
                  <p className="mt-3 text-lg text-white">Open a module from the desktop icons or dock.</p>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>

      <div className="md:hidden">
        <div className="space-y-4 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,20,0.8),rgba(11,15,12,0.74))] p-4 shadow-panel backdrop-blur-xl">
          <div className="zen-surface-soft rounded-[24px] p-5">
            <Tag>{siteContent.hero.eyebrow}</Tag>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.28em] text-signal">{siteContent.hero.name}</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">Building practical systems across data, software, automation, and AI.</h1>
            <p className="mt-4 text-sm leading-7 text-mist">{siteContent.hero.subheadline}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {windowOrder.map((id) => (
              <button key={id} type="button" onClick={() => setMobileActive(id)} className={cn("rounded-[18px] border px-3 py-3 text-center text-xs uppercase tracking-[0.18em] transition", mobileActive === id ? "border-[#a7bead]/24 bg-[#7f9a88]/10 text-white" : "border-white/10 bg-white/[0.04] text-mist")}>
                {windowConfigs[id].title}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,20,0.84),rgba(10,13,11,0.78))]">
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

function DesktopWindow({ id, title, state, active, stageSize, reduceMotion, children, onFocus, onClose, onMinimize, onDragComplete }: { id: WindowId; title: string; state: WindowState; active: boolean; stageSize: StageSize; reduceMotion: boolean; children: React.ReactNode; onFocus: (id: WindowId) => void; onClose: (id: WindowId) => void; onMinimize: (id: WindowId) => void; onDragComplete: (id: WindowId, x: number, y: number) => void }) {
  const x = useMotionValue(state.x);
  const y = useMotionValue(state.y);
  const isDraggingRef = React.useRef(false);
  const dragSessionRef = React.useRef<{ pointerId: number; startPointerX: number; startPointerY: number; startX: number; startY: number } | null>(null);

  React.useEffect(() => {
    if (isDraggingRef.current) return;
    x.set(state.x);
    y.set(state.y);
  }, [state.x, state.y, x, y]);

  const applyPointerPosition = React.useCallback((clientX: number, clientY: number) => {
    const session = dragSessionRef.current;
    if (!session) return;
    const bounds = getWindowBounds(state.width, state.height, stageSize);
    const nextX = clamp(session.startX + (clientX - session.startPointerX), bounds.minX, bounds.maxX);
    const nextY = clamp(session.startY + (clientY - session.startPointerY), bounds.minY, bounds.maxY);
    x.set(nextX);
    y.set(nextY);
  }, [stageSize, state.height, state.width, x, y]);

  const endDrag = React.useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    dragSessionRef.current = null;
    onDragComplete(id, x.get(), y.get());
  }, [id, onDragComplete, x, y]);

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;
      applyPointerPosition(event.clientX, event.clientY);
    };
    const handlePointerUp = (event: PointerEvent) => {
      const session = dragSessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;
      applyPointerPosition(event.clientX, event.clientY);
      endDrag();
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [applyPointerPosition, endDrag]);

  const startDrag = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    dragSessionRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: x.get(),
      startY: y.get(),
    };
    onFocus(id);
  }, [id, onFocus, x, y]);

  return (
    <motion.section
      onMouseDown={() => onFocus(id)}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: active ? 1 : 0.996, filter: active ? "brightness(1)" : "brightness(0.94)" }}
      exit={reduceMotion ? {} : { opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ width: state.width, height: state.height, zIndex: state.z, x, y }}
      className={cn(
        "zen-window absolute left-0 top-0 overflow-hidden rounded-[30px] border backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]",
        active
          ? "zen-window-active"
          : "zen-window-idle opacity-[0.95]"
      )}
    >
      <WindowFrame title={title} active={active} onFocus={() => onFocus(id)} onClose={() => onClose(id)} onMinimize={() => onMinimize(id)} onDragStart={startDrag}>
        {children}
      </WindowFrame>
    </motion.section>
  );
}

function WindowFrame({ title, active, children, onFocus, onClose, onMinimize, onDragStart }: { title: string; active: boolean; children: React.ReactNode; onFocus: () => void; onClose: () => void; onMinimize: () => void; onDragStart: (event: React.PointerEvent<HTMLDivElement>) => void }) {
  return (
    <>
      <div className={cn("flex cursor-grab items-center justify-between border-b px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[background-color,border-color,box-shadow] duration-150 active:cursor-grabbing", active ? "zen-window-bar-active" : "zen-window-bar-idle")} onMouseDown={onFocus} onPointerDown={onDragStart}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label={`Close ${title}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onClose(); }} className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
            <button type="button" aria-label={`Minimize ${title}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onMinimize(); }} className="h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white">{title}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-mist/85">{active ? "active window" : "background window"}</p>
          </div>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist/85">drag</p>
      </div>
      <div className="flex h-[calc(100%-53px)] min-h-0 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.008)_18%,rgba(11,16,13,0.08)_100%)]">
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
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
    <div className="space-y-5 pr-1">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="zen-surface-soft min-w-0 rounded-[24px] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Operating profile</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Grounded in analytics and operations. Moving deeper into systems.</h2>
          <div className="mt-5 space-y-4">
            {[siteContent.about.intro, ...siteContent.about.body].map((paragraph) => (
              <p key={paragraph} className="text-sm leading-8 text-mist sm:text-base">{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          {siteContent.about.principles.map((item, index) => (
            <div key={item} className="zen-surface-soft rounded-[24px] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">Principle 0{index + 1}</p>
              <p className="mt-3 text-base leading-7 text-white/90">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={cn("grid gap-4", mobile ? "" : "xl:grid-cols-[1.05fr_0.95fr]")}>
        <div className="zen-surface-soft min-w-0 rounded-[24px] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Experience</p>
          <div className="mt-4 space-y-3">
            {siteContent.experience.map((item) => (
              <div key={`${item.period}-${item.role}`} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{item.period}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist">{item.company}</p>
                </div>
                <h3 className="mt-3 text-lg font-medium text-white/92">{item.role}</h3>
                <p className="mt-2 text-sm leading-7 text-mist">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="zen-surface-soft min-w-0 rounded-[24px] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Capability map</p>
          <div className="mt-4 space-y-3">
            {siteContent.skills.map((group) => (
              <div key={group.title} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">{group.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/84">{item}</span>
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
          <article key={project.title} className="zen-surface-soft rounded-[24px] p-5">
            <div className="flex items-center justify-between gap-3">
              <Tag>0{index + 1}</Tag>
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{project.stack.slice(0, 3).join(" / ")}</span>
            </div>
            <h3 className="mt-4 text-xl font-medium text-white/92">{project.title}</h3>
            <p className="mt-2 text-sm leading-7 text-white/74">{project.summary}</p>
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
      <div className="zen-surface-soft rounded-[24px] p-5">
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
      <div className="zen-surface-soft rounded-[24px] p-5">
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
          <div key={item} className="zen-surface-soft flex gap-4 rounded-[22px] p-4">
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
    <div className="zen-surface rounded-[22px] p-4 backdrop-blur-xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-white/88">{value}</p>
    </div>
  );
}

function createInitialWindowLayout(stageSize: StageSize): Record<WindowId, WindowState> {
  const about = createOpenWindowState("about", stageSize, baseWindowZ + 5, { centered: true });
  const projects = createWindowFromConfig("projects", stageSize, baseWindowZ + 2, { x: Math.min(stageSize.width - 760, about.x + 180), y: Math.min(stageSize.height - 420, about.y + 62) });
  const resume = createWindowFromConfig("resume", stageSize, baseWindowZ + 1, { x: Math.min(stageSize.width - 500, about.x + 260), y: Math.min(stageSize.height - 320, about.y + 100) });
  const contact = createWindowFromConfig("contact", stageSize, baseWindowZ + 1, { x: Math.min(stageSize.width - 520, about.x + 310), y: Math.min(stageSize.height - 420, about.y + 152) });
  const now = createWindowFromConfig("now", stageSize, baseWindowZ + 1, { x: Math.min(stageSize.width - 580, about.x + 340), y: Math.min(stageSize.height - 440, about.y + 38) });
  return {
    about,
    projects: { ...projects, isOpen: false, isMinimized: false, z: baseWindowZ + 2 },
    resume: { ...resume, isOpen: false, isMinimized: false, z: baseWindowZ + 1 },
    contact: { ...contact, isOpen: false, isMinimized: false, z: baseWindowZ + 1 },
    now: { ...now, isOpen: false, isMinimized: false, z: baseWindowZ + 1 },
  };
}

function createOpenWindowState(id: WindowId, stageSize: StageSize, z: number, options?: { x?: number; y?: number; centered?: boolean }): WindowState {
  return { ...createWindowFromConfig(id, stageSize, z, options), isOpen: true, isMinimized: false, z };
}

function createWindowFromConfig(id: WindowId, stageSize: StageSize, z: number, options?: { x?: number; y?: number; centered?: boolean }): WindowState {
  const config = windowConfigs[id];
  const usableWidth = stageSize.width - sideRailWidth - infoRailWidth;
  const maxWidth = Math.max(config.minWidth, usableWidth - stagePadding * 2);
  const maxHeight = Math.max(config.minHeight, stageSize.height - dockReserve - stagePadding * 2);
  const width = clamp(config.defaultWidth, config.minWidth, maxWidth);
  const height = clamp(config.defaultHeight, config.minHeight, maxHeight);
  const centeredX = sideRailWidth + (usableWidth - width) / 2;
  const centeredY = Math.max(34, (stageSize.height - dockReserve - height) / 2);
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
  const bounds = getWindowBounds(width, height, stageSize);
  return { ...windowState, width, height, x: clamp(windowState.x, bounds.minX, bounds.maxX), y: clamp(windowState.y, bounds.minY, bounds.maxY) };
}

function getWindowBounds(width: number, height: number, stageSize: StageSize) {
  return {
    minX: stagePadding,
    minY: stagePadding,
    maxX: Math.max(stagePadding, stageSize.width - width - stagePadding),
    maxY: Math.max(stagePadding, stageSize.height - height - dockReserve),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
