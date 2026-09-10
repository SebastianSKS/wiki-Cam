/* ============================================================
   BUILD-CAMPECHE-MAP · genera el contorno real del estado y sus
   13 municipios como paths SVG simplificados + la posición de
   cada pin (centroide del municipio).

   Fuente: INEGI. Marco Geoestadístico (servicio wscatgeo).
     Estado:     https://gaia.inegi.org.mx/wscatgeo/geo/mgee/04
     Municipios: https://gaia.inegi.org.mx/wscatgeo/geo/mgem/04
   Coordenadas en grados (WGS84). Se corren una vez y el resultado
   se pega en src/components/species/DistributionMap.tsx.

   Uso:  node scripts/build-campeche-map.mjs
   ============================================================ */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const STATE_URL = "https://gaia.inegi.org.mx/wscatgeo/geo/mgee/04";
const MUNI_URL = "https://gaia.inegi.org.mx/wscatgeo/geo/mgem/04";

// slug del proyecto ↔ clave INEGI (cvegeo)
const SLUG_BY_CVE = {
  "04001": "calkini",
  "04002": "campeche",
  "04003": "carmen",
  "04004": "champoton",
  "04005": "hecelchakan",
  "04006": "hopelchen",
  "04007": "palizada",
  "04008": "tenabo",
  "04009": "escarcega",
  "04010": "calakmul",
  "04011": "candelaria",
  "04012": "seybaplaya",
  "04013": "dzitbalche",
};

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "wiki-campeche/1.0" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

/* --- Douglas–Peucker sobre una polilínea [[lon,lat],...] --- */
function rdpLine(points, eps) {
  if (points.length < 3) return points.slice();
  let maxD = 0;
  let idx = 0;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1e-12;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > eps) {
    const left = rdpLine(points.slice(0, idx + 1), eps);
    const right = rdpLine(points.slice(idx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}

/* Simplifica un ANILLO CERRADO buscando la tolerancia que deje al menos
   `minPts` vértices (para que las municipios chicas no se colapsen). */
function simplifyRing(ring, eps, minPts) {
  // parte el anillo a la mitad para no perder toda la forma con endpoints fijos
  const n = ring.length;
  const half = Math.floor(n / 2);
  for (let e = eps; e > 1e-5; e *= 0.6) {
    const a = rdpLine(ring.slice(0, half + 1), e);
    const b = rdpLine(ring.slice(half), e);
    const out = a.slice(0, -1).concat(b);
    if (out.length >= minPts) return out;
  }
  return ring.filter((_, i) => i % Math.max(1, Math.floor(n / minPts)) === 0);
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a) / 2;
}

function centroid(ring) {
  let x = 0;
  let y = 0;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    x += (ring[j][0] + ring[i][0]) * f;
    y += (ring[j][1] + ring[i][1]) * f;
    a += f;
  }
  a *= 0.5;
  return [x / (6 * a), y / (6 * a)];
}

/* Todos los anillos EXTERIORES de una geometría (Polygon | MultiPolygon),
   filtrando islas minúsculas. `minAreaFrac` respecto al anillo más grande. */
function outerRings(geom, minAreaFrac) {
  const polys =
    geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  const rings = polys.map((p) => p[0]); // sólo exterior
  const areas = rings.map(ringArea);
  const max = Math.max(...areas);
  return rings.filter((_, i) => areas[i] >= max * minAreaFrac);
}

