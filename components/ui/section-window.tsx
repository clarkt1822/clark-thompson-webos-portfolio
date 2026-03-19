import { cn } from "@/lib/utils";
import { WindowChrome } from "./window-chrome";

export function SectionWindow({
  id,
  label,
  rightLabel,
  children,
  className
}: {
  id?: string;
  label: string;
  rightLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "panel-sheen overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.04] shadow-panel backdrop-blur-xl",
        className
      )}
    >
      <WindowChrome label={label} rightLabel={rightLabel} />
      <div className="relative">{children}</div>
    </section>
  );
}
