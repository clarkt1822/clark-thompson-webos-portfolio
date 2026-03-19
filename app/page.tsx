import { AppShell } from "@/components/site/app-shell";
import { DesktopWorkspace } from "@/components/site/desktop-workspace";
import { FooterNote } from "@/components/site/footer-note";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <DesktopWorkspace />
        <FooterNote />
      </div>
    </AppShell>
  );
}
