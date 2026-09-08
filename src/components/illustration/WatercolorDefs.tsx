/**
 * Filtro de acuarela compartido. Se monta una sola vez (en el layout) y cada
 * ilustración lo referencia con filter="url(#wc-paint)".
 *
 * Receta: se tiembla el borde de la forma (feDisplacementMap) para que no se
 * vea "vector plano", se genera ruido cálido opaco, se recorta a la silueta
 * y se multiplica encima → pigmento que se apoza como en una aguada.
 */
export function WatercolorDefs() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="wc-paint"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="3"
            seed="8"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.11"
            numOctaves="4"
            seed="4"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0.86
                    0 0 0 0 0.79
                    0 0 0 0 0.66
                    0 0 0 0 1"
            result="grainRGB"
          />
          <feComposite
            in="grainRGB"
            in2="shape"
            operator="in"
            result="grainClip"
          />
          <feBlend in="shape" in2="grainClip" mode="multiply" result="painted" />
          {/* un roce de humedad en los bordes */}
          <feGaussianBlur in="painted" stdDeviation="0.4" />
        </filter>

        {/* variante tenue para miniaturas */}
        <filter
          id="wc-paint-soft"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.025"
            numOctaves="2"
            seed="8"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.14"
            numOctaves="3"
            seed="4"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0.9
                    0 0 0 0 0.84
                    0 0 0 0 0.72
                    0 0 0 0 1"
            result="grainRGB"
          />
          <feComposite
            in="grainRGB"
            in2="shape"
            operator="in"
            result="grainClip"
          />
          <feBlend in="shape" in2="grainClip" mode="multiply" />
        </filter>
      </defs>
    </svg>
  );
}
