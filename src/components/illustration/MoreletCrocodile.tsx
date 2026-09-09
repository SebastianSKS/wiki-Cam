/**
 * Cocodrilo de pantano — Crocodylus moreletii.
 * Referencia real: cocodrilo mediano de agua dulce, hocico ANCHO, dorso
 * gris-verde con escudos en hilera, vientre claro. Aquí, amable: ojos grandes
 * arriba de la cabeza y sonrisa suave, dientes pequeños.
 */
export function MoreletCrocodile({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un cocodrilo de pantano sonriente en el agua"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* agua */}
        <path
          d="M-10 236c40 0 40 16 80 16s40-16 80-16 40 16 80 16 40-16 80-16v90H-10Z"
          fill="var(--sky)"
        />
        {/* juncos y nenúfar */}
        <path d="M292 250c0-30 4-46 14-60M300 250c2-24-2-40-10-52" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
        <path d="M40 244c-16 0-24-10-16-22 16-4 30 4 30 22Z" fill="var(--jungle)" />

        {/* cola enroscada */}
        <g data-tail>
          <path
            d="M232 214c46 6 58-24 42-50-12-20-40-14-40-42"
            fill="none"
            stroke="var(--jungle)"
            strokeWidth="26"
          />
          <path d="M244 176l10-8 6 12M262 202l12-4 2 12" stroke="var(--jungle-deep)" strokeWidth="5" fill="none" />
        </g>

        {/* cuerpo largo y bajo */}
        <path
          d="M70 214c-24 0-40-16-40-40 0-30 40-46 110-46 62 0 100 16 100 44 0 26-22 42-70 42-34 0-66 0-100 0Z"
          fill="var(--jungle)"
        />
        {/* vientre claro */}
        <path d="M96 214c40 8 96 8 120-4-4 10-24 16-60 16s-56-4-60-12Z" fill="var(--sun)" />
        {/* escudos del dorso */}
        <g fill="var(--jungle-deep)">
          <path d="M96 132c6-12 18-12 24 0Z" />
          <path d="M132 126c6-12 18-12 24 0Z" />
          <path d="M168 128c6-12 18-12 24 0Z" />
          <path d="M204 134c6-12 18-12 24 0Z" />
        </g>
        {/* patas */}
        <path d="M92 210v20M92 230h-10M92 230h10M150 212v20M150 232h-10M150 232h10" fill="none" strokeWidth="6" />

        {/* cabeza con hocico ancho */}
        <path
          d="M26 190c-16 0-22-14-16-30 6-16 4-26 22-30 22-5 46 4 56 20 8 13 4 30-10 36-14 6-38 4-52 4Z"
          fill="var(--jungle)"
        />
        {/* sonrisa y dientecitos */}
        <path d="M24 176c22 8 52 8 74-2" fill="none" strokeWidth="5" />
        <g fill="#fff" stroke="none">
          <path d="M34 176l4 8 4-8ZM52 179l4 8 4-8ZM70 179l4 8 4-8Z" />
        </g>
        {/* fosas nasales en la punta */}
        <circle cx="24" cy="150" r="3" fill="var(--cacao)" stroke="none" />
        <circle cx="34" cy="148" r="3" fill="var(--cacao)" stroke="none" />
        {/* ojos saltones arriba */}
        <g data-eye>
          <circle cx="58" cy="128" r="15" fill="var(--jungle)" />
          <circle cx="58" cy="128" r="9" fill="#fff" />
          <circle cx="60" cy="130" r="4.5" fill="var(--cacao)" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="90" cy="126" r="15" fill="var(--jungle)" />
          <circle cx="90" cy="126" r="9" fill="#fff" />
          <circle cx="92" cy="128" r="4.5" fill="var(--cacao)" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
