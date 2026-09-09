import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "De qué trata",
  description:
    "Wiki·Campeche es un libro digital sobre la fauna y la flora de Campeche, para niñas, niños y familias: algunas especies sólo viven aquí, otras comparten su hogar con vecinos cercanos.",
};

const SECTIONS = [
  {
    t: "¿Qué es esto?",
    body: "Un libro digital sobre los animales y las plantas de Campeche, México. Cada especie tiene su página con un cuento corto, un dibujo hecho a mano y un carnet con su nombre científico y su familia.",
  },
  {
    t: "¿Endémica o nativa?",
    body: "Algunas criaturas sólo existen en esta región y en ningún otro lugar del mundo: son endémicas y llevan la insignia “Sólo existe aquí”. Otras viven en Campeche pero también en otras partes de América: son nativas y llevan una insignia más discreta, “También vive aquí”. No todo lo de este libro es exclusivo de Campeche, y está bien que así sea.",
  },
  {
    t: "Los dibujos",
    body: "Todas las ilustraciones están dibujadas dentro del propio sitio, con formas simples y una textura de acuarela. Cuando una especie todavía no tiene su dibujo, verás un huevo: quiere decir que viene en camino.",
  },
  {
    t: "Decimos la verdad",
    body: "El medidor de cuidado usa la Lista Roja de la UICN y la norma mexicana NOM-059. Si una especie está en peligro, lo decimos con claridad y con calma: saberlo es el primer paso para ayudar.",
  },
  {
    t: "Para saber más",
    body: "Cada ficha tiene una sección para quien quiera profundizar, con el texto más técnico. Los datos de taxonomía vienen de GBIF y los municipios del marco geoestadístico del INEGI.",
  },
  {
    t: "Cómo está hecho",
    body: "Con Next.js y TypeScript, tipografías redondeadas, una base de datos en la nube y dibujos en SVG. Todo el movimiento se apaga si tu dispositivo pide menos animación.",
  },
];

export default function AcercaPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 pb-12 pt-10 sm:px-8">
      <header>
        <p className="hand text-xl text-ink-soft">la última página</p>
        <h1 className="mt-1 font-display text-[clamp(2.4rem,8vw,4.5rem)] leading-[0.98]">
          De qué trata este libro
        </h1>
      </header>

      <Reveal>
        <p className="sci mt-8 text-xl leading-relaxed text-ink-soft">
          Un estado lleno de vida: algunas especies sólo existen aquí, otras
          cruzan fronteras y las compartimos con los vecinos. Este libro intenta
          presentártelas con cariño y sin inventar nada.
        </p>
      </Reveal>

      <div className="mt-10 space-y-4">
        {SECTIONS.map((s, i) => (
          <Reveal
            key={s.t}
            as="section"
            delay={i * 0.05}
            className="rounded-[24px] border-[3px] border-line bg-paper p-6 shadow-[var(--card-shadow)]"
          >
            <h2 className="font-display text-2xl">
              <span className="hand mr-2 text-lg text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.t}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/especies" size="lg">
            Ir al índice
          </Button>
          <p className="hand text-lg text-ink-faint">
            proyecto independiente · sin fines de lucro · Campeche
          </p>
        </div>
      </Reveal>
    </div>
  );
}
