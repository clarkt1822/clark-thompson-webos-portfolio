"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

type WindowId = "about" | "skills" | "experience" | "projects" | "resume" | "contact";
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
type WindowPresenceAction = "open" | "close" | "minimize";
type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  bullets: readonly string[];
};

const stagePadding = 18;
const dockReserve = 112;
const sideRailWidth = 272;
const infoRailWidth = 240;
const chromeLayerZ = 20;
const baseWindowZ = 30;
const dockLayerZ = 50;

const windowConfigs: Record<WindowId, WindowConfig> = {
  about: { id: "about", title: "About", shortLabel: "ABT", tone: "bg-white/8 text-white", defaultWidth: 760, defaultHeight: 580, minWidth: 560, minHeight: 360 },
  skills: { id: "skills", title: "Skills", shortLabel: "SKL", tone: "bg-[#7f9fb1]/16 text-[#dfeaf0]", defaultWidth: 760, defaultHeight: 620, minWidth: 480, minHeight: 320 },
  experience: { id: "experience", title: "Experience", shortLabel: "EXP", tone: "bg-[#8da58c]/16 text-[#e3ece2]", defaultWidth: 640, defaultHeight: 520, minWidth: 500, minHeight: 320 },
  projects: { id: "projects", title: "Selected Work", shortLabel: "PRJ", tone: "bg-[#7ca88b]/16 text-[#dce9df]", defaultWidth: 720, defaultHeight: 540, minWidth: 520, minHeight: 340 },
  resume: { id: "resume", title: "Resume", shortLabel: "PDF", tone: "bg-[#9ab4a1]/16 text-[#edf3ef]", defaultWidth: 470, defaultHeight: 300, minWidth: 400, minHeight: 240 },
  contact: { id: "contact", title: "Contact", shortLabel: "COM", tone: "bg-[#8aa592]/16 text-[#e3ede6]", defaultWidth: 500, defaultHeight: 420, minWidth: 400, minHeight: 280 },
};

const windowOrder: WindowId[] = ["about", "skills", "experience", "projects", "resume", "contact"];
const hiddenWindowBase = { isOpen: false, isMinimized: false, x: 0, y: 0, z: baseWindowZ, width: 0, height: 0 };
const baseWindows: Record<WindowId, WindowState> = {
  about: { ...hiddenWindowBase, z: baseWindowZ + 5 },
  skills: { ...hiddenWindowBase },
  experience: { ...hiddenWindowBase },
  projects: { ...hiddenWindowBase },
  resume: { ...hiddenWindowBase },
  contact: { ...hiddenWindowBase },
};
const initialWindowOffsets: Record<WindowId, { x: number; y: number }> = {
  about: { x: 0, y: 0 },
  skills: { x: 28, y: -12 },
  experience: { x: 62, y: 20 },
  projects: { x: 48, y: 28 },
  resume: { x: 92, y: -24 },
  contact: { x: 72, y: 52 },
};

