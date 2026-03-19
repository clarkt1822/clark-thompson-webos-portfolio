import { LauncherNav } from "./launcher-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden md:h-screen">
      <div className="absolute inset-0 bg-grid bg-[size:40px_40px] opacity-30" />
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(88,198,255,0.18),transparent_48%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-8xl flex-col px-4 pb-16 pt-4 sm:px-6 md:h-screen md:pb-4 lg:px-8">
        <LauncherNav />
        <main className="flex-1 md:overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
