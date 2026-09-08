import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md";

const BASE =
  "group relative inline-flex items-center gap-2.5 catalog border no-underline " +
  "transition-[background-color,color,transform] duration-200 ease-[var(--ease-drawer)] " +
  "active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-[3px]";

const VARIANT: Record<Variant, string> = {
  solid:
    "bg-jungle text-jungle-ink border-jungle hover:bg-ink hover:border-ink",
  outline:
    "bg-transparent text-ink border-current hover:bg-ink hover:text-paper",
  ghost:
    "bg-transparent text-ink border-transparent hover:border-current",
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-2 text-[0.625rem]",
  md: "px-5 py-3 text-[0.6875rem]",
};

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      {/* marcas de registro que aparecen al hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -top-1 h-2 w-2 border-l border-t border-rust opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-rust opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="relative inline-block transition-transform duration-200 ease-[var(--ease-drawer)] group-hover:translate-x-1"
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
