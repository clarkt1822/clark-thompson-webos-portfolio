import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border border-sky-300/20 bg-sky-400/10 text-sky-100 shadow-glow hover:border-sky-300/40 hover:bg-sky-400/15",
  secondary:
    "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/8",
  ghost:
    "border border-transparent bg-transparent text-mist hover:border-white/10 hover:bg-white/5 hover:text-white"
};

export function Button({
  href,
  children,
  variant = "primary",
  className
}: ButtonProps) {
  const external = href.startsWith("http") || href.startsWith("mailto:");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium tracking-wide transition duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
