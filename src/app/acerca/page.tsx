import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "De qué trata",
  description:
    "Wiki·Campeche es un libro digital sobre los animales endémicos de Campeche, para niñas, niños y familias.",
};

const SECTIONS = [
  {
    emoji: "📖",
    t: "¿Qué es esto?",
    body: "Un libro digital sobre los animales que sólo viven en Campeche, México. Cada criatura tiene su página con un cuento corto, un dibujo hecho a mano y un carnet con su nombre científico y su familia.",
  },
  {
    emoji: "🎨",
    t: "Los dibujos",
    body: "Todas las ilustraciones están dibujadas dentro del propio sitio, con formas simples y una textura de acuarela. Cuando un animal todavía no tiene su dibujo, verás un huevo: quiere decir que viene en camino.",
  },
  {
    emoji: "🌱",
    t: "Decimos la verdad",
    body: "El medidor de cuidado usa la Lista Roja de la UICN y la norma mexicana NOM-059. Si una especie está en peligro, lo decimos con claridad y con calma: saberlo es el primer paso para ayudar.",
  },
  {
    emoji: "🔎",
    t: "Para saber más",
    body: "Cada ficha tiene una sección para quien quiera profundizar, con el texto más técnico. Los datos de taxonomía vienen de GBIF y los municipios del marco geoestadístico del INEGI.",
  },
  {
    emoji: "🛠️",
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
          Un estado, muchísimos animales que no viven en ningún otro lugar del
          planeta. Este libro intenta presentártelos con cariño y sin inventar
          nada.
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
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-line bg-sun text-xl">
              {s.emoji}
            </span>
            <h2 className="mt-3 font-display text-2xl">{s.t}</h2>
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
