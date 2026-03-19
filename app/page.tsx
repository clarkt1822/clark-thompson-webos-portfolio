import { AppShell } from "@/components/site/app-shell";
import { DesktopWorkspace } from "@/components/site/desktop-workspace";
import { ExperiencePanel } from "@/components/site/experience-panel";
import { FooterNote } from "@/components/site/footer-note";
import { Reveal } from "@/components/site/reveal";
import { SkillsPanel } from "@/components/site/skills-panel";
import { TerminalWidget } from "@/components/site/terminal-widget";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Reveal>
          <DesktopWorkspace />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <ExperiencePanel />
            <div className="space-y-6">
              <SkillsPanel />
              <TerminalWidget />
            </div>
          </div>
        </Reveal>
        <FooterNote />
      </div>
    </AppShell>
  );
}
