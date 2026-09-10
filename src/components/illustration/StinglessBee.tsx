/**
 * Abeja melipona / Xunán Kab — Melipona beecheii.
 * Referencia real: abeja pequeña y rechoncha, sin aguijón, cabeza y tórax
 * oscuros, abdomen con bandas claras, alas cortas. Se cría en troncos huecos
 * ("jobones"). Aquí, dibujada grande, junto a la entrada de cera de su nido.
 * Micro-interacción: al hover parpadea (data-eye).
 */
export function StinglessBee({ className }: { className?: string }) {
  const BODY = "#c98a3c";
  const DARK = "#3a2a1c";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una abeja sin aguijón junto a su nido de tronco"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* tronco hueco (jobón) al fondo */}
        <path d="M232 60c26 0 40 16 40 50v150c0 20-14 34-40 34s-40-14-40-34V110c0-34 14-50 40-50Z" fill="#a98b62" />
        <ellipse cx="232" cy="176" rx="20" ry="24" fill="#5c4630" />
        {/* embudo de cera de la piquera */}
        <path d="M214 176c-14-4-24 2-24 14 0 10 12 16 24 12Z" fill="var(--sun)" />

        {/* alas */}
        <g fill="#eef3f6" opacity="0.9">
          <ellipse cx="120" cy="120" rx="46" ry="24" transform="rotate(-18 120 120)" />
          <ellipse cx="150" cy="112" rx="40" ry="20" transform="rotate(-6 150 112)" />
        </g>

        {/* abdomen con bandas */}
        <path
          d="M150 150c48 0 78 30 78 66 0 34-30 58-78 58s-78-24-78-58c0-36 30-66 78-66Z"
          fill={BODY}
        />
        <g fill={DARK} stroke="none">
          <path d="M92 200c34 14 82 14 116 0 2 8 2 14 0 20-34 12-82 12-116 0-2-6-2-12 0-20Z" />
          <path d="M100 238c30 12 70 12 100 0 0 8-2 14-6 18-28 10-60 10-88 0-4-4-6-10-6-18Z" />
        </g>

        {/* tórax peludo */}
        <circle cx="150" cy="132" r="30" fill="#8a6a3f" />
        <g stroke="#6b5030" strokeWidth="3" fill="none">
          <path d="M126 124c8 4 40 4 48 0M126 140c8 4 40 4 48 0" />
        </g>

        {/* cabeza */}
        <circle cx="150" cy="86" r="26" fill={DARK} />
        {/* ojos grandes */}
        <g data-eye>
          <ellipse cx="138" cy="84" rx="9" ry="12" fill="#fff" />
          <circle cx="138" cy="85" r="4.6" fill="var(--cacao)" stroke="none" />
          <circle cx="136" cy="82" r="1.6" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <ellipse cx="162" cy="84" rx="9" ry="12" fill="#fff" />
          <circle cx="162" cy="85" r="4.6" fill="var(--cacao)" stroke="none" />
          <circle cx="160" cy="82" r="1.6" fill="#fff" stroke="none" />
        </g>
        {/* antenas */}
        <path d="M138 64c-8-10-10-22-4-32M162 64c8-10 10-22 4-32" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />
        <circle cx="132" cy="30" r="4" fill="var(--cacao)" stroke="none" />
        <circle cx="168" cy="30" r="4" fill="var(--cacao)" stroke="none" />
        {/* sonrisita */}
        <path d="M142 98c5 5 11 5 16 0" fill="none" stroke="#fff" strokeWidth="3.5" />
      </g>
    </svg>
  );
}
