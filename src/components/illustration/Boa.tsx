/**
 * Boa / mazacuate — Boa constrictor (poblaciones de México a menudo tratadas
 * como Boa imperator).
 * Referencia real: serpiente robusta, fondo pardo claro con "sillas de montar"
 * oscuras a lo largo del lomo, cola rojiza con manchas, cabeza con línea
 * oscura tras el ojo, lengua bífida. Aquí, enroscada y tranquila.
 * Micro-interacción: al hover la cola se mueve (data-tail).
 */
export function Boa({ className }: { className?: string }) {
  const SKIN = "#cdb083";
  const SADDLE = "#6e4b30";
  const TAILRED = "#b25436";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una boa enroscada y tranquila"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* rama / suelo */}
        <path d="M14 268c80-14 214-14 292 0" fill="none" stroke="var(--jungle-deep)" strokeWidth="10" />

        {/* espira exterior del cuerpo */}
        <path
          d="M160 262c-70 0-108-40-108-86 0-44 40-74 108-74s108 30 108 74c0 30-18 52-48 62"
          fill="none"
          stroke={SKIN}
          strokeWidth="40"
        />
        {/* espira interior */}
        <path
          d="M172 214c-40 0-64-22-64-52 0-26 24-44 56-44 30 0 52 16 52 42 0 20-12 34-32 40"
          fill="none"
          stroke={SKIN}
          strokeWidth="34"
        />
        {/* cola rojiza que asoma */}
        <g data-tail>
          <path d="M220 236c26 6 40 24 40 52" fill="none" stroke={TAILRED} strokeWidth="26" />
          <circle cx="252" cy="270" r="8" fill={SADDLE} stroke="none" />
        </g>

        {/* sillas de montar del lomo */}
        <g fill={SADDLE} stroke="none">
          <path d="M60 150c14-10 26-10 34 4-12 12-24 12-34-4Z" />
          <path d="M104 108c14-8 28-6 34 8-14 10-26 8-34-8Z" />
          <path d="M170 100c14-6 28-2 32 12-14 8-26 4-32-12Z" />
          <path d="M228 128c14-4 26 2 28 16-14 6-24 0-28-16Z" />
          <path d="M244 186c12-8 24-8 30 4-10 12-22 12-30-4Z" />
          <path d="M150 214c14-8 26-6 32 6-12 12-24 10-32-6Z" />
        </g>

        {/* cabeza triangular */}
        <path
          d="M52 176c-22-4-32-20-26-38 5-16 24-24 44-18 16 5 24 20 20 38-3 14-20 21-38 18Z"
          fill={SKIN}
        />
        {/* línea oscura tras el ojo */}
        <path d="M40 150c14 6 30 6 44-2" fill="none" stroke={SADDLE} strokeWidth="6" />
        {/* ojo con pupila vertical */}
        <g data-eye>
          <circle cx="44" cy="140" r="11" fill="#e8c98b" />
          <path d="M44 132v16" stroke="var(--cacao)" strokeWidth="4" />
          <circle cx="41" cy="136" r="2.2" fill="#fff" stroke="none" />
        </g>
        {/* lengua bífida */}
        <path d="M18 168c-12 2-22 8-30 2M18 168c-12 6-20 14-30 12" fill="none" stroke={TAILRED} strokeWidth="4" />
        <path d="M22 166c-6 0-10 1-14 3" fill="none" stroke="var(--cacao)" strokeWidth="5" />
      </g>
    </svg>
  );
}
