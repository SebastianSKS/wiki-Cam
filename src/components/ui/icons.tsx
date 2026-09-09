import type { SVGProps } from "react";

/**
 * Iconos propios en el mismo lenguaje que las ilustraciones de especie:
 * contorno grueso, trazo simple, 1-2 colores de la paleta, SIN acuarela.
 * El contorno usa `currentColor` (se adapta a día/noche) y los rellenos usan
 * variables de tema (`var(--jungle)`, etc.) que también voltean con el modo.
 * Sustituyen a los emoji del sistema para que el sitio se vea igual en todas
 * las plataformas.
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

/* — "Les va bien": árbol frondoso (verde) — */
export function TreeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        d="M7.5 13a4 4 0 0 1-1-7.86A5 5 0 0 1 16.4 4.4 3.6 3.6 0 0 1 16.5 13Z"
        fill="var(--jungle)"
      />
      <path d="M12 12.5V21" />
      <path d="M12 16.5 9.5 14M12 15l2.5-2" />
    </Base>
  );
}

/* — "Necesitan ayuda": sol asomando tras una nube (amarillo) — */
export function CloudSunIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="16.5" cy="7.5" r="3" fill="var(--sun)" />
      <path d="M16.5 2.5V4M21.5 7.5H20M20 4l-1 1" />
      <path
        d="M6.5 19a3.5 3.5 0 0 1-.4-6.98A4.5 4.5 0 0 1 14.7 10.9 3 3 0 0 1 15 19Z"
        fill="var(--paper)"
      />
    </Base>
  );
}

/* — "En peligro": salvavidas (coral) — */
export function LifeRingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" fill="var(--coral)" />
      <circle cx="12" cy="12" r="3.4" fill="var(--paper)" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </Base>
  );
}

/* — "¿Sabías que…?": foco (chispa coral) — */
export function BulbIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9.5 18.5h5M10.5 21.5h3" />
      <path d="M12 2.5a6 6 0 0 0-3.7 10.7c.7.6 1.1 1.4 1.2 2.3h5c.1-.9.5-1.7 1.2-2.3A6 6 0 0 0 12 2.5Z" />
      <path d="M10 12s.8-1.2 2-1.2S14 12 14 12" stroke="var(--coral)" />
    </Base>
  );
}

/* — "Para saber más": lupa (lente azul cielo) — */
export function SearchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="10.5" cy="10.5" r="6" fill="var(--sky)" />
      <path d="m15 15 5 5" />
    </Base>
  );
}

/* — "Cada animal tiene su cuento": libro abierto — */
export function BookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        d="M12 6C10.5 4.6 7.6 4.1 4 4.6v13.8c3.6-.5 6.5 0 8 1.6 1.5-1.6 4.4-2.1 8-1.6V4.6C16.4 4.1 13.5 4.6 12 6Z"
        fill="var(--paper)"
      />
      <path d="M12 6v14" />
    </Base>
  );
}

/* — "Carnet de explorador": brújula (aguja coral) — */
export function CompassIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z" fill="var(--coral)" />
    </Base>
  );
}

/* — "Medidor de cuidado": brote — */
export function SproutIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3-2-5.2-5.2-5.2C6.8 10.8 8.8 13 12 13Z" fill="var(--jungle)" />
      <path d="M12 15.5c0-2.6 1.7-4.6 4.4-4.6C16.4 13.5 14.7 15.5 12 15.5Z" fill="var(--jungle)" />
      <path d="M7.5 21h9" />
    </Base>
  );
}

/* — Footer: taxonomía (hélice) — */
export function DnaIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 3c0 4.5 8 6 8 9s-8 4.5-8 9" />
      <path d="M16 3c0 4.5-8 6-8 9s8 4.5 8 9" />
      <path d="M9.2 7h5.6M9.2 17h5.6" stroke="var(--jungle)" />
    </Base>
  );
}

/* — Footer: estatus en México (pin) — */
export function PinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z"
        fill="var(--coral)"
      />
      <circle cx="12" cy="10.5" r="2.4" fill="var(--paper)" />
    </Base>
  );
}

/* — Footer: municipios (mapa plegado) — */
export function MapIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        d="M3 6.5 9 4.5l6 2 6-2v13l-6 2-6-2-6 2Z"
        fill="var(--sky)"
      />
      <path d="M9 4.5v13M15 6.5v13" />
    </Base>
  );
}

/* — Especie endémica: estrella (única, un tesoro) — */
export function StarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path
        d="M12 2.5 14.9 8.4 21.5 9.3 16.7 13.9 17.9 20.5 12 17.4 6.1 20.5 7.3 13.9 2.5 9.3 9.1 8.4Z"
        fill="var(--sun)"
      />
    </Base>
  );
}

/* — Especie nativa: casita (está en casa aquí, y también en otras) — */
export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" fill="var(--jungle)" />
      <path d="M10 19v-4.5h4V19" />
    </Base>
  );
}

/* — Marca del logo: carita de jaguar (línea, va sobre el círculo bg-sun) — */
export function JaguarMark(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.4 6.6 4.7 3.9l3.1 1.2M17.6 6.6l1.7-2.7-3.1 1.2" fill="currentColor" />
      <circle cx="12" cy="13" r="7.7" />
      <circle cx="9.4" cy="12.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="12.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="8.1" cy="8.7" r="1.15" />
      <circle cx="15.9" cy="8.7" r="1.15" />
      <path d="M12 15.4 10.9 17h2.2Z" fill="var(--coral)" stroke="var(--coral)" />
      <path d="M12 17v1.4" />
      <path d="M8.6 15.6H5.4M8.6 17l-2.6 1M15.4 15.6h3.2M15.4 17l2.6 1" strokeWidth="1.6" />
    </Base>
  );
}
