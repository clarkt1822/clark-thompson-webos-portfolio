import { siteContent } from "@/content/site";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWindow } from "@/components/ui/section-window";

export function ExperiencePanel() {
  return (
    <SectionWindow id="experience" label="System Log" rightLabel="Experience Trace">
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <SectionHeader
          eyebrow="Experience"
          title="A readable operating log, not a LinkedIn dump."
          description="The goal here is to make your work history scan quickly while still reinforcing the through-line: solving operational and data problems, then moving deeper into engineering and AI systems."
        />

        <div className="relative grid gap-4">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-white/10 md:block" />
          {siteContent.experience.map((item) => (
            <div
              key={`${item.period}-${item.role}`}
              className="relative rounded-[24px] border border-white/8 bg-white/[0.03] p-5 md:ml-10"
            >
              <div className="absolute -left-[2.7rem] top-6 hidden h-4 w-4 rounded-full border border-signal/30 bg-signal/20 md:block" />
              <div className="grid gap-4 md:grid-cols-[0.25fr_0.75fr] md:items-start">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
                  {item.period}
                </p>
                <div>
                  <h3 className="text-xl font-medium text-white">{item.role}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-mist">
                    {item.company}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-mist">{item.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWindow>
  );
}
