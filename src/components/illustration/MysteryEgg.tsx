/**
 * Marcador para especies cuya ilustración aún no está lista: un huevo/capullo
 * en un nido, con brillos. Un misterio por descubrir, no una imagen rota.
 */
export function MysteryEgg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Un huevo misterioso: ilustración próximamente"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* nido */}
        <path
          d="M60 236c-16 40 44 60 100 60s116-20 100-60c-30 10-170 10-200 0Z"
          fill="var(--rust)"
        />
        <g stroke="var(--cacao)" strokeWidth="4" fill="none">
          <path d="M74 250c40 12 132 12 172 0" />
          <path d="M84 268c34 10 118 10 152 0" />
        </g>

        {/* huevo */}
        <path
          d="M160 44c50 0 84 62 84 118 0 58-38 92-84 92s-84-34-84-92c0-56 34-118 84-118Z"
          fill="var(--lavender)"
        />
        {/* grieta */}
        <path
          d="M118 150l16-12 12 16 16-14 12 16 14-12"
          fill="none"
          stroke="var(--cacao)"
          strokeWidth="5"
        />
        {/* motas */}
        <g fill="var(--paper)" stroke="none">
          <circle cx="132" cy="96" r="7" />
          <circle cx="188" cy="112" r="9" />
          <circle cx="150" cy="196" r="8" />
          <circle cx="196" cy="188" r="6" />
          <circle cx="118" cy="170" r="5" />
        </g>

        {/* brillos */}
        <g stroke="none" fill="var(--sun)">
          <path d="M256 92l6 16 16 6-16 6-6 16-6-16-16-6 16-6Z" />
          <path d="M64 120l4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" />
        </g>
      </g>

      <text
        x="160"
        y="168"
        textAnchor="middle"
        fontFamily="var(--font-hand)"
        fontWeight="700"
        fontSize="42"
        fill="var(--cacao)"
      >
        pronto…
      </text>
    </svg>
  );
}
