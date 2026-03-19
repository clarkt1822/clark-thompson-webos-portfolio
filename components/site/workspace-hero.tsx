import { Button } from "@/components/ui/button";
import { SectionWindow } from "@/components/ui/section-window";
import { Tag } from "@/components/ui/tag";
import { siteContent } from "@/content/site";

export function WorkspaceHero() {
  const { hero } = siteContent;

  return (
    <section id="top" className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
      <SectionWindow
        label="Boot Workspace"
        rightLabel="Active Session"
        className="scanline"
      >
        <div className="grid gap-10 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <Tag>{hero.eyebrow}</Tag>
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-signal">
                  {hero.name}
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {hero.headline}
                </h1>
              </div>
              <p className="max-w-2xl text-base leading-8 text-mist sm:text-lg">
                {hero.subheadline}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {hero.ctas.map((cta) => (
                <Button key={cta.label} href={cta.href} variant={cta.variant}>
                  {cta.label}
                </Button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {hero.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.035] p-4"
                >
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
                    {metric.label}
                  </p>
                  <p className="text-sm leading-6 text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">
                System State
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-signal/15 bg-signal/8 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-signal">
                <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
                Online
              </span>
            </div>

            <div className="space-y-4">
              <StatusBlock label="Current focus" value={hero.focus} />
              <StatusBlock label="Status" value={hero.status} />
              <StatusBlock label="Availability" value={hero.availability} />
            </div>

            <div className="mt-6 rounded-2xl border border-sky-300/10 bg-sky-400/8 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sky-200">
                Intent
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-100">
                Build useful systems. Show the work. Keep the claims honest.
              </p>
            </div>
          </div>
        </div>
      </SectionWindow>

      <SectionWindow label="Pinned Channels" rightLabel="Priority Stack">
        <div className="grid gap-4 px-5 py-6 sm:px-6">
          <MiniPanel
            index="01"
            title="Data"
            body="Analytics, KPI thinking, reporting, stakeholder translation, decision support."
          />
          <MiniPanel
            index="02"
            title="Software"
            body="TypeScript, backend thinking, internal tools, shipping reusable systems."
          />
          <MiniPanel
            index="03"
            title="Automation"
            body="Workflow design, orchestration, repetitive process reduction, cleaner handoffs."
          />
          <MiniPanel
            index="04"
            title="Applied AI"
            body="RAG, document workflows, AI-assisted operations, grounded implementation."
          />
        </div>
      </SectionWindow>
    </section>
  );
}

function StatusBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white">{value}</p>
    </div>
  );
}

function MiniPanel({
  index,
  title,
  body
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.035] p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mist">{index}</p>
      <h2 className="mt-3 text-xl font-medium text-white">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-mist">{body}</p>
    </div>
  );
}
