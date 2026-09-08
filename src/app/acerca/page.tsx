import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Acerca del proyecto",
  description:
    "Metodología, fuentes y criterios editoriales del catálogo Wiki·Campeche de especies endémicas.",
};

const SECTIONS = [
  {
    n: "01",
    t: "Qué es",
    body: "Wiki·Campeche es un archivo editorial de la biodiversidad endémica y emblemática del estado de Campeche, México. Cada especie se trata como un espécimen de museo: recibe un número de catálogo, una lámina, una ficha técnica y una carta de distribución municipal.",
  },
  {
    n: "02",
    t: "Fuentes de datos",
    body: "La taxonomía sigue el GBIF Backbone Taxonomy. El estado de conservación global proviene de la Lista Roja de la UICN; el estatus nacional, de la NOM-059-SEMARNAT-2010. La división municipal y las claves numéricas corresponden al Marco Geoestadístico del INEGI.",
  },
  {
    n: "03",
    t: "Criterio de distribución",
    body: "La relación especie–municipio se registra a partir de literatura científica y colecciones. La carta de distribución es esquemática y conservadora: marca presencia documentada, no idoneidad de hábitat ni áreas potenciales.",
  },
  {
    n: "04",
    t: "Ilustraciones",
    body: "Las láminas fotográficas provienen de repositorios de dominio público. Cuando no hay imagen libre disponible se muestra una lámina esquemática generada a partir de la retícula del propio catálogo, nunca una imagen de origen incierto.",
  },
  {
    n: "05",
    t: "Tecnología",
    body: "Sitio construido con Next.js y TypeScript, tipografía variable, Turso/libSQL como base de datos y render en el servidor. Movimiento con Framer Motion y GSAP, respetando siempre la preferencia de movimiento reducido del sistema.",
  },
];

export default function AcercaPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-8">
      <header className="border-b-2 border-line pb-4">
        <p className="catalog text-ink-faint">Colofón</p>
        <h1 className="mt-2 font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]">
          Acerca del catálogo
        </h1>
      </header>

      <div className="mt-10 max-w-3xl">
        <Reveal>
          <p className="sci text-xl leading-relaxed text-ink-soft">
            Un estado, cientos de especies que no viven en ningún otro sitio del
            planeta. Este catálogo intenta mirarlas con el rigor de una ficha de
            museo y el cuidado de un cuaderno de campo.
          </p>
        </Reveal>

        <div className="mt-12 border-l border-line">
          {SECTIONS.map((s) => (
            <Reveal
              key={s.n}
              as="section"
              className="relative border-b border-line py-8 pl-6 last:border-b-0"
            >
              <span className="font-display absolute -left-px top-8 -translate-x-1/2 bg-paper px-1 text-sm text-rust">
                {s.n}
              </span>
              <h2 className="font-display text-2xl">{s.t}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-line pt-8">
            <Button href="/especies">Ir al índice</Button>
            <p className="text-xs text-ink-faint">
              Proyecto editorial independiente · sin fines de lucro · Campeche,
              MX.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
