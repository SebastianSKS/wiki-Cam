/**
 * Flamenco americano — Phoenicopterus ruber.
 * Referencia real: plumaje rosa intenso, cuello largo en forma de S, pico
 * grueso curvado hacia abajo con la punta negra, patas larguísimas, a menudo
 * sobre una sola pata en aguas someras.
 * Micro-interacción: al hover parpadea (data-eye).
 */
export function Flamingo({ className }: { className?: string }) {
  const PINK = "#f38aa8";
  const PINK_DEEP = "#e05f86";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un flamenco rosa sobre una pata"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* agua somera */}
        <path
          d="M-10 268c40 0 40 12 80 12s40-12 80-12 40 12 80 12 40-12 80-12v62H-10Z"
          fill="var(--sky)"
        />
        <path d="M40 300h60M150 292h50M240 302h44" fill="none" stroke="#fff" strokeWidth="4" opacity="0.7" />

        {/* pata que se hunde en el agua */}
        <path d="M150 214v92" fill="none" stroke={PINK_DEEP} strokeWidth="9" />
        {/* pata recogida */}
        <path d="M168 214c10 16 8 34-6 44" fill="none" stroke={PINK_DEEP} strokeWidth="9" />

        {/* cuerpo redondo */}
        <path
          d="M150 224c-52 0-84-24-84-58 0-30 30-50 78-50 40 0 78 12 96 34 12 14 8 34-10 46-22 16-52 28-80 28Z"
          fill={PINK}
        />
        {/* ala plegada */}
        <path d="M150 150c30-4 56 4 74 22-6 20-30 30-58 28-18-2-26-16-16-50Z" fill={PINK_DEEP} />
        {/* plumas de la cola */}
        <path d="M64 168c-16 2-26 12-26 28 16 4 30-4 34-20Z" fill={PINK_DEEP} />

        {/* cuello largo en S */}
        <path
          d="M150 172c-6-30 14-44 34-44 22 0 30-20 22-40-6-16-24-22-38-14"
          fill="none"
          stroke={PINK}
          strokeWidth="22"
        />

        {/* cabeza */}
        <circle cx="150" cy="70" r="22" fill={PINK} />
        {/* pico curvo con punta negra */}
        <path d="M132 66c-18-2-30 6-34 20 12 10 28 8 38-4Z" fill="#f4c9d6" />
        <path d="M100 84c-8 2-12 8-10 16 8 4 16 0 18-8Z" fill="var(--cacao)" stroke="none" />

        {/* ojo */}
        <g data-eye>
          <circle cx="156" cy="64" r="7" fill="#fff" />
          <circle cx="156" cy="65" r="3.6" fill="var(--cacao)" stroke="none" />
          <circle cx="154" cy="62" r="1.4" fill="#fff" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
