/**
 * Tapir centroamericano / danta — Tapirus bairdii.
 * Referencia real: cuerpo gris pardo macizo, naricita/trompa prensil corta,
 * patas cortas y robustas, orejas con borde claro, mejillas pálidas, cola nub.
 * Micro-interacción: al hover la trompa se mueve (data-trunk).
 */
export function Tapir({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un tapir con su naricita"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* charco */}
        <ellipse cx="160" cy="288" rx="140" ry="20" fill="var(--sky)" />

        {/* patas */}
        <g fill="#7c6f60">
          <path d="M104 244h26v44h-26z" />
          <path d="M196 244h26v44h-26z" />
          <path d="M150 250h24v40h-24z" />
        </g>

        {/* cuerpo */}
        <path
          d="M96 246c-40 0-58-34-58-74 0-52 44-86 118-86 66 0 110 26 110 74 0 52-36 86-104 86-22 0-44 0-66 0Z"
          fill="#9a8d7c"
        />
        {/* grupa alta */}
        <circle cx="214" cy="150" r="60" fill="#9a8d7c" />
        {/* cola nub */}
        <path d="M270 150c14-2 22 6 20 16-2 8-14 10-22 4Z" fill="#9a8d7c" />
        {/* pecas de cría */}
        <g fill="var(--paper)" stroke="none" opacity="0.7">
          <circle cx="196" cy="150" r="4.5" />
          <circle cx="222" cy="170" r="4" />
          <circle cx="176" cy="176" r="3.6" />
        </g>

        {/* cabeza */}
        <path
          d="M58 168c-24 0-40-20-40-50s20-52 52-52c30 0 46 22 46 52 0 32-22 50-58 50Z"
          fill="#9a8d7c"
        />
        {/* oreja */}
        <path d="M92 78c2-24 16-34 28-24 10 8 6 30-8 40Z" fill="#9a8d7c" />
        <path d="M96 82c2-14 9-19 16-14" fill="none" stroke="var(--paper)" strokeWidth="4" />

        {/* mejilla pálida */}
        <path
          d="M40 176c-16 0-24-12-22-28 2-14 16-20 32-16Z"
          fill="var(--paper)"
        />

        {/* trompita prensil */}
        <g data-trunk>
          <path
            d="M20 150c-14 2-16 18-8 30 6 9 20 10 28 2"
            fill="#8a7d6c"
            stroke="var(--cacao)"
            strokeWidth="6.5"
          />
          <circle cx="24" cy="150" r="5" fill="var(--cacao)" stroke="none" />
          <circle cx="30" cy="166" r="4" fill="var(--cacao)" stroke="none" />
        </g>

        {/* ojo */}
        <g data-eye>
          <ellipse cx="70" cy="122" rx="13" ry="15" fill="#fff" />
          <circle cx="68" cy="124" r="7" fill="var(--cacao)" stroke="none" />
          <circle cx="64" cy="119" r="3" fill="#fff" stroke="none" />
        </g>
        <path d="M52 104c8-6 20-6 28 0" fill="none" stroke="var(--cacao)" strokeWidth="5" />

        {/* juncos */}
        <g fill="none" stroke="var(--jungle)" strokeWidth="7">
          <path d="M292 288c0-30 4-48 14-64" />
          <path d="M300 288c2-26 10-40 22-52" />
        </g>
      </g>
    </svg>
  );
}
