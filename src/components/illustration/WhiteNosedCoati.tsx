/**
 * Pizote / Tejón — Nasua narica.
 * Referencia real: cuerpo pardo esbelto, hocico largo y móvil que termina en
 * nariz oscura, "máscara" clara alrededor de ojos y hocico, cola larga con
 * anillos llevada en alto. Micro-interacción: la naricita se mueve (data-trunk).
 */
export function WhiteNosedCoati({ className }: { className?: string }) {
  const FUR = "#96755a";
  const DARK = "#5b4636";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un pizote con la cola anillada en alto"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* suelo con hojarasca */}
        <path d="M20 300c30-8 250-8 280 0" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
        <g fill="var(--jungle-deep)" stroke="none" opacity="0.7">
          <path d="M60 292c-8-4-10-12-6-18 8 0 12 8 6 18Z" />
          <path d="M250 294c8-4 10-12 6-18-8 0-12 8-6 18Z" />
        </g>

        {/* cola larga en alto, con anillos */}
        <g data-tail>
          <path
            d="M232 226c40-8 58-44 52-98-4-38-2-74-26-96"
            fill="none"
            stroke={FUR}
            strokeWidth="24"
          />
          <g stroke={DARK} strokeWidth="10" fill="none">
            <path d="M264 44l6-2M270 78l8-1M278 116l8 1M282 156l6 3M276 194l4 4" />
          </g>
        </g>

        {/* cuerpo */}
        <path
          d="M96 250c-40 0-60-26-60-66 0-44 34-72 96-72 44 0 88 12 88 44 0 20-10 34-28 42-6 26-24 46-52 50-14 2-30 2-44 2Z"
          fill={FUR}
        />
        {/* patas */}
        <g fill={DARK}>
          <path d="M96 244h22v46H96zM176 244h22v46h-22zM140 250h20v40h-20z" />
        </g>

        {/* cabeza y hocico largo */}
        <path
          d="M96 178c-18 0-30-14-30-38 0-22 16-36 40-36 18 0 30 12 32 30l40 8c8 2 10 12 2 16l-44 10c-6 8-16 12-30 12-4 0-8 0-10-2Z"
          fill={FUR}
        />
        {/* máscara clara */}
        <path d="M72 150c-6-2-8-10-4-18 10-4 20 0 22 10Z" fill="var(--paper)" />
        <path d="M120 128c14 0 22 6 24 16l-30 6c-4-10 0-20 6-22Z" fill="var(--paper)" />

        {/* naricita móvil */}
        <g data-trunk>
          <path d="M176 152c14-2 20 6 16 16-4 8-16 8-22 0Z" fill={DARK} />
          <circle cx="186" cy="158" r="4" fill="var(--cacao)" stroke="none" />
        </g>

        {/* oreja */}
        <path d="M92 106c2-16 12-24 24-20 6 8 4 22-8 30Z" fill={FUR} />

        {/* ojo */}
        <g data-eye>
          <circle cx="100" cy="132" r="9" fill="#fff" />
          <circle cx="102" cy="133" r="4.5" fill="var(--cacao)" stroke="none" />
          <circle cx="99" cy="129" r="1.8" fill="#fff" stroke="none" />
        </g>
        <path d="M86 118c8-5 18-4 24 2" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />
      </g>
    </svg>
  );
}
