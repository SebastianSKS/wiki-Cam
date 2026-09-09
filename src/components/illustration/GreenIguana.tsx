/**
 * Iguana verde — Iguana iguana.
 * Referencia real: cuerpo verde, cresta dorsal de espinas, papada (gular)
 * grande bajo la barbilla, disco escamoso en la mejilla, cola larga y
 * anillada, dedos con garras. De perfil sobre una rama.
 */
export function GreenIguana({ className }: { className?: string }) {
  const SKIN = "#7bbf6a";
  const DEEP = "#3f8f4e";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una iguana verde con su cresta y papada"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* rama */}
        <path d="M10 246c70-14 226-14 300 0" fill="none" stroke="var(--rust)" strokeWidth="15" />

        {/* cola larga anillada */}
        <g data-tail>
          <path
            d="M232 214c46 4 66 34 60 74-30 4-52-8-64-32-8-16-6-30 4-42Z"
            fill={SKIN}
          />
          <g stroke="var(--cacao)" strokeWidth="4" fill="none">
            <path d="M244 232l8 10M258 256l8 10M240 258l6 10" />
          </g>
        </g>

        {/* cresta de espinas */}
        <path
          d="M92 96l8-24 10 22 10-24 10 24 12-22 10 24 12-20 10 22 12-18 8 20"
          fill={DEEP}
        />

        {/* cuerpo */}
        <path
          d="M96 220c-34 0-52-22-52-56 0-40 32-64 92-64 44 0 96 12 96 44 0 22-12 38-32 46-8 20-26 34-56 34-16 0-32 0-48-4Z"
          fill={SKIN}
        />
        {/* patas con garras */}
        <path d="M94 214v22M94 236l-8 6M94 236h8M94 236l8 8M156 220v20M156 240l-8 6M156 240h8M156 240l8 8" fill="none" strokeWidth="6" />

        {/* cabeza */}
        <path
          d="M44 168c-16 0-24-14-24-36 0-20 16-34 40-34 20 0 34 12 36 30 2 22-14 40-40 40-4 0-8 0-12 0Z"
          fill={SKIN}
        />
        {/* papada */}
        <path d="M50 168c-2 22 6 40 22 44 8-10 8-30-4-44Z" fill={SKIN} />
        {/* disco de la mejilla */}
        <circle cx="66" cy="128" r="14" fill={DEEP} />
        {/* boca */}
        <path d="M20 150c22 8 44 6 60-2" fill="none" strokeWidth="5" />

        {/* ojo con anillo naranja */}
        <g data-eye>
          <circle cx="72" cy="112" r="12" fill="var(--sun)" />
          <circle cx="72" cy="112" r="6" fill="var(--cacao)" stroke="none" />
          <circle cx="69" cy="109" r="2" fill="#fff" stroke="none" />
        </g>
        {/* narina */}
        <circle cx="26" cy="140" r="3" fill="var(--cacao)" stroke="none" />
        {/* escamas del dorso */}
        <g fill={DEEP} stroke="none">
          <circle cx="120" cy="150" r="5" />
          <circle cx="150" cy="146" r="5" />
          <circle cx="180" cy="152" r="5" />
        </g>
      </g>
    </svg>
  );
}
