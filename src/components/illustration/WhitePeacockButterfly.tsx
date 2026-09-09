/**
 * Mariposa pavo real blanca — Anartia jatrophae.
 * Referencia real: alas blanco perlado con líneas y manchas café claro,
 * bordes ondulados y DOS ocelos grandes tipo ojo en las alas traseras
 * (anillo naranja, centro oscuro). Vista de frente con las alas abiertas.
 */
export function WhitePeacockButterfly({ className }: { className?: string }) {
  const WING = "#f3eee0";
  const LINE = "#9a7a58";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una mariposa pavo real blanca con ojos falsos en las alas"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* ramita */}
        <path d="M40 292c60-12 180-12 240 0" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />

        {/* alas delanteras */}
        <path
          d="M160 150C120 84 40 66 34 116c-4 34 20 66 60 74 30 6 56-14 66-40Z"
          fill={WING}
        />
        <path
          d="M160 150c40-66 120-84 126-34 4 34-20 66-60 74-30 6-56-14-66-40Z"
          fill={WING}
        />
        {/* alas traseras con ocelos */}
        <g data-tail>
          <path
            d="M160 160c-30 8-66 34-64 84 2 34 34 46 66 34 22-8 30-30 26-60-4-24-16-48-28-58Z"
            fill={WING}
          />
          <path
            d="M160 160c30 8 66 34 64 84-2 34-34 46-66 34-22-8-30-30-26-60 4-24 16-48 28-58Z"
            fill={WING}
          />
        </g>

        {/* líneas onduladas de las alas */}
        <g fill="none" stroke={LINE} strokeWidth="4">
          <path d="M60 108c20 4 40 16 54 34M70 150c18 2 36 12 48 26" />
          <path d="M260 108c-20 4-40 16-54 34M250 150c-18 2-36 12-48 26" />
          <path d="M116 210c14 0 28 8 36 22M204 210c-14 0-28 8-36 22" />
        </g>

        {/* OCELOS tipo ojo */}
        <circle cx="120" cy="228" r="15" fill="var(--coral)" />
        <circle cx="120" cy="228" r="7" fill="var(--cacao)" stroke="none" />
        <circle cx="117" cy="224" r="2.4" fill="#fff" stroke="none" />
        <circle cx="200" cy="228" r="15" fill="var(--coral)" />
        <circle cx="200" cy="228" r="7" fill="var(--cacao)" stroke="none" />
        <circle cx="197" cy="224" r="2.4" fill="#fff" stroke="none" />
        {/* un ocelo pequeño en cada ala delantera */}
        <circle cx="86" cy="120" r="7" fill="var(--coral)" />
        <circle cx="86" cy="120" r="3" fill="var(--cacao)" stroke="none" />
        <circle cx="234" cy="120" r="7" fill="var(--coral)" />
        <circle cx="234" cy="120" r="3" fill="var(--cacao)" stroke="none" />

        {/* cuerpo */}
        <path d="M160 116c9 0 14 8 14 26 0 30-6 66-14 84-8-18-14-54-14-84 0-18 5-26 14-26Z" fill="#3a322b" />
        {/* antenas */}
        <path d="M154 118c-6-14-16-22-28-24M166 118c6-14 16-22 28-24" fill="none" strokeWidth="5" />
        <circle cx="124" cy="92" r="4" fill="var(--cacao)" stroke="none" />
        <circle cx="196" cy="92" r="4" fill="var(--cacao)" stroke="none" />
        {/* ojitos */}
        <g data-eye>
          <circle cx="153" cy="122" r="3.4" fill="#fff" stroke="none" />
          <circle cx="167" cy="122" r="3.4" fill="#fff" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
