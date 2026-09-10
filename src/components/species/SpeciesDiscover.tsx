"use client";

/* ============================================================
   TOCA PARA DESCUBRIR · puntos táctiles sobre la ilustración hero
   ------------------------------------------------------------
   Capa fina que se monta ENCIMA de <SpeciesScene> (hermana, no
   la envuelve): 2-4 puntos por especie sobre partes concretas
   del dibujo. Al activarlos, micro-animación en esa parte del
   SVG (reusa los keyframes del sistema de guiño: `twinkle`,
   `tail-wag`, `blink`, `sway`; más un par locales) y una notita
   adhesiva con un dato de una línea.

   La notita se coloca MIDIENDO al abrir: elige el lado (der/izq/
   arriba/abajo del punto) donde quepa entera dentro de la viñeta
   y, si hace falta, se pega al borde sin salirse ni quedar tapada
   por el marco; además evita cubrir otro puntito. Se recalcula al
   redimensionar. (Sólo hay una notita abierta a la vez.)

   No importa ninguna ilustración: alcanza las partes del SVG por
   selector desde el DOM. Así este componente pesa lo mismo para
   todas las fichas y NO arrastra el registro de ilustraciones al
   bundle de cliente de la ruta.

   Para quitarlo por completo: borra este archivo y, en
   `src/app/especies/[slug]/page.tsx`, deja el hero como
   `<SpeciesScene slug={species.slug} shared className="mx-auto w-full max-w-md" />`
   quitando el <div> contenedor y el import de SpeciesDiscover.
   ============================================================ */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

type Place = "below" | "above" | "left" | "right";
type AnimKey = "glow" | "wag" | "blink" | "quiver" | "pulse" | "sway";

type Spot = {
  id: string;
  /** texto accesible del punto */
  label: string;
  /** centro del punto, en % del cuadro de la viñeta */
  x: number;
  y: number;
  /** lado preferido para la notita (se cambia si no cabe) */
  place: Place;
  /** parte(s) del SVG a animar, relativo al <svg> de la ilustración */
  sel: string;
  /** anima TODOS los que casen (por defecto sólo el primero) */
  all?: boolean;
  /** anima el n-ésimo que case (0-based) */
  nth?: number;
  anim: AnimKey;
  /** dato breve; «MAYA» se sustituye por el nombre en maya de la especie */
  fact: string;
  /** el punto sólo aparece si la especie tiene nombre en maya */
  needsMaya?: boolean;
};

/* Presets de animación. `twinkle` / `tail-wag` / `blink` / `sway`
   son keyframes que ya viven en globals.css (sistema de guiño);
   `hp-quiver` y `hp-pulse` van en el <style> de abajo. */
const ANIM: Record<AnimKey, { name: string; dur: string; ease: string; iters: string; origin: string }> = {
  glow: { name: "twinkle", dur: "0.9s", ease: "var(--ease-soft)", iters: "1", origin: "center" },
  wag: { name: "tail-wag", dur: "0.9s", ease: "var(--ease-soft)", iters: "2", origin: "center" },
  blink: { name: "blink", dur: "0.5s", ease: "var(--ease-soft)", iters: "1", origin: "center" },
  quiver: { name: "hp-quiver", dur: "0.5s", ease: "ease-in-out", iters: "2", origin: "center" },
  pulse: { name: "hp-pulse", dur: "0.7s", ease: "var(--ease-bounce)", iters: "1", origin: "center" },
  sway: { name: "sway", dur: "0.6s", ease: "ease-in-out", iters: "1", origin: "bottom" },
};

const MAYA_LABEL = "El nombre en maya de esta criatura";

/* Datos de una línea, tomados de fun_fact / description / kid_description de
   cada especie (misma fuente que la ficha). Coordenadas en % de la viñeta. */
