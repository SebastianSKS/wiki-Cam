/**
 * Ceiba / Yáax che' — Ceiba pentandra.
 * Referencia real: árbol emergente altísimo, tronco pálido con aguijones
 * cónicos, contrafuertes (raíces en forma de pared) en la base, copa amplia
 * y aparasolada muy arriba. Aquí, amable: una carita en el tronco.
 */
export function Ceiba({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="Ilustración de una ceiba, el árbol sagrado maya, con carita"
    >
      <g
        filter="url(#wc-paint)"
        stroke="var(--cacao)"
        strokeWidth="6.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* suelo */}
        <path d="M18 300c30-10 254-10 284 0" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />

        {/* copa aparasolada, muy arriba */}
        <path
          d="M160 30c60 0 104 26 104 58 0 24-24 40-58 44H114c-34-4-58-20-58-44 0-32 44-58 104-58Z"
          fill="var(--jungle)"
        />
        <path d="M76 74c-20 6-30 20-24 36 22 4 40-8 44-30Z" fill="var(--jungle-deep)" />
        <path d="M244 74c20 6 30 20 24 36-22 4-40-8-44-30Z" fill="var(--jungle-deep)" />
        <circle cx="160" cy="46" r="22" fill="var(--jungle-deep)" />

        {/* rama que cuelga con flor nocturna */}
        <g data-tail>
          <path d="M214 118c22 2 34 14 36 34" fill="none" stroke="var(--jungle-deep)" strokeWidth="7" />
          <g fill="var(--paper)" stroke="var(--cacao)" strokeWidth="4">
            <circle cx="252" cy="158" r="7" />
            <circle cx="266" cy="150" r="7" />
            <circle cx="266" cy="166" r="7" />
            <circle cx="240" cy="150" r="7" />
            <circle cx="240" cy="166" r="7" />
          </g>
          <circle cx="253" cy="158" r="4" fill="var(--sun)" stroke="none" />
        </g>

        {/* tronco */}
        <path
          d="M132 116c-6 0-8 8-8 24 0 44-10 92-30 128h132c-20-36-30-84-30-128 0-16-2-24-8-24Z"
          fill="#bcae90"
        />
        {/* contrafuertes */}
        <path d="M94 268c-24 4-40 16-46 32h58c-2-14-6-24-12-32Z" fill="#bcae90" />
        <path d="M226 268c24 4 40 16 46 32h-58c2-14 6-24 12-32Z" fill="#bcae90" />
        <path d="M160 244c-8 20-8 40 0 56 8-16 8-36 0-56Z" fill="#bcae90" />

        {/* aguijones del tronco */}
        <g fill="var(--jungle-deep)" stroke="none">
          <path d="M124 150l-10 4 8 6Z" />
          <path d="M196 168l10 4-8 6Z" />
          <path d="M120 196l-10 5 9 5Z" />
        </g>

        {/* carita en el tronco */}
        <g data-eye>
          <circle cx="146" cy="168" r="6" fill="#fff" />
          <circle cx="146" cy="169" r="3" fill="var(--cacao)" stroke="none" />
        </g>
        <g data-eye>
          <circle cx="174" cy="168" r="6" fill="#fff" />
          <circle cx="174" cy="169" r="3" fill="var(--cacao)" stroke="none" />
        </g>
        <path d="M150 186c6 6 14 6 20 0" fill="none" stroke="var(--cacao)" strokeWidth="4.5" />
      </g>
    </svg>
  );
}
