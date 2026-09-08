# Notas para agentes — Wiki·Campeche

Libro de cuentos ilustrado sobre especies endémicas de Campeche, para infancia
y familias. Estética: museo de historia natural infantil, no dashboard.

## Stack fijo
Next.js **15** (App Router) · TypeScript · Tailwind **v4** · Drizzle + libSQL/Turso ·
Framer Motion · GSAP/ScrollTrigger · Lenis · `next-view-transitions`.
No subir a Next 16 sin pedirlo.

## Datos
- Todo el contenido de especies vive en la base (Turso, o `./local.db` como
  fallback). **Nunca** hardcodear especies en componentes.
- Acceso a datos: sólo desde `src/lib/queries.ts` (`import "server-only"`).
- Columnas: `description` es la versión técnica; `kid_description` y `fun_fact`
  son la versión amigable (opcionales). Tras tocar `schema.ts`:
  `npm run db:generate && npm run db:migrate && npm run db:seed`.
- `.env.local` y `local.db` en `.gitignore`.

## Diseño
- Tokens en `src/app/globals.css` (`:root` + `@theme inline`). Nombres semánticos
  conservados (`--paper`, `--ink`) más acentos: `--jungle --sky --coral --sun
  --lavender` y sus `*-ink` para texto encima.
- Tipografías: `.font-display` (Baloo 2), cuerpo Nunito por defecto, `.sci`
  (Fraunces itálica, sólo nombres científicos), `.hand` (Caveat, notas al margen).
- Todo redondeado: bordes gruesos (3px), esquinas grandes, sombras suaves,
  easings tipo resorte (`--ease-bounce`). Nada de píldoras planas SaaS.
- Contraste AA obligatorio incluso con pastel. El estado de conservación se dice
  con honestidad; la ternura es de forma, no de contenido.

## Ilustraciones (lo importante)
- Cada animal es un componente SVG dibujado a mano en
  `src/components/illustration/` (`Jaguar`, `Howler`, `Tapir`, `MysteryEgg`).
- Registro y viñeta orgánica con hábitat: `SpeciesIllustration.tsx`
  (`SpeciesScene`, `hasIllustration`).
- Filtro de acuarela compartido: `WatercolorDefs.tsx` (montado en el layout);
  se usa con `filter="url(#wc-paint)"` / `url(#wc-paint-soft)`.
- Guiños en hover: atributos `data-eye` / `data-tail` / `data-trunk` +
  reglas `.illo-wink:hover ...` en globals.css (se apagan con reduced-motion).

## Convenciones
- Componentes de servidor por defecto; `"use client"` sólo con hooks/efectos.
- Enlaces internos: `import { Link } from "next-view-transitions"`.
- Reveals de scroll: `src/components/ui/Reveal.tsx` (transición CSS +
  IntersectionObserver + failsafe; el contenido nunca queda invisible).