const SPOTS: Record<string, Spot[]> = {
  jaguar: [
    { id: "manchas", label: "Un dato sobre las manchas del jaguar", x: 50, y: 25, place: "above",
      sel: 'g[stroke-width="5.5"]', anim: "glow",
      fact: "No hay dos jaguares con el mismo dibujo de manchas, como pasa con las huellas de tus dedos." },
    { id: "bigotes", label: "Un dato sobre el jaguar de noche", x: 32, y: 61, place: "right",
      sel: 'g[stroke="var(--ink-soft)"]', anim: "quiver",
      fact: "Camina sin hacer ni un ruidito y le encanta trepar a las ramas para mirarlo todo." },
    { id: "maya", label: MAYA_LABEL, x: 41, y: 42, place: "right", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA»." },
  ],
  "mono-aullador-negro": [
    { id: "garganta", label: "Un dato sobre el aullido del mono", x: 50, y: 47, place: "right",
      sel: 'ellipse[fill="var(--coral)"]', anim: "pulse",
      fact: "Su aullido se oye a más de tres kilómetros: es de los animales más ruidosos de la tierra." },
    { id: "cola", label: "Un dato sobre la cola del mono", x: 12, y: 54, place: "right",
      sel: "[data-tail]", anim: "wag",
      fact: "Usa la cola larga como una quinta mano para colgarse de las ramas." },
  ],
  "tapir-centroamericano": [
    { id: "trompa", label: "Un dato sobre la trompa del tapir", x: 13, y: 48, place: "right",
      sel: "[data-trunk]", anim: "wag",
      fact: "Mueve la trompa como una manita para agarrar hojas y frutas." },
    { id: "agua", label: "Un dato sobre el tapir y el agua", x: 50, y: 84, place: "above",
      sel: 'ellipse[fill="var(--sky)"]', anim: "pulse",
      fact: "Le encanta el agua: se mete a refrescarse y hasta sabe bucear." },
    { id: "pecas", label: "Un dato sobre las crías del tapir", x: 61, y: 51, place: "right",
      sel: 'g[fill="var(--paper)"][opacity="0.7"]', anim: "glow",
      fact: "De bebés nacen rayados y con puntitos, como una sandía con patas." },
  ],
  "pavo-ocelado": [
    { id: "cola", label: "Un dato sobre la cola del pavo ocelado", x: 54, y: 39, place: "right",
      sel: "[data-tail]", anim: "wag",
      fact: "Los círculos de su cola se llaman ocelos y le dan su nombre." },
    { id: "carunculas", label: "Un dato sobre la cabeza del pavo ocelado", x: 37, y: 32, place: "below",
      sel: 'g[fill="var(--coral)"][stroke="var(--cacao)"]', anim: "glow",
      fact: "Las bolitas de su cabeza se inflan y brillan más cuando corteja." },
  ],
  "cocodrilo-de-pantano": [
    { id: "boca", label: "Un dato sobre la boca del cocodrilo", x: 22, y: 55, place: "right",
      sel: 'g[fill="#fff"]', anim: "quiver",
      fact: "Con esa boca tan grande lleva a sus crías al agua una por una, con cuidado." },
    { id: "cola", label: "Un dato sobre la cola del cocodrilo", x: 76, y: 47, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "Mueve esta cola larga de lado a lado y eso es lo que lo empuja al nadar." },
    { id: "maya", label: MAYA_LABEL, x: 27, y: 41, place: "below", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA»." },
  ],
  ceiba: [
    { id: "copa", label: "Un dato sobre lo alto que crece la ceiba", x: 50, y: 22, place: "below",
      sel: 'path[fill="var(--jungle)"]', anim: "pulse",
      fact: "Es el árbol más alto de la selva: llega a medir como un edificio de veinte pisos." },
    { id: "raices", label: "Un dato sobre las raíces de la ceiba", x: 50, y: 81, place: "above",
      sel: 'path[fill="#bcae90"]', all: true, anim: "sway",
      fact: "Sus raíces salen del suelo como paredes; detrás de una cabe una persona." },
    { id: "maya", label: "El nombre en maya de la ceiba", x: 50, y: 52, place: "right",
      sel: "[data-eye]", all: true, anim: "blink",
      fact: "Los mayas la llaman Yáax che’, el árbol sagrado que une el cielo y la tierra." },
  ],
  "manati-antillano": [
    { id: "cola", label: "Un dato sobre la cola del manatí", x: 82, y: 59, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "Los marineros que creían ver sirenas seguramente veían manatíes moviendo esta cola." },
    { id: "bigotes", label: "Un dato sobre el hocico del manatí", x: 15, y: 43, place: "right",
      sel: 'g[stroke="var(--ink-soft)"]', anim: "quiver",
      fact: "Con el hocico lleno de bigotes gruesos junta el pasto de mar que come todo el día." },
  ],
  "chara-yucateca": [
    { id: "plumaje", label: "Un dato sobre el plumaje de la chara", x: 57, y: 52, place: "right",
      sel: 'g[fill="#7fa0ff"]', anim: "glow",
      fact: "De pequeña es clarita; de grande se vuelve negra y azul cobalto, como si cambiara de disfraz." },
    { id: "maya", label: MAYA_LABEL, x: 33, y: 38, place: "below", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA»." },
  ],
  "carpintero-yucateco": [
    { id: "pico", label: "Un dato sobre el pico del carpintero", x: 46, y: 33, place: "right",
      sel: 'path[fill="var(--cacao)"][stroke="none"]', anim: "quiver",
      fact: "No canta con la voz: tamborilea el pico contra la madera a toda velocidad." },
    { id: "maya", label: MAYA_LABEL, x: 30, y: 33, place: "left", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA» (también Ch’elom)." },
  ],
  pizote: [
    { id: "nariz", label: "Un dato sobre la nariz del pizote", x: 57, y: 50, place: "right",
      sel: "[data-trunk]", anim: "wag",
      fact: "Su nariz larga y flexible es su navaja suiza: huele, escarba y saca comida de los huecos." },
    { id: "cola", label: "Un dato sobre la cola del pizote", x: 79, y: 39, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "Camina con la cola en alto, llena de anillos, como una banderita." },
    { id: "maya", label: MAYA_LABEL, x: 35, y: 44, place: "left", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA»." },
  ],
  puma: [
    { id: "cola", label: "Un dato sobre la cola del puma", x: 78, y: 47, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "La punta de su cola siempre es negra, aunque el resto del pelaje es de un solo color." },
    { id: "salto", label: "Un dato sobre el salto del puma", x: 50, y: 84, place: "above",
      sel: 'ellipse[fill="var(--paper)"]', anim: "pulse",
      fact: "Salta más de 5 metros hacia arriba y hasta 12 de largo." },
    { id: "maya", label: MAYA_LABEL, x: 41, y: 42, place: "right", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA»." },
  ],
  ocelote: [
    { id: "manchas", label: "Un dato sobre las manchas del ocelote", x: 50, y: 37, place: "below",
      sel: 'g[stroke-width="5"]', anim: "glow",
      fact: "Su dibujo de manchas es distinto en cada ocelote, como una huella digital." },
    { id: "ojos", label: "Un dato sobre los ojos del ocelote", x: 41, y: 41, place: "right",
      sel: "[data-eye]", all: true, anim: "blink",
      fact: "Con esos ojos tan grandes caza de noche; también trepa y nada muy bien." },
    { id: "maya", label: MAYA_LABEL, x: 76, y: 47, place: "left", needsMaya: true,
      sel: "[data-tail]", anim: "wag", fact: "En maya se le dice «MAYA»." },
  ],
  "iguana-verde": [
    { id: "cresta", label: "Un dato sobre la cresta de la iguana", x: 39, y: 30, place: "below",
      sel: 'path[fill="#3f8f4e"]', anim: "sway",
      fact: "Una fila de espinas le recorre todo el lomo, de la cabeza a la cola." },
    { id: "papada", label: "Un dato sobre la papada de la iguana", x: 24, y: 59, place: "right",
      sel: 'path[fill="#7bbf6a"]', nth: 3, anim: "pulse",
      fact: "Infla la bolsa de la barbilla para saludar o para asustar." },
    { id: "maya", label: MAYA_LABEL, x: 69, y: 74, place: "left", needsMaya: true,
      sel: "[data-tail]", anim: "wag", fact: "En maya se le dice «MAYA»." },
  ],
  "sapo-gigante": [
    { id: "glandulas", label: "Un dato sobre las glándulas del sapo", x: 33, y: 39, place: "left",
      sel: 'path[fill="#6b5f38"]', all: true, anim: "pulse",
      fact: "Las bolsas detrás de los ojos guardan un veneno que puede enfermar a un perro: se mira, no se toca." },
    { id: "maya", label: MAYA_LABEL, x: 50, y: 32, place: "below", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink",
      fact: "En maya se le dice «MAYA», y se le relaciona con la lluvia." },
  ],
  "cangrejo-violinista": [
    { id: "pinza", label: "Un dato sobre la pinza del cangrejo violinista", x: 18, y: 37, place: "right",
      sel: "[data-tail]", anim: "wag",
      fact: "El macho agita en el aire su pinza gigante, como si tocara un violín, para llamar la atención." },
    { id: "ojos", label: "Un dato sobre los ojos del cangrejo violinista", x: 50, y: 30, place: "below",
      sel: "[data-eye]", all: true, anim: "blink",
      fact: "Lleva los ojos muy en alto, sobre dos tallitos, por encima de todo el caparazón." },
    { id: "maya", label: MAYA_LABEL, x: 50, y: 58, place: "right", needsMaya: true,
      sel: 'path[fill="#7d5a3e"]', all: true, anim: "pulse", fact: "En maya se le dice «MAYA»." },
  ],
  rubia: [
    { id: "franja", label: "Un dato sobre la franja amarilla de la rubia", x: 50, y: 49, place: "below",
      sel: 'path[fill="var(--sun)"]', nth: 5, anim: "glow",
      fact: "La franja amarilla le cruza todo el cuerpo, de la nariz a la cola." },
    { id: "cardumen", label: "Un dato sobre cómo nada la rubia", x: 82, y: 49, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "Nada en cardúmenes enormes que giran juntos como una sola nube de plata y oro." },
  ],
  "coral-cerebro-de-roca": [
    { id: "surcos", label: "Un dato sobre los surcos del coral cerebro", x: 37, y: 42, place: "below",
      sel: 'g[stroke="#b8532f"]', anim: "pulse",
      fact: "Los surcos del domo parecen un laberinto o un cerebro gigante." },
    { id: "polipos", label: "Un dato sobre de qué se alimenta el coral", x: 55, y: 52, place: "right",
      sel: 'g[fill="var(--sun)"][stroke="none"]', anim: "glow",
      fact: "Es un animal solar: unas algas viven dentro de él y le hacen casi toda la comida con la luz." },
  ],
  "mariposa-pavo-real-blanca": [
    { id: "ocelos", label: "Un dato sobre los ojos de las alas", x: 39, y: 68, place: "right",
      sel: 'circle[fill="var(--coral)"]', all: true, anim: "glow",
      fact: "Los ojos de sus alas son falsos: un pájaro pica ahí y ella escapa con sólo un mordisco en el ala." },
    { id: "lineas", label: "Un dato sobre el dibujo de las alas", x: 61, y: 42, place: "left",
      sel: 'g[stroke="#9a7a58"]', anim: "quiver",
      fact: "Sus alas son blanco perla con líneas café y el borde ondulado, como encaje." },
    { id: "maya", label: MAYA_LABEL, x: 50, y: 38, place: "below", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink", fact: "En maya se le dice «MAYA» (mariposa)." },
  ],

  /* ---- 7 especies nuevas ---- */
  "mono-arana": [
    { id: "cola", label: "Un dato sobre la cola del mono araña", x: 74, y: 31, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "Usa la cola como una quinta mano; la punta no tiene pelo y lleva surcos, como las yemas de tus dedos." },
    { id: "manos", label: "Un dato sobre las manos del mono araña", x: 36, y: 21, place: "below",
      sel: 'path[fill="#25201c"]', anim: "pulse",
      fact: "No tiene pulgares: se cuelga con los cuatro dedos en forma de gancho y se lanza de árbol en árbol." },
    { id: "fruta", label: "Un dato sobre qué come el mono araña", x: 47, y: 74, place: "above",
      sel: 'ellipse[fill="#d9ad78"]', anim: "glow",
      fact: "Come sobre todo fruta y, al tragar las semillas enteras, va sembrando la selva lejos del árbol madre." },
  ],
  "flamenco-americano": [
    { id: "pico", label: "Un dato sobre el pico del flamenco", x: 33, y: 31, place: "right",
      sel: 'path[fill="var(--cacao)"][stroke="none"]', anim: "quiver",
      fact: "Come con la cabeza al revés dentro del agua, usando el pico curvo como un colador para atrapar comida del lodo." },
    { id: "plumas", label: "Un dato sobre el color rosa del flamenco", x: 47, y: 47, place: "right",
      sel: 'path[fill="#f38aa8"]', anim: "glow",
      fact: "El rosa le viene de lo que come: unos camaroncitos y algas diminutas le tiñen las plumas poco a poco." },
    { id: "pata", label: "Un dato sobre por qué el flamenco se para en una pata", x: 47, y: 78, place: "above",
      sel: 'path[stroke="#e05f86"]', all: true, anim: "sway",
      fact: "Se para en una sola pata durante horas para perder menos calor por el agua." },
  ],
  "abeja-melipona": [
    { id: "cuerpo", label: "Un dato sobre la abeja sin aguijón", x: 45, y: 66, place: "left",
      sel: 'path[fill="#c98a3c"]', anim: "pulse",
      fact: "Nació sin aguijón y guarda la miel en ollitas de cera, no en panales, dentro de un tronco hueco llamado jobón." },
    { id: "maya", label: MAYA_LABEL, x: 45, y: 22, place: "right", needsMaya: true,
      sel: "[data-eye]", all: true, anim: "blink",
      fact: "Los mayas la crían desde hace siglos y la llaman «MAYA», la “señora abeja”." },
  ],
  "boa-mazacuate": [
    { id: "lengua", label: "Un dato sobre la lengua de la boa", x: 10, y: 53, place: "right",
      sel: 'path[stroke="#b25436"][stroke-width="4"]', anim: "quiver",
      fact: "Saca la lengua partida en dos para “oler” el aire y saber qué hay a su alrededor." },
    { id: "manchas", label: "Un dato sobre el patrón de la boa", x: 47, y: 47, place: "above",
      sel: 'g[fill="#6e4b30"]', anim: "glow",
      fact: "El cuerpo color arena lleva manchas cafés en forma de silla de montar que se vuelven rojizas hacia la cola." },
    { id: "crias", label: "Un dato sobre las crías de la boa", x: 75, y: 80, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "No pone huevos: las crías nacen ya formadas, envueltas en una bolsita de la que salen solas." },
  ],
  "tortuga-carey": [
    { id: "caparazon", label: "Un dato sobre el caparazón de la tortuga carey", x: 47, y: 49, place: "below",
      sel: 'g[stroke="#7a4a1e"]', anim: "glow",
      fact: "Los escudos de su caparazón, color miel y café, se montan uno sobre otro como tejas y forman un borde aserrado." },
    { id: "pico", label: "Un dato sobre el pico de la tortuga carey", x: 11, y: 51, place: "right",
      sel: 'path[fill="var(--cacao)"][stroke="none"]', anim: "quiver",
      fact: "Con su pico curvo, como el de un halcón, saca esponjas de entre los corales para comer." },
    { id: "aleta", label: "Un dato sobre dónde anida la tortuga carey", x: 33, y: 67, place: "right",
      sel: "[data-tail]", anim: "wag",
      fact: "Cada verano, las hembras salen de noche a las playas de Campeche a cavar un hoyo y poner sus huevos." },
  ],
  caoba: [
    { id: "copa", label: "Un dato sobre lo alta que crece la caoba", x: 47, y: 26, place: "below",
      sel: 'path[fill="#4f9e5f"]', anim: "pulse",
      fact: "Es un árbol altísimo y derecho; quedan pocas caobas gigantes, casi todas en la selva protegida de Calakmul." },
    { id: "fruto", label: "Un dato sobre el fruto de la caoba", x: 70, y: 61, place: "left",
      sel: "[data-tail]", anim: "wag",
      fact: "Sus frutos son cápsulas de madera paradas en la rama; al abrirse sueltan semillas con un ala que cae girando como un helicóptero." },
    { id: "corteza", label: "Un dato sobre la madera de la caoba", x: 47, y: 65, place: "right",
      sel: 'g[stroke="#733f28"]', anim: "quiver",
      fact: "Su madera rojiza no se tuerce y huele bien; por eso se cortaron las caobas más grandes de Campeche para hacer muebles finos." },
  ],
  chicozapote: [
    { id: "madera", label: "Un dato sobre la madera del chicozapote", x: 47, y: 25, place: "below",
      sel: 'path[fill="#2f7d4a"]', anim: "pulse",
      fact: "Su madera es tan dura que las vigas de chicozapote de los templos de Calakmul llevan más de mil años sin pudrirse." },
    { id: "corte", label: "Un dato sobre el chicle del chicozapote", x: 47, y: 61, place: "left",
      sel: 'path[stroke="#5c4a35"]', anim: "quiver",
      fact: "Se le hacen cortes en zig-zag en la corteza y por ahí escurre el chicle, la lechita blanca que era la base de la goma de mascar." },
    { id: "fruto", label: "Un dato sobre el fruto del chicozapote", x: 70, y: 62, place: "right",
      sel: "[data-tail]", anim: "wag",
      fact: "Da una fruta redonda, café y muy dulce que se come fresca." },
  ],
};

/* Geometría de la notita relativa al punto. */
const GAP = 14; // distancia del centro del punto al borde de la notita
const PAD = 8; // margen mínimo dentro de la viñeta (deja libre el marco)
const DOT_R = 12; // radio efectivo del punto (para no taparlo con la notita)

type Box = { left: number; top: number };

/** Devuelve la esquina sup-izq de la notita para un lado dado. */
function corner(place: Place, cx: number, cy: number, bw: number, bh: number): Box {
  switch (place) {
    case "right":
      return { left: cx + GAP, top: cy - bh / 2 };
    case "left":
      return { left: cx - GAP - bw, top: cy - bh / 2 };
    case "below":
      return { left: cx - bw / 2, top: cy + GAP };
    case "above":
      return { left: cx - bw / 2, top: cy - GAP - bh };
  }
}

const OPPOSITE: Record<Place, Place> = {
  right: "left",
  left: "right",
  below: "above",
  above: "below",
};

export function SpeciesDiscover({
  slug,
  mayaName,
}: {
  slug: string;
  mayaName?: string | null;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [pos, setPos] = useState<Box | null>(null);
  const [reduced, setReduced] = useState(false);
  const uid = useId();

  const spots = (SPOTS[slug] ?? []).filter((s) => !s.needsMaya || mayaName);
  const openSpot = spots.find((s) => s.id === open) ?? null;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Cerrar al tocar fuera o con Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!overlayRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* Coloca la notita midiendo: elige el lado donde quepa entera dentro de la
     viñeta sin salirse ni tapar otro punto; si en ningún lado cabe del todo,
     usa el preferido y la pega al borde. */
  const place = useCallback(() => {
    const overlay = overlayRef.current;
    const bubble = bubbleRef.current;
    if (!overlay || !bubble || !openSpot) return;

    const W = overlay.clientWidth;
    const H = overlay.clientHeight;
    if (!W || !H) return;

    const cx = (openSpot.x / 100) * W;
    const cy = (openSpot.y / 100) * H;

    // La notita nunca más ancha de lo que cabe en la viñeta (importante en
    // móvil y viñetas pequeñas): así no se corta ni por ancho.
    const maxW = Math.min(190, Math.max(150, W - 60));
    bubble.style.maxWidth = `${maxW}px`;
    void bubble.offsetWidth; // reflow para medir con el nuevo ancho
    const bw = bubble.offsetWidth;
    const bh = bubble.offsetHeight;

    // El propio punto también cuenta como "no tapar" (más estricto), más el
    // resto de puntos con un margen.
    const avoid = [
      { x: cx, y: cy, m: DOT_R + 2 },
      ...spots
        .filter((s) => s.id !== openSpot.id)
        .map((s) => ({ x: (s.x / 100) * W, y: (s.y / 100) * H, m: DOT_R })),
    ];

    // Sujeta la caja dentro de la viñeta (siempre visible entera).
    const clamp = (b: Box): Box => ({
      left: Math.max(PAD, Math.min(b.left, W - PAD - bw)),
      top: Math.max(PAD, Math.min(b.top, H - PAD - bh)),
    });

    // Cuántos puntos toca la caja (el propio punto pesa más: nunca queremos
    // que la notita quede encima de su propio botón).
    const dotHits = (b: Box) =>
      avoid.reduce((n, d, i) => {
        const hit =
          d.x > b.left - d.m &&
          d.x < b.left + bw + d.m &&
          d.y > b.top - d.m &&
          d.y < b.top + bh + d.m;
        return hit ? n + (i === 0 ? 100 : 1) : n;
      }, 0);

    const order: Place[] = [
      openSpot.place,
      OPPOSITE[openSpot.place],
      ...(["right", "left", "below", "above"] as Place[]).filter(
        (p) => p !== openSpot.place && p !== OPPOSITE[openSpot.place],
      ),
    ];

    // Prueba cada lado (ya sujeto a la viñeta): el primero que no toque ningún
    // punto gana. Si todos tocan alguno, se queda con el que menos estorbe
    // (respetando el orden de preferencia en caso de empate).
    let chosen: Box | null = null;
    let bestScore = Infinity;
    for (const p of order) {
      const b = clamp(corner(p, cx, cy, bw, bh));
      const score = dotHits(b);
      if (score === 0) {
        chosen = b;
        break;
      }
      if (score < bestScore) {
        bestScore = score;
        chosen = b;
      }
    }
    if (!chosen) chosen = clamp(corner(order[0], cx, cy, bw, bh));

    chosen = { left: Math.round(chosen.left), top: Math.round(chosen.top) };
    setPos((prev) =>
      prev && prev.left === chosen!.left && prev.top === chosen!.top
        ? prev
        : chosen,
    );
  }, [openSpot, spots]);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    const overlay = overlayRef.current;
    if (!overlay || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => place());
    ro.observe(overlay);
    return () => ro.disconnect();
  }, [open, place]);

  // Micro-animación en la parte del SVG al abrir un punto
  useEffect(() => {
    if (!open || reduced) return;
    const spot = (SPOTS[slug] ?? []).find((s) => s.id === open);
    // el <svg> de la ilustración es hermano de esta capa (dentro del contenedor)
    const svg = overlayRef.current?.parentElement?.querySelector<SVGSVGElement>(
      'svg[aria-label^="Ilustración"]',
    );
    if (!spot || !svg) return;

    let els = Array.from(svg.querySelectorAll<SVGElement>(spot.sel));
    if (spot.nth != null) els = els[spot.nth] ? [els[spot.nth]] : [];
    else if (!spot.all) els = els.slice(0, 1);
    if (!els.length) return;

    const a = ANIM[spot.anim];
    for (const el of els) {
      el.style.animation = "none";
      void el.getBoundingClientRect(); // reflow para re-disparar
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = a.origin;
      el.style.animation = `${a.name} ${a.dur} ${a.ease} ${a.iters}`;
    }
    const clear = () => {
      for (const el of els) {
        el.style.animation = "";
        el.style.transformBox = "";
        el.style.transformOrigin = "";
      }
    };
    const t = window.setTimeout(clear, 1600);
    return () => {
      window.clearTimeout(t);
      clear();
    };
  }, [open, reduced, slug]);

  if (!spots.length) return null;

  const bubbleId = openSpot ? `${uid}-${openSpot.id}` : undefined;
  const bubbleText =
    openSpot && openSpot.needsMaya && mayaName
      ? openSpot.fact.replace("«MAYA»", mayaName)
      : openSpot?.fact;

  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-10">
      <style>{`
        @keyframes hp-quiver {
          0%,100% { transform: translate(0,0); }
          25% { transform: translate(-1.5px, 1px); }
          50% { transform: translate(1.5px, -1px); }
          75% { transform: translate(-1px, 1px); }
        }
        @keyframes hp-pulse {
          0% { transform: scale(1); }
          45% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .hp-dot {
          position: relative; width: 22px; height: 22px; border-radius: 9999px;
          border: 2px solid var(--line);
          background: color-mix(in srgb, var(--paper) 70%, transparent);
          display: grid; place-items: center; cursor: pointer;
          transition: transform .15s var(--ease-bounce), background-color .15s linear;
        }
        .hp-dot::before {
          content: ""; width: 6px; height: 6px; border-radius: 9999px; background: var(--rust);
        }
        .hp-dot::after {
          content: ""; position: absolute; inset: -3px; border-radius: 9999px;
          border: 2px solid var(--rust); opacity: 0;
          animation: hp-ping 2.6s ease-out infinite;
        }
        @keyframes hp-ping {
          0% { transform: scale(.72); opacity: .55; }
          70% { opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        .hp-dot:hover, .hp-dot:focus-visible { transform: scale(1.15); }
        .hp-dot[aria-expanded="true"] { background: var(--rust); }
        .hp-dot[aria-expanded="true"]::before { background: var(--paper); }
        .hp-bubble { animation: hp-pop .16s var(--ease-bounce) 1; }
        @keyframes hp-pop { from { opacity: 0; transform: scale(0.86); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .hp-dot::after { animation: none; opacity: .4; inset: -2px; }
          .hp-bubble { animation: none; }
        }
      `}</style>

      {spots.map((spot) => {
        const isOpen = open === spot.id;
        return (
          <div
            key={spot.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <button
              type="button"
              className="hp-dot pointer-events-auto"
              aria-label={spot.label}
              aria-expanded={isOpen}
              aria-controls={isOpen ? `${uid}-${spot.id}` : undefined}
              aria-describedby={isOpen ? `${uid}-${spot.id}` : undefined}
              onClick={() => setOpen((cur) => (cur === spot.id ? null : spot.id))}
            />
          </div>
        );
      })}

      {openSpot && (
        <span
          ref={bubbleRef}
          id={bubbleId}
          role="status"
          style={
            pos
              ? { left: pos.left, top: pos.top }
              : { left: -9999, top: -9999, visibility: "hidden" }
          }
          className={cn(
            "pointer-events-auto absolute z-20 w-max max-w-[190px] -rotate-2",
            "rounded-2xl border-[3px] border-line bg-sun px-3 py-2",
            "text-left text-[0.8rem] font-bold leading-snug text-sun-ink",
            "shadow-[var(--card-shadow)]",
            pos && "hp-bubble",
          )}
        >
          {bubbleText}
        </span>
      )}
    </div>
  );
}
