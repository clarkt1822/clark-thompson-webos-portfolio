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
    "border border-[#a7bead]/22 bg-[#7f9a88]/12 text-[#ebf2ec] shadow-glow hover:border-[#a7bead]/38 hover:bg-[#7f9a88]/18",
  secondary:
    "border border-white/10 bg-white/[0.045] text-white hover:border-white/16 hover:bg-white/[0.07]",
  ghost:
    "border border-transparent bg-transparent text-mist hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
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
