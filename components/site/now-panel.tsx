import { siteContent } from "@/content/site";
import { SectionHeader } from "@/components/ui/section-header";
import { SectionWindow } from "@/components/ui/section-window";

export function NowPanel() {
  return (
    <SectionWindow id="now" label="Current Queue" rightLabel="Now / Building">
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <SectionHeader
          eyebrow="Now"
          title="A live signal of momentum."
          description="This section exists to reinforce trajectory. It should feel current, specific, and believable."
        />

        <div className="grid gap-3">
          {siteContent.now.map((item, index) => (
            <div
              key={item}
              className="flex gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5"
            >
              <span className="pt-1 font-mono text-xs uppercase tracking-[0.24em] text-signal">
                0{index + 1}
              </span>
              <p className="text-sm leading-7 text-mist sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWindow>
  );
}
