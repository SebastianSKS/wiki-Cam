/**
 * Mono araña de Geoffroy — Ateles geoffroyi.
 * Referencia real: cuerpo esbelto café dorado, extremidades larguísimas,
 * manos y pies negros sin pulgar, cola prensil larguísima (una quinta mano),
 * cara clara con antifaz alrededor de los ojos. Colgado de una rama.
 * Micro-interacción: al hover la cola se mueve (data-tail).
 */
export function SpiderMonkey({ className }: { className?: string }) {
  const FUR = "#b07a44";
  const DARK = "#25201c";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un mono araña colgado de la cola"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* rama de la que cuelga */}
        <path d="M6 40c70 12 244 12 308 0" fill="none" stroke="var(--rust)" strokeWidth="14" />

        {/* cola prensil enroscada en la rama */}
        <g data-tail>
          <path
            d="M214 44c26-10 44 6 40 30-4 22-30 30-30 58 0 40 30 60 30 96"
            fill="none"
            stroke={FUR}
            strokeWidth="16"
          />
          <path d="M254 220c2 14-2 22-12 28" fill="none" stroke={DARK} strokeWidth="10" />
        </g>

        {/* brazo largo que se agarra a la rama */}
        <path d="M120 60c-16 30-16 66 8 96" fill="none" stroke={FUR} strokeWidth="20" />
        <path d="M118 52c-10-4-20 0-22 12 8 8 20 8 28 0Z" fill={DARK} />

        {/* cuerpo delgado */}
        <path
          d="M160 300c-40 0-62-26-62-70 0-42 26-68 62-68s62 26 62 68c0 44-22 70-62 70Z"
          fill={FUR}
        />
        {/* panza más clara */}
        <ellipse cx="160" cy="250" rx="30" ry="40" fill="#d9ad78" />

        {/* pierna larga colgando */}
        <path d="M186 288c22 18 30 44 22 70" fill="none" stroke={FUR} strokeWidth="18" />
        <path d="M206 352c-10 4-20 2-24-8 6-10 18-12 26-4Z" fill={DARK} />

        {/* cabeza pequeña */}
        <circle cx="160" cy="150" r="46" fill={FUR} />
        {/* cara clara */}
        <path
          d="M160 120c24 0 34 16 34 34s-14 34-34 34-34-14-34-34 10-34 34-34Z"
          fill="#e7c79b"
        />

        {/* ojos con antifaz */}
        <g data-eye>
          <ellipse cx="146" cy="150" rx="12" ry="14" fill="#fff" />
          <circle cx="146" cy="151" r="6.5" fill="var(--cacao)" stroke="none" />
          <circle cx="143" cy="147" r="2.4" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <ellipse cx="176" cy="150" rx="12" ry="14" fill="#fff" />
          <circle cx="176" cy="151" r="6.5" fill="var(--cacao)" stroke="none" />
          <circle cx="173" cy="147" r="2.4" fill="#fff" stroke="none" />
        </g>
        <path d="M132 134c8-8 18-8 24-2M164 132c6-6 16-6 24 2" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        {/* naricita y boca */}
        <path d="M160 168c5 0 8 3 8 7s-4 7-8 7-8-3-8-7 3-7 8-7Z" fill="var(--cacao)" stroke="none" />
        <path d="M148 190c8 6 16 6 24 0" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        {/* orejitas */}
        <circle cx="118" cy="140" r="9" fill={FUR} />
        <circle cx="202" cy="140" r="9" fill={FUR} />
      </g>
    </svg>
  );
}
