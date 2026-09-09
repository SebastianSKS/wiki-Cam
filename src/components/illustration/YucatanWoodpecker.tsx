/**
 * Carpintero yucateco — Melanerpes pygmaeus.
 * Referencia real: carpintero muy pequeño trepado a un tronco; dorso barrado
 * blanco y negro, cara y vientre color ante, corona/nuca ROJA (aquí se pinta
 * la del macho, completa). Colores muy marcados → ilustración sencilla.
 */
export function YucatanWoodpecker({ className }: { className?: string }) {
  const BUFF = "#ecdcb9";
  const BARRED = "#2c2723";
  const RED = "#e23b2e";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un carpintero yucateco de gorra roja trepado a un tronco"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* tronco */}
        <path d="M196 20c-14 0-18 12-18 40 0 90 6 180 6 250h84c0-70-6-160-6-250 0-28-4-40-18-40Z" fill="#b8a781" />
        {/* hueco de nido y marcas de pico */}
        <ellipse cx="236" cy="120" rx="15" ry="18" fill="#5c4a2c" />
        <g stroke="var(--cacao)" strokeWidth="4" fill="none" opacity="0.6">
          <path d="M212 180l8 4M214 196l9 3M210 210l8 5" />
        </g>

        {/* cola rígida apoyada en el tronco */}
        <g data-tail>
          <path d="M150 214c-6 22-4 44 8 60 12-14 14-36 8-58Z" fill={BARRED} />
        </g>

        {/* dorso barrado */}
        <path
          d="M110 100c46 0 74 30 74 74 0 34-18 56-52 60-30 4-56-10-66-38-12-34-2-78 20-96 6-4 14-4 24 0Z"
          fill={BARRED}
        />
        <g stroke="#fff" strokeWidth="6" fill="none">
          <path d="M108 118c22-2 40 6 50 22" />
          <path d="M100 144c24-2 44 8 54 26" />
          <path d="M100 172c22 0 42 10 50 26" />
        </g>

        {/* vientre / cara ante */}
        <path
          d="M96 122c-24 0-38 20-38 46 0 30 18 48 44 48 20 0 34-14 34-38 0-34-16-56-40-56Z"
          fill={BUFF}
        />
        {/* pata garra sobre el tronco */}
        <path d="M132 210l16 6M132 222l16 2M132 234l14-4" stroke="var(--cacao)" strokeWidth="5" fill="none" />

        {/* cabeza ante con gorra roja */}
        <circle cx="92" cy="96" r="40" fill={BUFF} />
        <path d="M62 78c6-24 26-38 48-32 16 4 22 22 16 40-20-10-46-12-64-8Z" fill={RED} />

        {/* pico fuerte hacia el tronco */}
        <path d="M126 98l40-6-40 18Z" fill="var(--cacao)" stroke="none" />
        <path d="M126 92l40 0" stroke="var(--cacao)" strokeWidth="5" />

        {/* ojo */}
        <g data-eye>
          <circle cx="86" cy="92" r="9" fill="#fff" />
          <circle cx="88" cy="93" r="4.5" fill="var(--cacao)" stroke="none" />
          <circle cx="85" cy="89" r="1.8" fill="#fff" stroke="none" />
        </g>

        {/* pasto abajo */}
        <path d="M24 300c6-16 14-24 20-36M296 300c-6-16-14-24-20-36" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
      </g>
    </svg>
  );
}
