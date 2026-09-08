# Wiki·Campeche

Un **libro de cuentos ilustrado** sobre las especies endémicas del estado de
Campeche, México, para niñas, niños y familias. Cada especie tiene su página con
un cuento corto, una ilustración SVG hecha a mano, un *carnet de exploración*
(taxonomía tipo pasaporte) y un *medidor de cuidado* (una plantita que va de
floreciente a marchita según el estado de conservación real).

Estética: museo de historia natural para la infancia — crema vainilla cálido,
café cacao, acentos pastel, tipografías redondeadas, textura de acuarela sobre
cada dibujo. El modo claro es el protagonista; el oscuro es "hora de dormir bajo
las estrellas". La ternura es de forma, no de contenido: el estado de
conservación se dice con claridad, sin suavizarlo.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 (tokens en `src/app/globals.css`) |
| Datos | Turso / libSQL + Drizzle ORM — leído en Server Components |
| Movimiento | Framer Motion (aleteos), GSAP + ScrollTrigger (parallax ambiental), Lenis (smooth scroll); easings tipo resorte |
| Transiciones | View Transitions API vía `next-view-transitions` — efecto "pasar la página" |
| Ilustración | SVG dibujado a mano en el código + filtro de acuarela compartido (`WatercolorDefs`) |
| Tipografía | `next/font` — Baloo 2 (display), Nunito (cuerpo), Fraunces itálica (nombres científicos), Caveat (notas a mano) |

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
| `/` | Portada de libro con seres flotando (mariposas, hojas, sol) |
| `/especies` | Índice con filtros grandes: por tipo de animal y por "cómo están" |
| `/especies/[slug]` | Ficha-cuento: historia, dato curioso, carnet, medidor de cuidado |
| `/mapa` | Mapa de los 13 municipios y las criaturas registradas en cada uno |
| `/acerca` | De qué trata, fuentes y metodología |

## Modelo de datos (`src/db/schema.ts`)

- **`species`** — taxonomía completa (reino → epíteto), `conservation_status`
  (enum UICN `LC…DD`), `category` (enum `mamiferos|aves|reptiles|flora|marino`),
  `slug` único, `description` (técnica), `kid_description` y `fun_fact`
  (amigables, opcionales), hábitat, `image_url`, timestamps.
- **`regions`** — los 13 municipios de Campeche (nombre, cabecera, clave INEGI).
- **`species_regions`** — tabla puente muchos-a-muchos para el mapa.

## Accesibilidad y rendimiento

- Contraste AA en claro y oscuro incluso con la paleta pastel (café sobre crema ≈ 13:1).
- `prefers-reduced-motion` desactiva Lenis, la portada, los seres flotantes,
  los guiños de las ilustraciones y las View Transitions.
- Ilustraciones en SVG inline (sin peticiones, sin CLS). Cuando una especie no
  tiene dibujo se muestra un huevo "próximamente", nunca una imagen rota.
- Modo oscuro coherente ("hora de dormir bajo las estrellas"), no un invert.
