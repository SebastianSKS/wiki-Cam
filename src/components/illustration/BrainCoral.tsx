/**
 * Coral cerebro de roca — Colpophyllia natans.
 * Referencia real: colonia en forma de domo con valles y crestas sinuosas
 * que parecen un cerebro. Es un animal (colonia de pólipos); aquí se le da
 * una carita discreta escondida en los surcos.
 */
export function BrainCoral({ className }: { className?: string }) {
  const DOME = "#e0946b";
  const GROOVE = "#b8532f";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un coral cerebro con surcos como laberinto"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* fondo de arrecife */}
        <path d="M-10 260c40 0 40 14 80 14s40-14 80-14 40 14 80 14 40-14 80-14v66H-10Z" fill="var(--sky)" />
        <g fill="none" stroke="var(--jungle-deep)" strokeWidth="7">
          <path d="M40 262c-2-26 2-40 12-54" />
          <path d="M282 260c2-24-2-38-12-50" />
        </g>
        {/* pececito */}
        <path d="M256 96l16-10v20Z" fill="var(--sun)" stroke="none" />
        <ellipse cx="244" cy="96" rx="14" ry="9" fill="var(--sun)" />

        {/* domo */}
        <path
          d="M160 66c78 0 118 46 118 104 0 40-52 58-118 58S42 210 42 170C42 112 82 66 160 66Z"
          fill={DOME}
        />

        {/* surcos sinuosos tipo cerebro */}
        <g fill="none" stroke={GROOVE} strokeWidth="9" strokeLinecap="round">
          <path d="M66 150c18-6 22 14 40 8s18-22 38-16 16 24 36 18 18-20 36-12" />
          <path d="M60 184c20-8 24 12 44 6s18-20 40-14 16 22 38 16 18-18 38-10" />
          <path d="M74 118c16-4 20 12 36 8s16-16 32-12 14 18 30 14" />
          <path d="M84 214c18-6 22 10 42 6s18-16 40-12" />
        </g>
        <g fill="none" stroke="var(--cacao)" strokeWidth="3" opacity="0.5">
          <path d="M66 150c18-6 22 14 40 8s18-22 38-16 16 24 36 18 18-20 36-12" />
          <path d="M60 184c20-8 24 12 44 6s18-20 40-14 16 22 38 16 18-18 38-10" />
        </g>

        {/* pólipos */}
        <g fill="var(--sun)" stroke="none">
          <circle cx="110" cy="164" r="4" />
          <circle cx="170" cy="150" r="4" />
          <circle cx="210" cy="188" r="4" />
        </g>

        {/* carita discreta en los surcos */}
        <g data-eye>
          <circle cx="138" cy="150" r="6.5" fill="#fff" />
          <circle cx="138" cy="151" r="3.2" fill="var(--cacao)" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="184" cy="150" r="6.5" fill="#fff" />
          <circle cx="184" cy="151" r="3.2" fill="var(--cacao)" stroke="none" />
        </g>
        <path d="M150 170q12 10 24 0" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />
      </g>
    </svg>
  );
}
