import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/cn";

type Variant = "solid" | "sun" | "coral" | "sky" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const BASE =
  "group relative inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-line " +
  "font-extrabold no-underline select-none " +
  "shadow-[0_5px_0_0_var(--line)] " +
  "transition-transform duration-150 ease-[var(--ease-bounce)] " +
  "hover:-translate-y-0.5 " +
  "active:translate-y-[5px] active:scale-95 active:shadow-[0_0_0_0_var(--line)] " +
  "focus-visible:outline-[3px] focus-visible:outline-offset-[3px]";

const VARIANT: Record<Variant, string> = {
  solid: "bg-jungle text-jungle-ink",
  sun: "bg-sun text-sun-ink",
  coral: "bg-coral text-coral-ink",
  sky: "bg-sky text-sky-ink",
  outline: "bg-paper text-ink",
  ghost: "bg-transparent text-ink border-transparent shadow-none",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.8rem]",
  md: "px-6 py-3 text-[0.9rem]",
  lg: "px-8 py-4 text-base",
};

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="relative inline-block transition-transform duration-200 ease-[var(--ease-bounce)] group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps &
  ({ href: string } | { href?: undefined }) &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        <Inner>{children}</Inner>
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      <Inner>{children}</Inner>
    </button>
  );
}