function main() {
  return Promise.all([getJson(STATE_URL), getJson(MUNI_URL)]).then(
    ([stateGj, muniGj]) => {
      // 1) bbox del estado para la proyección
      let minLon = Infinity;
      let maxLon = -Infinity;
      let minLat = Infinity;
      let maxLat = -Infinity;
      const scanPt = ([lon, lat]) => {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      };
      const scan = (a) => (typeof a[0] === "number" ? scanPt(a) : a.forEach(scan));
      scan(stateGj.features[0].geometry.coordinates);

      const midLat = (minLat + maxLat) / 2;
      const kx = Math.cos((midLat * Math.PI) / 180); // corrección de longitud

      // 2) proyección equirectangular → caja de ancho VBW, con margen
      const VBW = 200;
      const PAD = 6;
      const wDeg = (maxLon - minLon) * kx;
      const hDeg = maxLat - minLat;
      const scaleFit = (VBW - PAD * 2) / wDeg;
      const VBH = Math.round(hDeg * scaleFit + PAD * 2);
      const project = ([lon, lat]) => [
        +(PAD + (lon - minLon) * kx * scaleFit).toFixed(2),
        +(PAD + (maxLat - lat) * scaleFit).toFixed(2), // norte arriba
      ];

      const ringToPath = (ring) => {
        const pts = ring.map(project);
        return (
          "M" +
          pts.map(([x, y]) => `${x} ${y}`).join("L") +
          "Z"
        );
      };

      // 3) contorno del estado (algo más de detalle: la costa oeste con la
      //    Laguna de Términos es lo que más identifica al estado)
      const stateRings = outerRings(stateGj.features[0].geometry, 0.02)
        .map((r) => simplifyRing(r, 0.009, 14))
        .filter((r) => r.length >= 4);
      const statePath = stateRings.map(ringToPath).join(" ");

      // 4) cada municipio + su centroide (anillo mayor)
      const munis = {};
      for (const f of muniGj.features) {
        const slug = SLUG_BY_CVE[f.properties.cvegeo];
        if (!slug) continue;
        let rings = outerRings(f.geometry, 0.04)
          .map((r) => simplifyRing(r, 0.016, 6))
          .filter((r) => r.length >= 4);
        if (!rings.length) rings = [outerRings(f.geometry, 0)[0]];
        const biggest = rings.reduce((a, b) => (ringArea(b) > ringArea(a) ? b : a));
        const [cLon, cLat] = centroid(biggest);
        const [cx, cy] = project([cLon, cLat]);
        munis[slug] = {
          name: f.properties.nom_agem,
          d: rings.map(ringToPath).join(" "),
          cx,
          cy,
        };
      }

      // 5) volcado a un módulo TS listo para importar
      const pts = (s) => (s.match(/[ML]/g) || []).length;
      const order = [
        "calkini", "dzitbalche", "hecelchakan", "tenabo", "campeche",
        "seybaplaya", "hopelchen", "champoton", "escarcega", "carmen",
        "palizada", "candelaria", "calakmul",
      ];
      const src = stateGj.metadatos.Fuente_informacion_vectorial;
      const lines = [];
      lines.push(`/* Generado por scripts/build-campeche-map.mjs — NO editar a mano.`);
      lines.push(`   Fuente: ${src}`);
      lines.push(`   Servicio: INEGI wscatgeo (mgee/04 y mgem/04). Contornos`);
      lines.push(`   simplificados (Douglas–Peucker) y proyectados a un viewBox`);
      lines.push(`   ${VBW}x${VBH} con corrección de longitud por latitud media. */`);
      lines.push(``);
      // viewBox con aire extra a los lados para las etiquetas
      const MX = 24;
      const MY = 8;
      lines.push(`export const CAMPECHE_MAP_SOURCE = ${JSON.stringify(src)};`);
      lines.push(
        `export const CAMPECHE_VIEWBOX = "${-MX} ${-MY} ${VBW + MX * 2} ${VBH + MY * 2}";`,
      );
      lines.push(`export const CAMPECHE_W = ${VBW};`);
      lines.push(`export const CAMPECHE_H = ${VBH};`);
      lines.push(``);
      lines.push(`/** Contorno real del estado (una o varias sub-siluetas). */`);
      lines.push(`export const CAMPECHE_STATE_PATH = ${JSON.stringify(statePath)};`);
      lines.push(``);
      lines.push(`export type MuniGeo = { name: string; d: string; cx: number; cy: number };`);
      lines.push(``);
      lines.push(`/** slug → contorno del municipio + centroide (posición del pin). */`);
      lines.push(`export const CAMPECHE_MUNI: Record<string, MuniGeo> = {`);
      for (const slug of order) {
        const m = munis[slug];
        if (!m) continue;
        lines.push(
          `  ${slug}: { name: ${JSON.stringify(m.name)}, cx: ${m.cx}, cy: ${m.cy}, d: ${JSON.stringify(m.d)} },`,
        );
      }
      lines.push(`};`);
      lines.push(``);

      writeFileSync(
        join(process.cwd(), "src/components/species/campeche-geo.ts"),
        lines.join("\n"),
      );
      console.error(
        `✓ src/components/species/campeche-geo.ts · viewBox 0 0 ${VBW} ${VBH} · ` +
          `estado ${pts(statePath)} vért · municipios ${
            Object.values(munis).reduce((n, m) => n + pts(m.d), 0)
          } vért`,
      );
    },
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
