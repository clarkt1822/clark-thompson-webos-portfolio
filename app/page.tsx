import { AppShell } from "@/components/site/app-shell";
import { DesktopWorkspace } from "@/components/site/desktop-workspace";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-5 md:h-full">
        <DesktopWorkspace />
      </div>
    </AppShell>
  );
}
