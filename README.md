# Wiki·Campeche

Catálogo editorial de especies endémicas del estado de Campeche, México.
Cada especie se trata como un **espécimen de museo**: número de catálogo, lámina,
ficha técnica y carta de distribución municipal.

Estética: *field guide* científico llevado al extremo gráfico — ficha de
espécimen, cuaderno de campo, ficha bibliotecaria antigua. Tipografía técnica
para datos, nombres científicos en cursiva serif, alto contraste, textura
impresa.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 (tokens en `src/app/globals.css`) |
| Datos | Turso / libSQL + Drizzle ORM — leído en Server Components |
| Movimiento | Framer Motion (micro-interacciones), GSAP + ScrollTrigger (scroll), Lenis (smooth scroll) |
| Transiciones | View Transitions API vía `next-view-transitions` |
| Tipografía | `next/font` — Anton (display), Newsreader (serif itálica), JetBrains Mono (datos) |

## Puesta en marcha

```bash
npm install
```

### Base de datos

El proyecto lee de **Turso**. Si no hay credenciales configuradas, cae
automáticamente a un archivo **SQLite local** (`./local.db`) para desarrollo.

1. Copia el ejemplo de entorno:

   ```bash
   cp .env.example .env.local
   ```

2. (Opcional pero recomendado) crea una base en Turso y pega las credenciales
   en `.env.local`:

   ```bash
   turso db create wiki-camp
   turso db show wiki-camp --url      # -> TURSO_DATABASE_URL
   turso db tokens create wiki-camp   # -> TURSO_AUTH_TOKEN
   ```

3. Crea las tablas y siembra los datos:

   ```bash
   npm run db:migrate   # aplica ./drizzle/*.sql
   npm run db:seed      # 13 municipios + 3 especies + relaciones
   ```

   > Sin credenciales de Turso, ambos comandos operan sobre `./local.db`
   > (ignorado por git). Con credenciales reales, operan sobre Turso.

### Desarrollo

```bash
npm run dev      # http://localhost:3000
```

### Scripts

| Script | Acción |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm run db:generate` | Genera migraciones SQL desde el schema |
| `npm run db:migrate` | Aplica migraciones (`drizzle/`) |
| `npm run db:seed` | Siembra municipios + especies |
| `npm run db:reset` | `db:migrate` + `db:seed` |
| `npm run db:studio` | Drizzle Studio |

## Arquitectura de rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Portada tipo cubierta de catálogo, con animación de apertura |
| `/especies` | Índice filtrable por categoría taxonómica y estado de conservación |
| `/especies/[slug]` | Ficha de espécimen individual |
| `/mapa` | Carta esquemática de los 13 municipios y sus especies |
| `/acerca` | Metodología y fuentes |

## Modelo de datos (`src/db/schema.ts`)

- **`species`** — taxonomía completa (reino → epíteto), `conservation_status`
  (enum UICN `LC…DD`), `category` (enum `mamiferos|aves|reptiles|flora|marino`),
  `slug` único, descripción, hábitat, `image_url`, timestamps.
- **`regions`** — los 13 municipios de Campeche (nombre, cabecera, clave INEGI).
- **`species_regions`** — tabla puente muchos-a-muchos para el mapa.

## Accesibilidad y rendimiento

- Contraste AA en claro y oscuro; foco de teclado visible.
- `prefers-reduced-motion` desactiva Lenis y todas las animaciones.
- Imágenes con `next/image` (lazy, sin CLS) y respaldo a lámina SVG.
- Modo oscuro coherente ("archivo en cuarto oscuro"), no un invert.
