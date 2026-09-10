/**
 * Caoba de hoja grande — Swietenia macrophylla.
 * Referencia real: árbol muy alto de tronco recto y limpio, corteza pardo
 * rojiza escamosa, copa amplia y redondeada; frutos leñosos en cápsula
 * erguida ("coquito") que al abrirse suelta semillas aladas. Aquí, amable:
 * una carita en el tronco, como la ceiba.
 * Micro-interacción: al hover parpadea (data-eye).
 */
export function Mahogany({ className }: { className?: string }) {
  const CROWN = "#4f9e5f";
  const CROWN_DEEP = "#357a49";
  const BARK = "#9a5b3f";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una caoba con carita en el tronco"
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

        {/* copa redondeada y ancha */}
        <path
          d="M160 22c56 0 96 26 96 60 0 20-16 36-40 44 20 8 30 22 30 40 0 30-38 50-86 50s-86-20-86-50c0-18 10-32 30-40-24-8-40-24-40-44 0-34 40-60 96-60Z"
          fill={CROWN}
        />
        {/* sombras de la copa */}
        <path d="M92 92c-16 8-24 22-22 38 18 4 34-8 40-30Z" fill={CROWN_DEEP} />
        <path d="M228 92c16 8 24 22 22 38-18 4-34-8-40-30Z" fill={CROWN_DEEP} />
        <circle cx="160" cy="48" r="20" fill={CROWN_DEEP} />

        {/* rama con cápsula leñosa erguida ("coquito") */}
        <g data-tail>
          <path d="M206 150c20 6 30 20 30 42" fill="none" stroke={CROWN_DEEP} strokeWidth="6" />
          <path d="M236 176c12 0 20 12 20 34 0 14-8 22-20 22s-20-8-20-22c0-22 8-34 20-34Z" fill={BARK} />
          <path d="M236 180v52M226 196h20M226 214h20" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        </g>

        {/* tronco recto y limpio */}
        <path
          d="M138 130c-6 0-8 8-8 26 0 46-8 92-24 128h108c-16-36-24-82-24-128 0-18-2-26-8-26Z"
          fill={BARK}
        />
        {/* corteza escamosa */}
        <g fill="none" stroke="#733f28" strokeWidth="4">
          <path d="M134 176c14 6 40 6 52 0M132 214c14 6 44 6 56 0M136 252c12 6 36 6 48 0" />
        </g>

        {/* carita en el tronco */}
        <g data-eye>
          <circle cx="146" cy="176" r="6.5" fill="#fff" />
          <circle cx="146" cy="177" r="3.2" fill="var(--cacao)" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="176" cy="176" r="6.5" fill="#fff" />
          <circle cx="176" cy="177" r="3.2" fill="var(--cacao)" stroke="none" />
        </g>
        <path d="M150 196c6 6 14 6 22 0" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />
      </g>
    </svg>
  );
}
