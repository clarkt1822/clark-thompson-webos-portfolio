import { AboutPanel } from "@/components/site/about-panel";
import { AppShell } from "@/components/site/app-shell";
import { ContactPanel } from "@/components/site/contact-panel";
import { ExperiencePanel } from "@/components/site/experience-panel";
import { FooterNote } from "@/components/site/footer-note";
import { NowPanel } from "@/components/site/now-panel";
import { ProjectsPanel } from "@/components/site/projects-panel";
import { Reveal } from "@/components/site/reveal";
import { SkillsPanel } from "@/components/site/skills-panel";
import { TerminalWidget } from "@/components/site/terminal-widget";
import { WorkspaceHero } from "@/components/site/workspace-hero";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Reveal>
          <WorkspaceHero />
        </Reveal>
        <Reveal delay={0.04}>
          <AboutPanel />
        </Reveal>
        <Reveal delay={0.05}>
          <ProjectsPanel />
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
        <Reveal delay={0.1}>
          <NowPanel />
        </Reveal>
        <Reveal delay={0.12}>
          <ContactPanel />
        </Reveal>
        <FooterNote />
      </div>
    </AppShell>
  );
}
