/**
 * Pavo ocelado — Meleagris ocellata.
 * Referencia real: cuerpo bronce-verde iridiscente, cola en abanico con ocelos
 * (círculos azules de borde bronce), cabeza azul sin plumas con carúnculas
 * anaranjadas, sin barba. Estilo: blobs, contorno grueso, cara amable.
 */
export function OcellatedTurkey({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un pavo ocelado con la cola en abanico"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* pasto */}
        <path
          d="M30 300c6-16 14-22 20-34M300 300c-6-16-14-22-20-34M150 306c0-14 4-22 10-32"
          fill="none"
          stroke="var(--jungle-deep)"
          strokeWidth="7"
        />

        {/* abanico de cola con ocelos */}
        <g data-tail>
          {[-52, -26, 0, 26, 52].map((a, i) => (
            <g key={i} transform={`rotate(${a} 176 214)`}>
              <path
                d="M176 214c-13 0-22-40-22-86 0-16 44-16 44 0 0 46-9 86-22 86Z"
                fill={i % 2 ? "var(--jungle-deep)" : "var(--jungle)"}
              />
              <circle cx="176" cy="150" r="10" fill="var(--coral)" />
              <circle cx="176" cy="150" r="4.5" fill="var(--sky)" stroke="none" />
            </g>
          ))}
        </g>

        {/* cuerpo */}
        <path
          d="M150 292c-46 0-74-30-74-72 0-40 30-66 78-66 44 0 72 24 72 64 0 44-28 74-76 74Z"
          fill="var(--jungle)"
        />
        {/* pecho claro */}
        <path d="M132 288c-18-8-28-26-24-48 18-4 34 6 40 24Z" fill="var(--sky)" />
        {/* ala plegada con barra */}
        <path
          d="M206 176c22 6 30 26 22 48-20 4-38-6-44-26Z"
          fill="var(--jungle-deep)"
        />
        <path d="M198 200c14 2 22 10 24 22" fill="none" stroke="var(--sun)" strokeWidth="5" />

        {/* patas */}
        <path d="M132 288v20M132 308h-12M132 308h12" stroke="var(--sun)" strokeWidth="6" fill="none" />
        <path d="M170 290v20M170 310h-12M170 310h12" stroke="var(--sun)" strokeWidth="6" fill="none" />

        {/* cuello y cabeza azul */}
        <path d="M118 170c-14-22-14-44 4-60 16-14 40-10 50 8" fill="none" stroke="var(--sky)" strokeWidth="20" />
        <circle cx="112" cy="104" r="26" fill="var(--sky)" />
        {/* carúnculas */}
        <g fill="var(--coral)" stroke="var(--cacao)" strokeWidth="4">
          <circle cx="104" cy="82" r="6" />
          <circle cx="118" cy="80" r="5" />
          <circle cx="128" cy="92" r="6" />
          <circle cx="96" cy="118" r="6" />
        </g>
        {/* pico */}
        <path d="M88 106 74 100l14 12Z" fill="var(--sun)" />
        {/* ojo */}
        <g data-eye>
          <circle cx="110" cy="102" r="8.5" fill="#fff" />
          <circle cx="108" cy="103" r="4.5" fill="var(--cacao)" stroke="none" />
          <circle cx="106" cy="100" r="1.8" fill="#fff" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
