/**
 * Chicozapote / árbol del chicle — Manilkara zapota.
 * Referencia real: árbol de copa densa y oscura, tronco pardo grisáceo con
 * las marcas en zig-zag que dejan los chicleros al sangrarlo, fruto redondo
 * y café (níspero). Madera durísima (dinteles mayas). Carita en el tronco.
 * Micro-interacción: al hover parpadea (data-eye).
 */
export function Sapodilla({ className }: { className?: string }) {
  const CROWN = "#2f7d4a";
  const CROWN_DEEP = "#1f5e37";
  const BARK = "#8a7256";
  const FRUIT = "#a9713f";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un chicozapote con las marcas del chiclero en el tronco"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* suelo */}
        <path d="M20 300c30-10 250-10 280 0" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />

        {/* copa densa y compacta */}
        <path
          d="M160 26c48 0 82 22 82 52 0 14-8 26-22 34 16 8 24 20 24 36 0 32-42 54-90 54s-90-22-90-54c0-16 8-28 24-36-14-8-22-20-22-34 0-30 34-52 82-52Z"
          fill={CROWN}
        />
        {/* grumos oscuros de la copa */}
        <g fill={CROWN_DEEP} stroke="none">
          <circle cx="108" cy="78" r="20" />
          <circle cx="212" cy="82" r="20" />
          <circle cx="160" cy="60" r="18" />
          <circle cx="120" cy="150" r="16" />
          <circle cx="204" cy="150" r="16" />
        </g>

        {/* rama con fruto redondo (níspero) */}
        <g data-tail>
          <path d="M206 150c18 8 26 22 26 44" fill="none" stroke={CROWN_DEEP} strokeWidth="6" />
          <circle cx="234" cy="204" r="20" fill={FRUIT} />
          <path d="M234 184v-8" fill="none" stroke="var(--cacao)" strokeWidth="4" />
          <circle cx="228" cy="198" r="3" fill="#c99b6c" stroke="none" />
        </g>

        {/* tronco */}
        <path
          d="M136 132c-6 0-8 8-8 24 0 46-8 92-24 128h112c-16-36-24-82-24-128 0-16-2-24-8-24Z"
          fill={BARK}
        />
        {/* marcas en zig-zag del chiclero (sangrado del látex) */}
        <path
          d="M148 152l24 16-24 16 24 16-24 16 24 16-24 16"
          fill="none"
          stroke="#5c4a35"
          strokeWidth="5"
        />
        {/* gotas de látex */}
        <g fill="var(--paper)" stroke="none">
          <circle cx="176" cy="176" r="3.5" />
          <circle cx="176" cy="216" r="3" />
        </g>

        {/* carita en el tronco */}
        <g data-eye>
          <circle cx="144" cy="178" r="6" fill="#fff" />
          <circle cx="144" cy="179" r="3" fill="var(--cacao)" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="120" cy="182" r="6" fill="#fff" />
          <circle cx="120" cy="183" r="3" fill="var(--cacao)" stroke="none" />
        </g>
        <path d="M120 200c6 6 14 6 22 0" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />
      </g>
    </svg>
  );
}
