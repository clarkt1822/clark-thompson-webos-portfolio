import { siteContent } from "@/content/site";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWindow } from "@/components/ui/section-window";

export function SkillsPanel() {
  return (
    <SectionWindow id="skills" label="Config Panel" rightLabel="Capabilities">
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <SectionHeader
          eyebrow="Skills"
          title="Grouped like a system profile, not a badge wall."
          description="This section should help technical screens and recruiters understand your current range quickly without turning into an unstructured keyword dump."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {siteContent.skills.map((group) => (
            <div
              key={group.title}
              className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
                {group.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWindow>
  );
}
