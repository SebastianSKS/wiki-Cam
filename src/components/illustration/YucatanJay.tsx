/**
 * Chara yucateca — Cyanocorax yucatanicus.
 * Referencia real: adulto con cabeza, pecho y vientre negro aterciopelado y
 * espalda, alas y cola de azul cobalto intenso; pico negro; ojo oscuro.
 * Colores muy marcados → ilustración sencilla: negro + cobalto + 2 detalles.
 */
export function YucatanJay({ className }: { className?: string }) {
  const COBALT = "#2f56c9";
  const BLACK = "#241f1c";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una chara yucateca azul y negra en una rama"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* rama */}
        <path d="M12 250c70-16 226-16 296 0" fill="none" stroke="var(--rust)" strokeWidth="15" />
        <path d="M118 246c6-10 14-10 20 0" fill="none" stroke="var(--rust)" strokeWidth="8" />

        {/* cola cobalto */}
        <g data-tail>
          <path
            d="M196 214c40 10 60 46 52 84-26 4-46-8-56-30-8-18-6-38 4-54Z"
            fill={COBALT}
          />
          <path d="M212 240c8 10 12 24 10 40" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        </g>

        {/* ala / espalda cobalto */}
        <path
          d="M150 96c50 0 74 34 74 82 0 20-6 36-18 46-34-2-58-14-70-38-14-30-8-72 14-92Z"
          fill={COBALT}
        />
        {/* plumas del ala */}
        <path d="M170 130c14 6 22 18 24 34M188 118c14 8 20 22 20 40" fill="none" stroke="var(--cacao)" strokeWidth="4" />

        {/* cuerpo negro */}
        <path
          d="M120 250c-40 0-58-28-58-72 0-52 34-86 82-86 26 0 44 12 44 34 0 40-6 84-20 108-12 10-30 16-48 16Z"
          fill={BLACK}
        />
        {/* patas */}
        <path d="M108 248v14M108 262h-10M108 262h10M140 250v14M140 264h-10M140 264h10" fill="none" strokeWidth="6" />

        {/* cabeza negra */}
        <circle cx="104" cy="118" r="46" fill={BLACK} />
        {/* pico negro */}
        <path d="M60 118 34 108l26 22Z" fill={BLACK} />

        {/* ojo */}
        <g data-eye>
          <circle cx="98" cy="110" r="12" fill="#fff" />
          <circle cx="96" cy="112" r="6.5" fill="var(--cacao)" stroke="none" />
          <circle cx="93" cy="107" r="2.4" fill="#fff" stroke="none" />
        </g>

        {/* brillos del plumaje azul */}
        <g stroke="none" fill="#7fa0ff" opacity="0.8">
          <circle cx="196" cy="150" r="5" />
          <circle cx="176" cy="186" r="4" />
        </g>
      </g>
    </svg>
  );
}