const experienceEntries: readonly ExperienceEntry[] = [
  {
    role: "AI Consultant (Contract)",
    company: "AutomateNexus",
    period: "Feb 2026 - Present",
    bullets: [
      "Partner with SMB operators to analyze workflows, identify bottlenecks, and design practical AI-driven automation systems that reduce manual work and improve operational efficiency.",
      "Lead discovery conversations to translate business processes into clear technical requirements, prioritizing automation initiatives based on ROI and execution feasibility.",
      "Design and deploy production-grade workflows using Make, n8n, and API integrations across CRMs, communication tools, and accounting systems.",
      "Implement AI-enabled document processing, intelligent routing logic, and multi-step automations with monitoring, logging, and error handling to ensure reliability at scale."
    ]
  },
  {
    role: "Automation and Data Lead",
    company: "SimWorld LLC",
    period: "Nov 2022 - Oct 2025",
    bullets: [
      "Designed and deployed AI-enabled operational workflows using SQL and Python, reducing manual reporting and data processing time by 20%.",
      "Built data pipelines and KPI tracking across multiple systems to surface user engagement and revenue insights.",
      "Partnered with engineering teams on QA and backend validation for AI-driven systems.",
      "Created dashboards and reporting workflows using Tableau, Excel, SQL, and Python.",
      "Used historical platform data to forecast revenue trends and retention patterns, influencing roadmap and resource decisions."
    ]
  },
  {
    role: "Sales Development Representative",
    company: "FlowPath",
    period: "Jan 2025 - Jun 2025",
    bullets: [
      "Worked with an AI-based facilities management platform focused on operational automation and workflow efficiency.",
      "Used data insights to support lead qualification, messaging refinement, and pipeline optimization.",
      "Collaborated across sales and marketing to connect platform capabilities to customer pain points."
    ]
  },
  {
    role: "Sales Operations Specialist",
    company: "Interim Physicians",
    period: "Oct 2023 - Jan 2025",
    bullets: [
      "Optimized AI-assisted outreach and sourcing tools to improve recruiter workflows and provider engagement.",
      "Managed and analyzed a CRM database of 300,000+ records to improve outreach efficiency and performance.",
      "Identified data inconsistencies and process inefficiencies in AI-supported workflows."
    ]
  },
  {
    role: "Sales Agent / Customer Service Representative",
    company: "Symmetry Financial Group & Intuit (Contract)",
    period: "Nov 2022 - Nov 2023",
    bullets: [
      "Balanced two concurrent contract roles across sales and customer support.",
      "Conducted outbound outreach and client matching for insurance products.",
      "Supported customers and documented interactions in Salesforce in a remote environment."
    ]
  },
  {
    role: "Senior Account Executive",
    company: "PLS Logistics Services",
    period: "Jan 2023 - Aug 2023",
    bullets: [
      "Managed business development and client relationships in a 3PL sales environment.",
      "Built new business pipelines and delivered tailored logistics solutions.",
      "Collaborated across teams to support service delivery and client outcomes."
    ]
  },
  {
    role: "Staff Advisor / Head of Recruiting / Unit Head",
    company: "URJ Henry S. Jacobs Camp",
    period: "May 2018 - Aug 2022",
    bullets: [
      "Held multiple leadership roles across recruiting, operations, and team management.",
      "Supported performance, scheduling, and conflict resolution for large teams.",
      "Recruited and placed 100+ staff members.",
      "Built early operations experience through logistics, scheduling, and data tracking."
    ]
  }
] as const;

