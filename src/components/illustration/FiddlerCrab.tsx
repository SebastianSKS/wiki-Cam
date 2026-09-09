/**
 * Cangrejo violinista — Uca sp.
 * Referencia real: cangrejo pequeño con UNA pinza enorme y de color (el macho)
 * y otra diminuta; caparazón rectangular; ojos sobre pedúnculos altos; tres
 * pares de patas. Aquí se dibuja el macho, con la pinza en alto.
 */
export function FiddlerCrab({ className }: { className?: string }) {
  const SHELL = "#7d5a3e";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un cangrejo violinista con una pinza gigante en alto"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* arena */}
        <ellipse cx="160" cy="286" rx="150" ry="22" fill="var(--sun)" />
        <g fill="var(--rust)" stroke="none" opacity="0.5">
          <circle cx="70" cy="288" r="4" />
          <circle cx="250" cy="290" r="5" />
          <circle cx="150" cy="298" r="3" />
        </g>

        {/* patas — 3 pares */}
        <g fill="none" strokeWidth="7">
          <path d="M96 214c-24 6-40 22-46 44M104 232c-20 12-30 30-30 50M118 246c-14 16-18 34-12 52" />
          <path d="M214 220c22 8 36 24 40 46M206 238c18 14 26 32 24 52M192 250c12 18 14 36 8 52" />
        </g>

        {/* pinza pequeña (derecha del dibujo) */}
        <path d="M214 190c22-2 34 8 34 24-14 6-28 2-36-10Z" fill={SHELL} />
        <path d="M232 200l10-2 2 10" fill="none" strokeWidth="4" />

        {/* caparazón */}
        <path
          d="M104 220c-32 0-50-18-50-46 0-30 44-44 106-44s106 14 106 44c0 28-18 46-50 46-38 0-74 0-112 0Z"
          fill={SHELL}
        />
        {/* textura del caparazón */}
        <path d="M100 168q60 22 120 0" fill="none" strokeWidth="4" opacity="0.7" />

        {/* boca */}
        <path d="M140 196q20 12 40 0" fill="none" strokeWidth="4" />

        {/* pedúnculos con ojos */}
        <path d="M126 132V92M194 132V92" fill="none" strokeWidth="8" />
        <g data-eye>
          <circle cx="126" cy="84" r="12" fill="#fff" />
          <circle cx="126" cy="84" r="6" fill="var(--cacao)" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="194" cy="84" r="12" fill="#fff" />
          <circle cx="194" cy="84" r="6" fill="var(--cacao)" stroke="none" />
        </g>

        {/* PINZA GIGANTE de color, en alto (izquierda del dibujo) */}
        <g data-tail>
          <path d="M96 196c-30-6-52-30-58-64" fill="none" stroke="var(--coral)" strokeWidth="18" />
          <path
            d="M38 132c-16-6-24-22-20-42 14 0 26 6 32 18 8-10 22-14 34-8-2 20-14 34-32 38-6 0-10-2-14-6Z"
            fill="var(--coral)"
          />
          <path d="M26 108q14 8 28 2" fill="none" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
}
