import type { MinigameEntry } from "./types";
import { JaguarStalkGame } from "./JaguarStalk";
import { HowlerCall } from "./HowlerCall";

/**
 * slug de especie → su minijuego propio. Sólo las especies listadas aquí
 * muestran el icono de "jugar" sobre su ilustración; para el resto,
 * `SpeciesMinigame` no monta nada (ni el icono, ni el clic, ni el modal).
 *
 * Para sumar una especie: escribe su componente junto a JaguarStalk.tsx /
 * HowlerCall.tsx en este mismo directorio (recibe sólo `{ reduced }`) y
 * agrega su entrada aquí. No actives ninguna que no tenga contenido real
 * todavía.
 *
 * ANTES DE ESCRIBIR UNO: lee la barra de calidad al inicio de types.ts.
 * Las primeras versiones de estos dos minijuegos se veían un widget de
 * formulario (píldora + circulitos) en vez de parte del libro — no lo
 * repitas en el próximo.
 */
export const MINIGAMES: Record<string, MinigameEntry> = {
  jaguar: {
    title: "Acecho silencioso",
    tagline: "Sostén para acercarte. Suelta si el jaguar se pone alerta.",
    Component: JaguarStalkGame,
  },
  "mono-aullador-negro": {
    title: "Cola de quinta mano",
    tagline: "Arrastra la cola hacia la rama; suéltala cuando brille.",
    Component: HowlerCall,
  },
};
