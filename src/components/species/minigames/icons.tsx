import type { SVGProps } from "react";

/**
 * Iconos propios de los minijuegos: mismo lenguaje que
 * src/components/ui/icons.tsx (trazo grueso, currentColor, 24×24), pero
 * viven aparte para no arrastrar ese archivo compartido a este feature.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Huella de jaguar: el punto de avance del "Acecho silencioso". */
export function PawIcon(props: IconProps) {
  return (
    <Base {...props}>
      <ellipse cx="12" cy="15.6" rx="5.6" ry="4.6" fill="var(--coral)" />
      <circle cx="6.1" cy="9" r="2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="6.2" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="6.2" r="2" fill="currentColor" stroke="none" />
      <circle cx="20.6" cy="10" r="1.8" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** Ojo vigía: cerrado = a salvo para avanzar, abierto = alerta, congélate. */
export function EyeIcon({
  open,
  ...props
}: IconProps & { open: boolean }) {
  return (
    <Base {...props}>
      {open ? (
        <>
          <path
            d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
            fill="var(--paper)"
          />
          <circle cx="12" cy="12" r="3.2" fill="var(--rust)" stroke="var(--cacao)" />
        </>
      ) : (
        <path d="M3 13c2.5-3.5 6-5 9-5s6.5 1.5 9 5" />
      )}
    </Base>
  );
}

/** Ramita con un par de hojas: los apoyos del recorrido de "Cola de quinta mano". */
export function BranchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 17c5-2.4 11-2.4 16 0" />
      <path d="M9.5 17c-.4-3 .8-5.4 3-7 .6 2.7-.2 5.2-3 7Z" fill="var(--jungle)" />
      <path d="M15 17c.6-2.6-.2-4.8-2.2-6.4-.9 2.4-.4 4.7 2.2 6.4Z" fill="var(--jungle)" />
    </Base>
  );
}

/** Punta de la cola prensil: el asa que se arrastra para estirarla hacia la siguiente rama. */
export function TailHookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 5c7-1 10 2.3 10 7s-3 7.6-8 6.6" />
      <circle cx="7.6" cy="18.3" r="2" fill="var(--coral)" stroke="none" />
    </Base>
  );
}
