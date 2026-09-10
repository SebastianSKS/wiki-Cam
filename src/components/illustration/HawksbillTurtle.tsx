/**
 * Tortuga carey — Eretmochelys imbricata.
 * Referencia real: caparazón con escudos ámbar y castaño que se solapan como
 * tejas y borde aserrado; pico angosto y ganchudo como el de un halcón;
 * aletas grandes con dos uñas. Aquí, nadando de perfil.
 * Micro-interacción: al hover la aleta delantera aletea (data-tail).
 */
export function HawksbillTurtle({ className }: { className?: string }) {
  const SHELL = "#c9822f";
  const SCUTE = "#7a4a1e";
  const SKIN = "#5f7d6a";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una tortuga carey nadando"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* fondo de agua con burbujas */}
        <g fill="none" stroke="var(--sky)" strokeWidth="5" opacity="0.8">
          <circle cx="60" cy="60" r="10" />
          <circle cx="44" cy="34" r="6" />
          <circle cx="270" cy="250" r="9" />
        </g>

        {/* aleta trasera */}
        <path d="M234 208c26 6 40 24 36 46-20 6-38-4-44-24Z" fill={SKIN} />
        {/* aleta delantera que aletea */}
        <g data-tail>
          <path d="M120 176c-30 6-52 30-54 62 24 8 48-2 60-26 8-16 6-28-6-36Z" fill={SKIN} />
          <path d="M78 224l4 8M92 220l3 9" fill="none" stroke="var(--cacao)" strokeWidth="4" />
        </g>

        {/* caparazón — óvalo con borde aserrado */}
        <path
          d="M150 96c58 0 96 40 96 82 0 40-38 66-96 66s-96-26-96-66c0-42 38-82 96-82Z"
          fill={SHELL}
        />
        {/* dientes de sierra del borde trasero */}
        <path d="M234 200l14 6-12 8M226 224l12 10-14 4M210 242l8 12-14 0" fill={SHELL} stroke="var(--cacao)" strokeWidth="4" />

        {/* escudos que se solapan */}
        <g fill="none" stroke={SCUTE} strokeWidth="5">
          <path d="M110 118c14 14 14 34 0 50" />
          <path d="M150 108c16 16 16 44 0 62" />
          <path d="M190 118c-14 14-14 34 0 50" />
          <path d="M96 168c14 12 14 30 0 44" />
          <path d="M150 178c16 12 16 34 0 48" />
          <path d="M204 168c-14 12-14 30 0 44" />
        </g>
        <g fill={SCUTE} stroke="none">
          <circle cx="150" cy="140" r="4" />
          <circle cx="120" cy="150" r="3.4" />
          <circle cx="180" cy="150" r="3.4" />
        </g>

        {/* cabeza con pico de halcón */}
        <path d="M60 168c-16 0-26-12-24-30 2-16 16-26 34-24 14 2 22 12 22 26" fill={SKIN} />
        <path d="M40 178c-14 2-22-4-24-14 4-6 12-8 20-4Z" fill="#4c6656" />
        {/* pico ganchudo */}
        <path d="M22 160c-8 0-12 6-10 14 6 2 12-1 14-8Z" fill="var(--cacao)" stroke="none" />
        {/* ojo */}
        <g data-eye>
          <circle cx="58" cy="150" r="8.5" fill="#fff" />
          <circle cx="57" cy="151" r="4.4" fill="var(--cacao)" stroke="none" />
          <circle cx="55" cy="148" r="1.6" fill="#fff" stroke="none" />
        </g>
        {/* escamas de la cabeza */}
        <g fill="none" stroke="var(--cacao)" strokeWidth="3" opacity="0.5">
          <path d="M48 128c8 4 18 4 26 0M44 168c8 3 16 3 24 0" />
        </g>
      </g>
    </svg>
  );
}
