import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWindow } from "@/components/ui/section-window";
import { Tag } from "@/components/ui/tag";

const accentMap = {
  signal: "from-signal/25 to-transparent",
  glow: "from-sky-400/25 to-transparent",
  ember: "from-amber-300/20 to-transparent"
} as const;

export function ProjectsPanel() {
  return (
    <SectionWindow id="projects" label="Work Directory" rightLabel="Selected Projects">
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <SectionHeader
          eyebrow="Projects"
          title="Shipped work aimed at real workflow leverage."
          description="These placeholders are written to reflect the kind of practical systems work this portfolio should showcase: grounded scope, technical judgment, and business relevance."
        />

        <div className="grid gap-5">
          {siteContent.projects.map((project, index) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03]"
            >
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <Tag>0{index + 1}</Tag>
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mist">
                      Practical system
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                      <p className="mt-2 text-base leading-7 text-slate-200">{project.summary}</p>
                    </div>
                    <ProjectBlock label="Problem" value={project.problem} />
                    <ProjectBlock label="What I built" value={project.built} />
                    <ProjectBlock label="Why it matters" value={project.impact} />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-mist"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-l border-white/8 p-5 sm:p-6">
                  <div
                    className={cn(
                      "flex h-full min-h-[18rem] flex-col justify-between rounded-[24px] border border-white/8 bg-gradient-to-br p-5",
                      accentMap[project.accent]
                    )}
                  >
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
                        Visual placeholder
                      </p>
                      <div className="mt-4 rounded-[22px] border border-white/10 bg-ink-950/80 p-4">
                        <div className="grid gap-3">
                          <div className="h-12 rounded-2xl border border-white/8 bg-white/[0.03]" />
                          <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                            <div className="h-40 rounded-2xl border border-white/8 bg-black/25" />
                            <div className="grid gap-3">
                              <div className="h-20 rounded-2xl border border-white/8 bg-white/[0.03]" />
                              <div className="h-16 rounded-2xl border border-white/8 bg-white/[0.03]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-mist">
                      <ProjectLink label="GitHub" href={project.links.github} />
                      <ProjectLink label="Live demo" href={project.links.demo} />
                      <ProjectLink label="Case study" href={project.links.caseStudy} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionWindow>
  );
}

function ProjectBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm leading-7 text-mist">{value}</p>
    </div>
  );
}

function ProjectLink({ label, href }: { label: string; href: string }) {
  const pending = href === "#";

  if (pending) {
    return (
      <span className="rounded-full border border-dashed border-white/10 px-4 py-2 text-white/45">
        {label} pending
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-white/10 px-4 py-2 hover:text-white"
    >
      {label}
    </a>
  );
}
