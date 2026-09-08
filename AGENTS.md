# Notas para agentes — Wiki·Campeche

## Stack fijo
Next.js **15** (App Router) · TypeScript · Tailwind **v4** · Drizzle + libSQL/Turso ·
Framer Motion · GSAP/ScrollTrigger · Lenis · `next-view-transitions`.

No subir a Next 16 sin pedirlo: hay APIs (`viewTransition`, tipos de rutas) que
cambian.

## Datos
- Todo el contenido de especies vive en la base (Turso, o `./local.db` como
  fallback). **Nunca** hardcodear especies en componentes.
- Acceso a datos: sólo desde `src/lib/queries.ts` (`import "server-only"`).
- Tras cambiar `src/db/schema.ts`: `npm run db:generate && npm run db:migrate`.
- `.env.local` y `local.db` están en `.gitignore` — no commitear.

## Diseño
- Tokens de color/tipografía en `src/app/globals.css` (`:root` + `@theme inline`).
  Clases: `bg-paper`, `text-ink`, `text-jungle`, `text-rust`, `text-index`, etc.
- Utilidades tipográficas: `.font-display` (Anton), `.sci` (serif itálica, sólo
  nombres científicos), `.catalog` (mono, etiquetas/índices).
- Modo oscuro por `:root[data-theme="dark"]` y `prefers-color-scheme`.
- Toda animación respeta `prefers-reduced-motion`. Los reveals de scroll usan
  `src/components/ui/Reveal.tsx` (transición CSS + IntersectionObserver, con
  failsafe: el contenido nunca queda invisible).

## Convenciones
- Componentes de servidor por defecto; `"use client"` sólo si hay hooks/efectos.
- Enlaces internos: `import { Link } from "next-view-transitions"`.
- Números de catálogo y etiquetas: helpers en `src/lib/format.ts`.
