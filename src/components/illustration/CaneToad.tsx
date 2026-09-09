/**
 * Sapo gigante — Rhinella marina.
 * Referencia real: cuerpo robusto y ancho, piel seca y verrugosa café-oliva,
 * dos glándulas parotoides GRANDES y triangulares detrás de los ojos, boca
 * ancha, patas cortas y separadas. Sentado, cara tranquila.
 */
export function CaneToad({ className }: { className?: string }) {
  const SKIN = "#8a7c4e";
  const DEEP = "#6b5f38";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un sapo gigante con sus glándulas detrás de la cabeza"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* charco */}
        <ellipse cx="160" cy="290" rx="140" ry="20" fill="var(--sky)" />

        {/* patas traseras plegadas */}
        <path d="M62 252c-14 8-18 24-8 36 18 6 34-4 36-24Z" fill={SKIN} />
        <path d="M258 252c14 8 18 24 8 36-18 6-34-4-36-24Z" fill={SKIN} />

        {/* cuerpo ancho */}
        <path
          d="M160 274c-72 0-108-30-108-78 0-46 40-74 108-74s108 28 108 74c0 48-36 78-108 78Z"
          fill={SKIN}
        />
        {/* panza clara */}
        <path d="M160 274c-46 0-74-16-84-40 24 8 132 8 168 0-10 24-38 40-84 40Z" fill="var(--paper)" />

        {/* patitas delanteras */}
        <path d="M118 262v18M118 280l-8 6M118 280h8M118 280l8 8M202 262v18M202 280l-8 6M202 280h8M202 280l8 8" fill="none" strokeWidth="6" />

        {/* glándulas parotoides triangulares */}
        <path d="M96 128c-22 0-34-16-30-40 20-4 40 6 46 30Z" fill={DEEP} />
        <path d="M224 128c22 0 34-16 30-40-20-4-40 6-46 30Z" fill={DEEP} />

        {/* verrugas */}
        <g fill={DEEP} stroke="none">
          <circle cx="120" cy="180" r="6" />
          <circle cx="160" cy="196" r="7" />
          <circle cx="200" cy="182" r="6" />
          <circle cx="140" cy="150" r="5" />
          <circle cx="182" cy="150" r="5" />
          <circle cx="160" cy="130" r="5" />
        </g>

        {/* boca ancha, sonrisa tranquila */}
        <path d="M96 158q64 34 128 0" fill="none" strokeWidth="5" />

        {/* narinas */}
        <circle cx="150" cy="118" r="3" fill="var(--cacao)" stroke="none" />
        <circle cx="170" cy="118" r="3" fill="var(--cacao)" stroke="none" />

        {/* ojos saltones */}
        <g data-eye>
          <circle cx="118" cy="104" r="20" fill={SKIN} />
          <circle cx="118" cy="104" r="13" fill="#d9b24a" />
          <path d="M108 104h20" stroke="var(--cacao)" strokeWidth="5" />
          <circle cx="113" cy="98" r="3" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="202" cy="104" r="20" fill={SKIN} />
          <circle cx="202" cy="104" r="13" fill="#d9b24a" />
          <path d="M192 104h20" stroke="var(--cacao)" strokeWidth="5" />
          <circle cx="197" cy="98" r="3" fill="#fff" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
