/**
 * Puma — Puma concolor.
 * Referencia real: felino grande SIN manchas de adulto, pardo grisáceo a
 * pardo rojizo uniforme, hocico y pecho cremas, cola larga con punta negra,
 * orejas redondas pequeñas. Cara amable pero felina.
 */
export function Puma({ className }: { className?: string }) {
  const COAT = "#c8a877";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un puma de pelaje liso color arena"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* cola larga con punta oscura */}
        <g data-tail>
          <path
            d="M232 246c48 8 66-26 50-58-12-24-46-20-46-56"
            fill="none"
            stroke={COAT}
            strokeWidth="22"
          />
          <path d="M232 246c48 8 66-26 50-58" fill="none" stroke={COAT} strokeWidth="22" />
          <circle cx="272" cy="140" r="12" fill="var(--cacao)" stroke="none" />
        </g>

        {/* hombros */}
        <path
          d="M160 322c-72 0-108-38-108-88 0-40 38-62 108-62s108 22 108 62c0 50-36 88-108 88Z"
          fill={COAT}
        />
        <ellipse cx="160" cy="288" rx="48" ry="40" fill="var(--paper)" />

        {/* orejas */}
        <path d="M98 84C78 54 48 50 44 74c-4 24 14 44 40 48Z" fill={COAT} />
        <path d="M222 84c20-30 50-34 54-10 4 24-14 44-40 48Z" fill={COAT} />
        <path d="M84 78c-12-12-22-12-26-2" fill="none" stroke="var(--cacao)" strokeWidth="5" />
        <path d="M236 78c12-12 22-12 26-2" fill="none" stroke="var(--cacao)" strokeWidth="5" />

        {/* cabeza */}
        <path
          d="M160 40c62 0 102 40 102 96 0 60-46 96-102 96S58 196 58 136c0-56 40-96 102-96Z"
          fill={COAT}
        />
        {/* marcas oscuras del hocico (líneas del puma) */}
        <path d="M126 176c-6 14-6 26 2 36M194 176c6 14 6 26-2 36" fill="none" stroke="var(--cacao)" strokeWidth="5" />

        {/* cachetes / hocico crema */}
        <circle cx="132" cy="196" r="26" fill="var(--paper)" />
        <circle cx="188" cy="196" r="26" fill="var(--paper)" />
        <path
          d="M160 150c26 0 40 12 40 30 0 20-18 34-40 34s-40-14-40-34c0-18 14-30 40-30Z"
          fill="var(--paper)"
        />
        <path d="M160 158c9 0 14 5 14 11 0 7-7 12-14 12s-14-5-14-12c0-6 5-11 14-11Z" fill="var(--coral)" />
        <path d="M160 181v10M160 191c-6 8-14 8-20 2M160 191c6 8 14 8 20 2" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />

        {/* ojos ámbar */}
        <g data-eye>
          <ellipse cx="127" cy="130" rx="19" ry="21" fill="#fff" />
          <circle cx="128" cy="132" r="10" fill="#c9a23a" stroke="var(--cacao)" strokeWidth="3.5" />
          <circle cx="128" cy="132" r="5" fill="var(--cacao)" stroke="none" />
          <circle cx="124" cy="128" r="2.4" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <ellipse cx="193" cy="130" rx="19" ry="21" fill="#fff" />
          <circle cx="192" cy="132" r="10" fill="#c9a23a" stroke="var(--cacao)" strokeWidth="3.5" />
          <circle cx="192" cy="132" r="5" fill="var(--cacao)" stroke="none" />
          <circle cx="188" cy="128" r="2.4" fill="#fff" stroke="none" />
        </g>
        <path d="M104 106c12-8 26-7 34 2M182 108c8-9 22-10 34-2" fill="none" stroke="var(--cacao)" strokeWidth="5" />

        <g stroke="var(--ink-soft)" strokeWidth="3.5">
          <path d="M108 188c-20-2-34 0-46 6M110 200c-18 2-30 8-40 16M212 188c20-2 34 0 46 6M210 200c18 2 30 8 40 16" />
        </g>
      </g>
    </svg>
  );
}
