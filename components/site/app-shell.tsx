import { LauncherNav } from "./launcher-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden md:h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(122,156,132,0.08),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(87,115,95,0.08),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-8xl flex-col px-4 pb-16 pt-4 sm:px-6 md:h-screen md:pb-4 lg:px-8">
        <LauncherNav />
        <main className="flex-1 md:overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
