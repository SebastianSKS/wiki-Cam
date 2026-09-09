/**
 * Rubia (pargo) — Ocyurus chrysurus.
 * Referencia real: cuerpo torpedo plateado, franja amarilla brillante del
 * hocico a la cola, aletas amarillo intenso, cola muy ahorquillada, ojo
 * grande. Nadando entre burbujas.
 */
export function YellowtailSnapper({ className }: { className?: string }) {
  const BODY = "#c9d3da";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una rubia, pez plateado con franja amarilla"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* burbujas */}
        <g fill="none" stroke="var(--sky)" strokeWidth="4">
          <circle cx="60" cy="70" r="10" />
          <circle cx="44" cy="44" r="6" />
          <circle cx="264" cy="240" r="9" />
        </g>

        {/* cola ahorquillada */}
        <g data-tail>
          <path d="M244 160l58-40v80Z" fill="var(--sun)" />
          <path d="M244 160l58-4-58 44" fill="var(--sun)" />
        </g>

        {/* aletas */}
        <path d="M120 100c30-6 70-6 100 6-18-26-52-34-100-6Z" fill="var(--sun)" />
        <path d="M120 220c30 6 70 6 100-6-18 26-52 34-100 6Z" fill="var(--sun)" />
        <path d="M150 214c-8 18-6 34 6 44 10-10 12-28 6-44Z" fill="var(--sun)" />

        {/* cuerpo torpedo */}
        <path
          d="M60 160c0-44 40-76 96-76s96 30 96 74-40 76-96 76-96-30-96-74Z"
          fill={BODY}
        />
        {/* franja amarilla nariz a cola */}
        <path d="M64 156c40-16 152-16 196 4-44 18-156 18-196-4Z" fill="var(--sun)" />

        {/* branquia */}
        <path d="M110 108c-14 16-14 40 0 56" fill="none" strokeWidth="5" />
        {/* boca */}
        <path d="M60 160q-10 6-10 16" fill="none" strokeWidth="5" />
        <path d="M52 168q10 8 22 4" fill="none" strokeWidth="5" />

        {/* ojo grande */}
        <g data-eye>
          <circle cx="94" cy="146" r="16" fill="#fff" />
          <circle cx="92" cy="147" r="8.5" fill="var(--cacao)" stroke="none" />
          <circle cx="88" cy="142" r="3" fill="#fff" stroke="none" />
        </g>

        {/* escamas */}
        <g fill="none" stroke="var(--ink-soft)" strokeWidth="3" opacity="0.6">
          <path d="M150 120q10 8 0 16M180 128q10 8 0 16M150 180q10 8 0 16" />
        </g>
      </g>
    </svg>
  );
}