export function DesktopWorkspace() {
  const reduceMotion = !!useReducedMotion();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const topZ = React.useRef(baseWindowZ + 5);
  const initializedRef = React.useRef(false);
  const [stageSize, setStageSize] = React.useState<StageSize>({ width: 0, height: 0 });
  const [windows, setWindows] = React.useState<Record<WindowId, WindowState>>(baseWindows);
  const [windowActions, setWindowActions] = React.useState<Record<WindowId, WindowPresenceAction>>({
    about: "open",
    skills: "open",
    experience: "open",
    projects: "open",
    resume: "open",
    contact: "open",
  });
  const [mobileActive, setMobileActive] = React.useState<WindowId>("about");
  const visibleDesktopWindows = windowOrder.filter((id) => windows[id].isOpen && !windows[id].isMinimized);
  const activeWindowId =
    visibleDesktopWindows.reduce<WindowId | null>((currentActive, id) => {
      if (!currentActive) return id;
      return windows[id].z > windows[currentActive].z ? id : currentActive;
    }, null);
  

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
    setWindowActions((current) => ({ ...current, [id]: "open" }));
    setWindows((current) => {
      const next = current[id];
      if (next.isOpen && !next.isMinimized) {
        return { ...current, [id]: { ...next, z: topZ.current } };
      }
      const layout =
        next.isMinimized && next.width > 0 && next.height > 0
          ? next
          : createWindowFromConfig(
              id,
              stageSize,
              topZ.current,
              id === "about" ? { centered: true } : { centered: true, ...initialWindowOffsets[id] }
            );
      return { ...current, [id]: { ...layout, isOpen: true, isMinimized: false, z: topZ.current } };
    });
  }, [stageSize]);

  const closeWindow = React.useCallback((id: WindowId) => {
    setWindowActions((current) => ({ ...current, [id]: "close" }));
    setWindows((current) => ({ ...current, [id]: { ...current[id], isOpen: false, isMinimized: false } }));
  }, []);

  const minimizeWindow = React.useCallback((id: WindowId) => {
    setWindowActions((current) => ({ ...current, [id]: "minimize" }));
    setWindows((current) => ({ ...current, [id]: { ...current[id], isMinimized: true } }));
  }, []);

  const setWindowPosition = React.useCallback((id: WindowId, nextX: number, nextY: number) => {
    setWindows((current) => ({ ...current, [id]: clampWindow({ ...current[id], x: nextX, y: nextY }, windowConfigs[id], stageSize) }));
  }, [stageSize]);

  return (
    <section id="top" className="space-y-5 md:h-full">
      <div className="hidden md:block md:h-full">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="zen-shell-panel desktop-shell flex h-full min-h-0 flex-col overflow-hidden rounded-[34px]"
        >
          <div className="zen-shell-bar flex items-center justify-between border-b px-4 py-3">
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
              <span className="rounded-full border border-[#8aa592]/20 bg-[#8aa592]/10 px-2.5 py-1 text-[#cfe0d3]">Live</span>
            </div>
          </div>

          <div
            ref={stageRef}
            className="desktop-stage relative min-h-0 flex-1 overflow-hidden"
          >
            <motion.div
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0.38, scale: 1.01 }}
              animate={reduceMotion ? undefined : { opacity: [0.34, 0.46, 0.34], scale: [1, 1.012, 1] }}
              transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="desktop-stage-glow absolute inset-0"
            />
            <div aria-hidden className="desktop-stage-sheen absolute inset-0 opacity-90" />
            <div aria-hidden className="desktop-stage-vignette absolute inset-0" />
            <motion.div
              aria-hidden
              initial={reduceMotion ? false : { opacity: 0.18, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 0.24, scale: 1 } : { opacity: [0.18, 0.28, 0.2], scale: [0.985, 1.015, 1] }}
              transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="desktop-stage-focus absolute inset-[10%_18%_26%_24%] rounded-[44px] blur-3xl"
            />

            <div className="absolute left-6 top-6 z-10 w-[272px]" style={{ zIndex: chromeLayerZ }}>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
                className="rounded-[28px] border border-white/10 bg-black/24 px-6 py-6 backdrop-blur-xl"
              >
                <Tag className="px-2.5 py-0.5 text-[11px] tracking-[0.2em] text-mist/80">{siteContent.hero.eyebrow}</Tag>
                <div className="mt-5 space-y-5">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">{siteContent.hero.name}</p>
                  <h1 className="text-[2rem] font-semibold leading-[1.16] text-white">Grounded in analytics and operations. Moving deeper into software and AI systems.</h1>
                  <p className="text-[15px] leading-8 text-white/72">{siteContent.hero.subheadline}</p>
                </div>
              </motion.div>
            </div>

            <div className="absolute right-6 top-6 z-10 w-[240px] space-y-3" style={{ zIndex: chromeLayerZ }}>
              <MetricCard label="Current focus" value={activeWindowId ? windowConfigs[activeWindowId].title : "Idle"} />
              <MetricCard label="Status" value={siteContent.hero.status} />
              <MetricCard label="Availability" value={siteContent.hero.availability} />
            </div>

          
              <AnimatePresence initial={false}>
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
                      presenceAction={windowActions[id]}
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
           

            <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-5" style={{ zIndex: dockLayerZ }}>
              <div className="zen-dock mx-auto flex max-w-fit items-center gap-2 rounded-[28px] px-3 py-3">
                {windowOrder.map((id) => {
                  const config = windowConfigs[id];
                  const state = windows[id];
                  const isVisible = state.isOpen && !state.isMinimized;
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => openWindow(id)}
                      whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                      whileTap={reduceMotion ? undefined : { y: -1, scale: 0.992 }}
                      className={cn(
                        "desktop-dock-button flex min-w-[96px] flex-col items-center rounded-[20px] border px-3 py-2.5 text-center",
                        isVisible
                          ? "desktop-dock-button-active text-white"
                          : state.isMinimized
                            ? "border-white/12 bg-white/[0.06] text-white"
                            : "border-transparent bg-transparent text-mist"
                      )}
                    >
                      <span className={cn("rounded-xl px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.22em]", config.tone)}>{config.shortLabel}</span>
                      <span className="mt-2 text-xs uppercase tracking-[0.16em]">{config.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {stageSize.width > 0 && visibleDesktopWindows.length === 0 ? (
              <div className="absolute inset-0 z-0 flex items-center justify-center px-8">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-8 text-center backdrop-blur-xl">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-mist">Workspace idle</p>
                  <p className="mt-3 text-lg text-white">Open a module from the desktop icons or dock.</p>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
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
              <button key={id} type="button" onClick={() => setMobileActive(id)} className={cn("rounded-[18px] border px-3 py-3 text-center text-xs uppercase tracking-[0.18em] transition", mobileActive === id ? "border-[#9ec8a8]/24 bg-[#7ca88b]/10 text-white" : "border-white/10 bg-white/[0.04] text-mist")}>
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

function DesktopWindow({ id, title, state, active, stageSize, reduceMotion, presenceAction, children, onFocus, onClose, onMinimize, onDragComplete }: { id: WindowId; title: string; state: WindowState; active: boolean; stageSize: StageSize; reduceMotion: boolean; presenceAction: WindowPresenceAction; children: React.ReactNode; onFocus: (id: WindowId) => void; onClose: (id: WindowId) => void; onMinimize: (id: WindowId) => void; onDragComplete: (id: WindowId, x: number, y: number) => void }) {
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
      initial={reduceMotion ? false : { opacity: 0, scale: 0.982 }}
      animate={{
        opacity: active ? 1 : 0.96,
        scale: active ? 1 : 0.994,
      }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : presenceAction === "minimize"
            ? { opacity: 0, scale: 0.972, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }
            : { opacity: 0, scale: 0.986, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }
      }
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: state.width, height: state.height, zIndex: state.z, x, y }}
      className={cn(
        "zen-window absolute left-0 top-0 overflow-hidden rounded-[30px] border",
        active ? "zen-window-active" : "zen-window-idle"
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
      <div className={cn("flex cursor-grab items-center justify-between border-b px-4 py-3 active:cursor-grabbing", active ? "zen-window-bar-active" : "zen-window-bar-idle")} onMouseDown={onFocus} onPointerDown={onDragStart}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label={`Close ${title}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onClose(); }} className="desktop-window-control h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
            <button type="button" aria-label={`Minimize ${title}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onMinimize(); }} className="desktop-window-control h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white">{title}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-mist">{active ? "active window" : "background window"}</p>
          </div>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">drag</p>
      </div>
      <div className="flex h-[calc(100%-53px)] min-h-0 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </>
  );
}

function WindowBody({ id, mobile = false }: { id: WindowId; mobile?: boolean }) {
  if (id === "about") return <AboutWindow mobile={mobile} />;
  if (id === "skills") return <SkillsWindow />;
  if (id === "experience") return <ExperienceWindow />;
  if (id === "projects") return <ProjectsWindow mobile={mobile} />;
  if (id === "resume") return <ResumeWindow />;
  if (id === "contact") return <ContactWindow />;
  return null;
}

function AboutWindow({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="space-y-5 pr-1">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AboutSummaryCard />
        <div className="min-w-0 space-y-4">
          <PrinciplesCards />
        </div>
      </div>
      {mobile ? (
        <div className="min-w-0 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">Profile notes</p>
          <p className="mt-3 text-sm leading-7 text-mist">Skills and experience now live in their own dedicated modules so this window stays focused on personal context and working principles.</p>
        </div>
      ) : null}
    </div>
  );
}

function SkillsWindow() {
  return (
    <div className="space-y-5 pr-1">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Skills</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Capabilities Map</h2>
      </div>
      <SkillsContent />
    </div>
  );
}

function ExperienceWindow() {
  return (
    <div className="space-y-5 pr-1">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Experience</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Experience</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-mist">Selected roles across automation, data, operations, and business-facing execution.</p>
      </div>
      <ExperienceContent />
    </div>
  );
}

function ProjectsWindow({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Selected Work</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Selected Work</h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-mist">
          Selected work focused on building and supporting data-driven systems, automation workflows, and applied AI tools.
        </p>
        <p className="max-w-3xl text-sm leading-7 text-mist">
          Ranging from internal operational systems to full-stack AI applications, these projects reflect a focus on solving real problems with practical, scalable solutions.
        </p>
      </div>
      <div className={cn("grid gap-4", mobile ? "" : "xl:grid-cols-2")}>
        {siteContent.projects.map((project, index) => (
          <article key={project.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3">
              <Tag>0{index + 1}</Tag>
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">Selected project</span>
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">{project.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-200">{project.summary}</p>
            <p className="mt-4 text-sm leading-7 text-mist">{project.description}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-mist">
              {project.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[#9ec8a8]" />
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-[20px] border border-white/8 bg-black/18 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">Tech stack</p>
              <p className="mt-2 text-sm leading-7 text-mist">{project.techLine}</p>
            </div>
            {project.primaryLink.href !== "#" ? (
              <div className="mt-4">
                <a
                  href={project.primaryLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-mist transition hover:border-white/20 hover:text-white"
                >
                  {project.primaryLink.label}
                </a>
              </div>
            ) : null}
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
        <p className="mt-4 text-sm leading-8 text-mist sm:text-base"> Open the PDF when you need it, or download it directly.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={siteContent.resumePath} variant="primary" target="_blank" rel="noreferrer">Open Resume</Button>
          <Button href={siteContent.resumePath} variant="secondary" download>Download PDF</Button>
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
      </div>
      <div className="grid gap-4">
        {siteContent.contact.links.map((link, index) => (
          <div key={link.label} className="rounded-[24px] border border-white/8 bg-black/18 p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">Channel 0{index + 1}</p>
            <h3 className="mt-3 text-lg font-medium text-white">{link.label}</h3>
            <div className="mt-4">
              <Button href={link.href} variant="primary">Open {link.label}</Button>
            </div>
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
  const about = createWindowFromConfig("about", stageSize, baseWindowZ + 5, { centered: true });
  const skills = createWindowFromConfig("skills", stageSize, baseWindowZ + 3, { centered: true, ...initialWindowOffsets.skills });
  const experience = createWindowFromConfig("experience", stageSize, baseWindowZ + 2, { centered: true, ...initialWindowOffsets.experience });
  const projects = createWindowFromConfig("projects", stageSize, baseWindowZ + 2, { centered: true, ...initialWindowOffsets.projects });
  const resume = createWindowFromConfig("resume", stageSize, baseWindowZ + 1, { centered: true, ...initialWindowOffsets.resume });
  const contact = createWindowFromConfig("contact", stageSize, baseWindowZ + 1, { centered: true, ...initialWindowOffsets.contact });
  return {
    about: { ...about, isOpen: false, isMinimized: false, z: baseWindowZ + 5 },
    skills: { ...skills, isOpen: false, isMinimized: false, z: baseWindowZ + 3 },
    experience: { ...experience, isOpen: false, isMinimized: false, z: baseWindowZ + 2 },
    projects: { ...projects, isOpen: false, isMinimized: false, z: baseWindowZ + 2 },
    resume: { ...resume, isOpen: false, isMinimized: false, z: baseWindowZ + 1 },
    contact: { ...contact, isOpen: false, isMinimized: false, z: baseWindowZ + 1 },
  };
}

function createOpenWindowState(id: WindowId, stageSize: StageSize, z: number, options?: { x?: number; y?: number; centered?: boolean }): WindowState {
  return { ...createWindowFromConfig(id, stageSize, z, options), isOpen: true, isMinimized: false, z };
}

function createWindowFromConfig(id: WindowId, stageSize: StageSize, z: number, options?: { x?: number; y?: number; centered?: boolean }): WindowState {
  const config = windowConfigs[id];
  const maxWidth = Math.max(config.minWidth, stageSize.width - stagePadding * 2);
  const maxHeight = Math.max(config.minHeight, stageSize.height - dockReserve - stagePadding);
  const width = clamp(config.defaultWidth, config.minWidth, maxWidth);
  const height = clamp(config.defaultHeight, config.minHeight, maxHeight);
  const positionBounds = options?.centered ? getWindowBounds(width, height, stageSize) : getInitialWindowBounds(width, height, stageSize);
  const centeredX = positionBounds.minX + (positionBounds.maxX - positionBounds.minX) / 2;
  const centeredY = positionBounds.minY + (positionBounds.maxY - positionBounds.minY) / 2;
  return clampWindow(
    {
      isOpen: false,
      isMinimized: false,
      x: centeredX + (options?.x ?? (options?.centered ? 0 : initialWindowOffsets[id].x)),
      y: centeredY + (options?.y ?? (options?.centered ? 0 : initialWindowOffsets[id].y)),
      z,
      width,
      height,
    },
    config,
    stageSize
  );
}

function clampAllWindows(windows: Record<WindowId, WindowState>, stageSize: StageSize): Record<WindowId, WindowState> {
  return {
    about: clampWindow(windows.about, windowConfigs.about, stageSize),
    skills: clampWindow(windows.skills, windowConfigs.skills, stageSize),
    experience: clampWindow(windows.experience, windowConfigs.experience, stageSize),
    projects: clampWindow(windows.projects, windowConfigs.projects, stageSize),
    resume: clampWindow(windows.resume, windowConfigs.resume, stageSize),
    contact: clampWindow(windows.contact, windowConfigs.contact, stageSize),
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
  const minX = stagePadding;
  const maxX = Math.max(minX, stageSize.width - width - stagePadding);
  const minY = stagePadding;
  const maxY = Math.max(minY, stageSize.height - height - dockReserve);
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

function getInitialWindowBounds(width: number, height: number, stageSize: StageSize) {
  const minX = sideRailWidth + stagePadding;
  const maxX = Math.max(minX, stageSize.width - infoRailWidth - width - stagePadding);
  const minY = stagePadding;
  const maxY = Math.max(minY, stageSize.height - height - dockReserve);
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function AboutSummaryCard() {
  return (
    <div className="min-w-0 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">Operating profile</p>
      <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Grounded in analytics and operations. Moving deeper into software and AI systems.</h2>
      <div className="mt-5 space-y-4">
        {[siteContent.about.intro, ...siteContent.about.body].map((paragraph) => (
          <p key={paragraph} className="text-sm leading-8 text-mist sm:text-base">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function PrinciplesCards() {
  return (
    <>
      {siteContent.about.principles.map((item, index) => (
        <div key={item} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">Principle 0{index + 1}</p>
          <p className="mt-3 text-base leading-7 text-white">{item}</p>
        </div>
      ))}
    </>
  );
}

function ExperienceContent() {
  return (
    <div className="min-w-0 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
      <div className="space-y-4">
        {experienceEntries.map((item, index) => (
          <article key={`${item.period}-${item.role}`} className={cn("rounded-[20px] border border-white/8 bg-black/18 p-5", index < 2 ? "bg-[#8da58c]/[0.08]" : "")}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-lg font-medium text-white">{item.role}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-mist">{item.company}</p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal sm:text-right">{item.period}</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-mist">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[#9ec8a8]" />
                  <span className="flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function SkillsContent() {
  const primaryGroups = siteContent.skills.slice(0, -1);
  const systemsGroup = siteContent.skills.at(-1);

  return (
    <div className="min-w-0 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
      <div className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-2">
          {primaryGroups.map((group) => (
            <section key={group.title} className="rounded-[20px] border border-white/8 bg-black/18 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">{group.title}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-100">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[#9ec8a8]" />
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {systemsGroup ? (
          <section className="rounded-[20px] border border-white/8 bg-white/[0.04] p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal">{systemsGroup.title}</p>
            <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm leading-6 text-slate-100 sm:grid-cols-2">
              {systemsGroup.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[#9ec8a8]" />
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
