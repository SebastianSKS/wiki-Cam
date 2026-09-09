/**
 * Ocelote — Leopardus pardalis.
 * Referencia real: felino manchado mediano, fondo amarillento-gris, rosetas
 * ABIERTAS y cadenas de manchas alargadas (distintas en cada individuo),
 * vientre blanco con manchas negras, ojos grandes. Como un jaguar en pequeño.
 */
export function Ocelot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un ocelote con cadenas de manchas"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* cola con anillos */}
        <g data-tail>
          <path d="M236 244c44 6 60-24 46-52-10-20-40-16-40-46" fill="none" stroke="var(--sun)" strokeWidth="20" />
          <g stroke="var(--cacao)" strokeWidth="6" fill="none">
            <path d="M248 158l10-1M262 186l10 0M256 214l8 4" />
          </g>
        </g>

        {/* hombros */}
        <path d="M160 322c-70 0-104-38-104-86 0-40 34-62 104-62s104 22 104 62c0 48-34 86-104 86Z" fill="var(--sun)" />
        <ellipse cx="160" cy="290" rx="48" ry="40" fill="var(--paper)" />
        {/* manchas del vientre */}
        <g fill="var(--cacao)" stroke="none">
          <circle cx="140" cy="286" r="4" />
          <circle cx="180" cy="290" r="4" />
          <circle cx="160" cy="300" r="3.4" />
        </g>

        {/* orejas con reverso oscuro */}
        <path d="M98 82C80 54 52 50 46 74c-4 22 12 42 38 46Z" fill="var(--sun)" />
        <path d="M222 82c18-28 46-32 52-8 4 22-12 42-38 46Z" fill="var(--sun)" />
        <path d="M72 62c-8-6-16-4-18 6M248 62c8-6 16-4 18 6" fill="var(--cacao)" stroke="none" />

        {/* cabeza */}
        <path d="M160 44c58 0 96 38 96 92 0 58-44 92-96 92S64 194 64 136c0-54 38-92 96-92Z" fill="var(--sun)" />

        {/* cadenas de manchas / rosetas abiertas */}
        <g stroke="var(--cacao)" strokeWidth="5" fill="none">
          <path d="M96 96c8 10 8 22 0 32M156 78c10 8 10 20 0 28M216 96c-8 10-8 22 0 32" />
          <path d="M84 150a12 12 0 1 0 .1 0M236 150a12 12 0 1 0 .1 0" />
          <path d="M112 118c8 6 8 16 0 22M208 118c-8 6-8 16 0 22" />
        </g>
        <path d="M118 90c-6 12-6 24 0 34M202 90c6 12 6 24 0 34" fill="none" stroke="var(--cacao)" strokeWidth="6" />

        {/* cachetes y hocico */}
        <circle cx="134" cy="192" r="24" fill="var(--paper)" />
        <circle cx="186" cy="192" r="24" fill="var(--paper)" />
        <path d="M160 150c24 0 36 12 36 28 0 18-16 32-36 32s-36-14-36-32c0-16 12-28 36-28Z" fill="var(--paper)" />
        <path d="M160 158c8 0 13 4 13 10 0 7-6 12-13 12s-13-5-13-12c0-6 5-10 13-10Z" fill="var(--coral)" />
        <path d="M160 180v10M160 190c-6 7-13 7-18 2M160 190c6 7 13 7 18 2" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />

        {/* ojos grandes */}
        <g data-eye>
          <ellipse cx="128" cy="128" rx="22" ry="24" fill="#fff" />
          <circle cx="129" cy="130" r="12" fill="#6f9b5a" stroke="var(--cacao)" strokeWidth="3.5" />
          <circle cx="129" cy="130" r="6" fill="var(--cacao)" stroke="none" />
          <circle cx="124" cy="125" r="3" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <ellipse cx="192" cy="128" rx="22" ry="24" fill="#fff" />
          <circle cx="191" cy="130" r="12" fill="#6f9b5a" stroke="var(--cacao)" strokeWidth="3.5" />
          <circle cx="191" cy="130" r="6" fill="var(--cacao)" stroke="none" />
          <circle cx="186" cy="125" r="3" fill="#fff" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
