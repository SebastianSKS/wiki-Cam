/**
 * Manatí antillano — Trichechus manatus.
 * Referencia real: cuerpo gris fusiforme y rechoncho, cola en forma de remo
 * horizontal, dos aletas delanteras, hocico cuadrado con bigotes, ojos
 * pequeños. Herbívoro tranquilo. Aquí, amable y bonachón.
 */
export function AntilleanManatee({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un manatí bonachón nadando entre pastos marinos"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* pastos marinos */}
        <g fill="none" stroke="var(--jungle-deep)" strokeWidth="7">
          <path d="M40 300c-4-32 0-52 10-70" />
          <path d="M64 300c2-26 0-42-8-58" />
          <path d="M280 300c4-32 0-52-10-70" />
          <path d="M256 300c-2-26 0-42 8-58" />
        </g>
        {/* burbujas */}
        <g fill="none" stroke="var(--sky)" strokeWidth="4">
          <circle cx="250" cy="70" r="9" />
          <circle cx="268" cy="48" r="6" />
        </g>

        {/* cola-remo */}
        <g data-tail>
          <path
            d="M250 168c34-6 56 6 56 26 0 22-24 34-58 26 8-16 8-36 2-52Z"
            fill="#a6a29a"
          />
          <path d="M262 180c10 0 16 8 16 20" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        </g>

        {/* cuerpo fusiforme */}
        <path
          d="M96 232c-40 0-58-30-58-70 0-46 44-78 116-78 58 0 100 24 100 68 0 50-36 80-104 80-18 0-36 0-54 0Z"
          fill="#a6a29a"
        />
        {/* panza clara */}
        <path d="M104 230c44 10 110 8 132-8-6 18-30 30-70 30s-58-10-62-22Z" fill="var(--sky)" />
        {/* pliegues */}
        <path d="M150 108c-4 12-4 22 0 34M186 112c-4 12-4 22 0 34" fill="none" stroke="var(--cacao)" strokeWidth="3.5" />

        {/* aletas delanteras */}
        <path d="M112 214c-10 14-10 28 0 40 14-2 22-14 20-30Z" fill="#8f8b83" />
        <path d="M156 226c-8 14-6 28 4 38 12-4 18-16 14-32Z" fill="#8f8b83" />
        {/* uñas de la aleta */}
        <path d="M112 250l4 4M120 252l3 5M128 250l2 5" stroke="var(--cacao)" strokeWidth="3" fill="none" />

        {/* cabeza / hocico cuadrado */}
        <path
          d="M60 156c-16 0-24-14-22-34 2-18 16-30 40-30 22 0 36 14 36 34 0 22-16 34-40 34-4 0-10 0-14-4Z"
          fill="#a6a29a"
        />
        <path d="M40 150c-2 12 2 22 12 26 6-8 6-20-2-30Z" fill="#8f8b83" />

        {/* ojo */}
        <g data-eye>
          <circle cx="78" cy="110" r="8.5" fill="#fff" />
          <circle cx="77" cy="111" r="4.5" fill="var(--cacao)" stroke="none" />
          <circle cx="74" cy="107" r="1.8" fill="#fff" stroke="none" />
        </g>
        <path d="M64 96c8-5 18-4 24 2" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />

        {/* hocico y bigotes */}
        <path d="M34 132c-8 4-10 14-4 22 8 4 18 2 22-6Z" fill="#8f8b83" />
        <path d="M40 138q10 6 18 2" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        <g stroke="var(--ink-soft)" strokeWidth="3">
          <path d="M34 128l-10-3M34 136l-11 0M36 144l-9 4" />
        </g>
      </g>
    </svg>
  );
}
