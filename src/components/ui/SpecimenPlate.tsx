import { cn } from "@/lib/cn";

/**
 * Lámina de espécimen sin fotografía: retícula de registro, glifo fantasma
 * y nota de catálogo. Se usa como marcador honesto mientras no hay ilustración.
 */
export function SpecimenPlate({
  glyph,
  caption = "Sin lámina · pendiente de ilustración",
  className,
}: {
  glyph: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-paper-2 text-ink",
        className,
      )}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* retícula tenue */}
        <defs>
          <pattern
            id="plate-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.14"
            />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#plate-grid)" />

        {/* anillos de distribución */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.22"
        >
          <circle cx="200" cy="196" r="120" strokeDasharray="2 5" />
          <circle cx="200" cy="196" r="82" />
          <circle cx="200" cy="196" r="44" strokeDasharray="2 5" />
        </g>

        {/* marcas de registro */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.55">
          <path d="M20 20 h22 M20 20 v22" />
          <path d="M380 20 h-22 M380 20 v22" />
          <path d="M20 380 h22 M20 380 v-22" />
          <path d="M380 380 h-22 M380 380 v-22" />
          <circle cx="200" cy="196" r="4" fill="none" />
          <path d="M200 186 v20 M190 196 h20" strokeWidth="0.75" />
        </g>

        {/* glifo fantasma */}
        <text
          x="200"
          y="196"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-display)"
          fontSize="150"
          fill="currentColor"
          opacity="0.12"
        >
          {glyph}
        </text>
      </svg>

      <span className="catalog absolute bottom-3 left-3 right-3 text-[0.5625rem] text-ink-faint">
        {caption}
      </span>
    </div>
  );
}
