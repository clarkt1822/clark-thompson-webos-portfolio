import { siteContent } from "@/content/site";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWindow } from "@/components/ui/section-window";

export function AboutPanel() {
  const { about } = siteContent;

  return (
    <SectionWindow id="about" label="Operating Profile" rightLabel="Builder Brief">
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <SectionHeader
          eyebrow="About"
          title="Started in business problems. Moving deeper into systems."
          description={about.intro}
        />

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {about.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-mist">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
              Guiding principles
            </p>
            <div className="mt-4 space-y-3">
              {about.principles.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-4"
                >
                  <span className="font-mono text-sm text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-6 text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWindow>
  );
}
