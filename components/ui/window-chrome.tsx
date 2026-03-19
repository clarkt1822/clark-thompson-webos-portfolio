export function WindowChrome({
  label,
  rightLabel
}: {
  label: string;
  rightLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-xs uppercase tracking-[0.24em] text-mist">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#fe5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febb2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2aca44]" />
        </div>
        <span>{label}</span>
      </div>
      {rightLabel ? <span>{rightLabel}</span> : null}
    </div>
  );
}
