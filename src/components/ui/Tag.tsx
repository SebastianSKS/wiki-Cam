import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "jungle" | "rust" | "index" | "outline";

const TONE: Record<Tone, string> = {
  default: "bg-ink text-paper border-ink",
  jungle: "bg-jungle text-jungle-ink border-jungle",
  rust: "bg-rust text-paper border-rust",
  index: "bg-index text-ink border-index",
  outline: "bg-transparent text-ink border-current",
};

export function Tag({
  children,
  tone = "default",
  code,
  className,
  title,
}: {
  children: ReactNode;
  tone?: Tone;
  /** Glifo o clave corta a la izquierda, en recuadro invertido. */
  code?: string;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "catalog inline-flex select-none items-stretch border",
        TONE[tone],
        className,
      )}
    >
      {code ? (
        <span className="flex items-center border-r border-current/40 px-1.5 py-1 font-bold">
          {code}
        </span>
      ) : null}
      <span className="flex items-center px-2 py-1">{children}</span>
    </span>
  );
}
