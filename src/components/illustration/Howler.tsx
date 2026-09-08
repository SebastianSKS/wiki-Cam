/**
 * Mono aullador negro / saraguato — Alouatta pigra.
 * Referencia real: pelaje negro (aquí café muy oscuro, no negro puro), cola
 * prensil larga y enroscada, cara desnuda más clara, barba, cuerpo compacto.
 * Micro-interacción: al hover la cola se mueve (data-tail).
 */
export function Howler({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un mono aullador cantando"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* rama */}
        <path d="M8 292c60-14 244-14 304 0" fill="none" stroke="var(--rust)" strokeWidth="14" />
        <path d="M112 288c8-10 16-10 22 0" fill="none" stroke="var(--rust)" strokeWidth="8" />

        {/* cola prensil */}
        <g data-tail>
          <path
            d="M96 250c-52 6-84-16-84-58 0-40 44-52 44-92"
            fill="none"
            stroke="#2c2016"
            strokeWidth="17"
          />
        </g>

        {/* cuerpo */}
        <path
          d="M160 300c-52 0-80-30-80-78 0-46 30-74 80-74s80 28 80 74c0 48-28 78-80 78Z"
          fill="#2c2016"
        />
        {/* manos sobre la rama */}
        <path d="M120 286c-4-16 6-26 20-24 12 2 14 16 8 26Z" fill="#2c2016" />
        <path d="M196 286c4-16-6-26-20-24-12 2-14 16-8 26Z" fill="#2c2016" />

        {/* cabeza */}
        <circle cx="160" cy="118" r="66" fill="#2c2016" />
        {/* barba / mechones */}
        <g fill="#2c2016" stroke="none">
          <path d="M120 160c-10 18-6 30 6 30 8 0 10-12 8-26Z" />
          <path d="M200 160c10 18 6 30-6 30-8 0-10-12-8-26Z" />
          <path d="M160 182c-8 20 0 30 8 30s12-12 4-30Z" />
        </g>
        {/* cara desnuda */}
        <path
          d="M160 78c30 0 44 20 44 46s-18 44-44 44-44-18-44-44 14-46 44-46Z"
          fill="#7b5a3f"
        />

        {/* ojos */}
        <g data-eye>
          <ellipse cx="141" cy="112" rx="14" ry="16" fill="#fff" />
          <circle cx="143" cy="114" r="7.5" fill="var(--cacao)" stroke="none" />
          <circle cx="139" cy="109" r="3" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <ellipse cx="179" cy="112" rx="14" ry="16" fill="#fff" />
          <circle cx="177" cy="114" r="7.5" fill="var(--cacao)" stroke="none" />
          <circle cx="173" cy="109" r="3" fill="#fff" stroke="none" />
        </g>

        {/* boca cantando */}
        <ellipse cx="160" cy="150" rx="13" ry="16" fill="var(--coral)" />

        {/* notas del aullido */}
        <g stroke="none" fill="var(--sky)">
          <circle cx="238" cy="96" r="8" />
          <circle cx="262" cy="72" r="6" />
        </g>
        <path d="M246 94V64M268 70V48" stroke="var(--sky)" strokeWidth="4" fill="none" />
      </g>
    </svg>
  );
}
