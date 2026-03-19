import { siteContent } from "@/content/site";
import { Button } from "@/components/ui/button";
import { SectionWindow } from "@/components/ui/section-window";

export function ContactPanel() {
  return (
    <SectionWindow id="contact" label="Access Channel" rightLabel="Comms">
      <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-signal">
            Contact
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Let&apos;s talk if the work sits somewhere between data, software, automation, and AI.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-mist">
            {siteContent.contact.prompt}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {siteContent.contact.links.map((link, index) => (
              <Button
                key={link.label}
                href={link.href}
                variant={index === 2 ? "primary" : "secondary"}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">
            Access notes
          </p>
          <div className="mt-5 space-y-4">
            <InfoRow label="Best for" value="Roles that value practical systems thinking and visible growth." />
            <InfoRow label="Strength" value="Connecting business problems to technical implementation." />
            <InfoRow label="Preference" value="Work with real operational usefulness, not AI theater." />
          </div>
        </div>
      </div>
    </SectionWindow>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white">{value}</p>
    </div>
  );
}
