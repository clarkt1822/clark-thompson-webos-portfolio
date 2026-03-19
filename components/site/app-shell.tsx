import { LauncherNav } from "./launcher-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden md:h-screen">
      <div className="zen-shell-bg absolute inset-0" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-8xl flex-col px-4 pb-16 pt-4 sm:px-6 md:h-screen md:min-h-0 md:pb-3 md:pt-3 lg:px-8">
        <LauncherNav />
        <main className="flex-1 md:min-h-0 md:overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
