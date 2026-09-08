/**
 * Jaguar — Panthera onca.
 * Referencia real: cabeza ancha y robusta, pelaje amarillo dorado, rosetas
 * negras muy marcadas, hocico y barbilla cremas, orejas redondas, ojos
 * almendrados color ámbar, cola larga con punta oscura.
 * Estilo: blobs superpuestos, contorno grueso, cara amable pero felina.
 */
export function Jaguar({ className }: { className?: string }) {
  const AMBER = "#d69a3c";
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de un jaguar con cara amigable"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* cola con punta oscura */}
        <g data-tail>
          <path
            d="M240 250c46 6 60-30 44-58-14-24-46-18-44-52"
            fill="none"
            stroke="var(--sun)"
            strokeWidth="20"
          />
          <path
            d="M240 250c46 6 60-30 44-58"
            fill="none"
            stroke="var(--sun)"
            strokeWidth="20"
          />
          <circle cx="284" cy="192" r="9" fill="var(--cacao)" stroke="none" />
          <g stroke="var(--cacao)" strokeWidth="4" fill="none">
            <circle cx="262" cy="232" r="6" />
          </g>
        </g>

        {/* pecho */}
        <path
          d="M160 322c-74 0-112-40-112-92 0-40 40-62 112-62s112 22 112 62c0 52-38 92-112 92Z"
          fill="var(--sun)"
        />
        <ellipse cx="160" cy="292" rx="52" ry="44" fill="var(--paper)" />
        <g stroke="var(--cacao)" strokeWidth="4.5" fill="none">
          <circle cx="104" cy="238" r="10" />
          <circle cx="216" cy="238" r="10" />
        </g>
        <g fill="var(--cacao)" stroke="none">
          <circle cx="104" cy="238" r="3" />
          <circle cx="216" cy="238" r="3" />
        </g>

        {/* orejas */}
        <path d="M96 92C74 58 44 52 40 78c-4 26 16 46 44 50Z" fill="var(--sun)" />
        <path d="M224 92c22-34 52-40 56-14 4 26-16 46-44 50Z" fill="var(--sun)" />
        <path d="M84 84c-14-14-26-16-28-2" fill="none" stroke="var(--cacao)" strokeWidth="5" />
        <path d="M236 84c14-14 26-16 28-2" fill="none" stroke="var(--cacao)" strokeWidth="5" />
        <path d="M74 96c-8-6-14-4-16 4" fill="var(--coral)" stroke="none" />
        <path d="M246 96c8-6 14-4 16 4" fill="var(--coral)" stroke="none" />

        {/* cabeza */}
        <path
          d="M160 44c62 0 104 40 104 96 0 62-46 98-104 98S56 202 56 140c0-56 42-96 104-96Z"
          fill="var(--sun)"
        />

        {/* rosetas */}
        <g stroke="var(--cacao)" strokeWidth="5.5" fill="none">
          <circle cx="160" cy="64" r="10" />
          <circle cx="112" cy="88" r="12" />
          <circle cx="210" cy="86" r="12" />
          <circle cx="92" cy="150" r="12" />
          <circle cx="230" cy="150" r="12" />
          <circle cx="118" cy="196" r="10" />
          <circle cx="204" cy="196" r="10" />
        </g>
        <g fill="var(--cacao)" stroke="none">
          <circle cx="160" cy="64" r="3" />
          <circle cx="112" cy="88" r="3.4" />
          <circle cx="210" cy="86" r="3.4" />
          <circle cx="92" cy="150" r="3.4" />
          <circle cx="230" cy="150" r="3.4" />
          <circle cx="118" cy="196" r="3" />
          <circle cx="204" cy="196" r="3" />
        </g>

        {/* cachetes / almohadillas */}
        <circle cx="132" cy="196" r="26" fill="var(--paper)" />
        <circle cx="188" cy="196" r="26" fill="var(--paper)" />
        {/* hocico crema */}
        <path
          d="M160 150c26 0 40 12 40 30 0 20-18 34-40 34s-40-14-40-34c0-18 14-30 40-30Z"
          fill="var(--paper)"
        />
        {/* nariz y boca */}
        <path d="M160 158c9 0 14 5 14 11 0 7-7 12-14 12s-14-5-14-12c0-6 5-11 14-11Z" fill="var(--coral)" />
        <path d="M160 181v10M160 191c-6 8-14 8-20 2M160 191c6 8 14 8 20 2" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />

        {/* ojos almendrados */}
        <g data-eye>
          <path d="M104 128q22-20 46-6-6 26-30 24-18-2-16-18Z" fill="#fff" />
          <circle cx="128" cy="128" r="13" fill={AMBER} stroke="var(--cacao)" strokeWidth="4" />
          <circle cx="128" cy="128" r="6" fill="var(--cacao)" stroke="none" />
          <circle cx="123" cy="123" r="3" fill="#fff" stroke="none" />
        </g>
        <g data-eye>
          <path d="M216 128q-22-20-46-6 6 26 30 24 18-2 16-18Z" fill="#fff" />
          <circle cx="192" cy="128" r="13" fill={AMBER} stroke="var(--cacao)" strokeWidth="4" />
          <circle cx="192" cy="128" r="6" fill="var(--cacao)" stroke="none" />
          <circle cx="187" cy="123" r="3" fill="#fff" stroke="none" />
        </g>
        <path d="M104 104c12-8 26-7 34 2" fill="none" stroke="var(--cacao)" strokeWidth="5" />
        <path d="M182 106c8-9 22-10 34-2" fill="none" stroke="var(--cacao)" strokeWidth="5" />

        {/* bigotes */}
        <g stroke="var(--ink-soft)" strokeWidth="3.5">
          <path d="M108 188c-20-2-34 0-46 6" />
          <path d="M110 200c-18 2-30 8-40 16" />
          <path d="M212 188c20-2 34 0 46 6" />
          <path d="M210 200c18 2 30 8 40 16" />
        </g>
      </g>
    </svg>
  );
}
