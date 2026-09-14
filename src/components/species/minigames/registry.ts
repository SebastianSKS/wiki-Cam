import type { MinigameEntry } from "./types";
import { JaguarStalkGame } from "./JaguarStalk";
import { HowlerCall } from "./HowlerCall";

/**
 * slug de especie → su minijuego propio. Sólo las especies listadas aquí
 * muestran el icono de "jugar" sobre su ilustración; para el resto,
 * `SpeciesMinigame` no monta nada (ni el icono, ni el clic, ni el modal).
 *
 * Para sumar una especie: escribe su componente junto a JaguarStalk.tsx en
 * este mismo directorio (recibe sólo `{ reduced }`, ver types.ts) y agrega
 * su entrada aquí. No actives ninguna que no tenga contenido real todavía.
 */
export const MINIGAMES: Record<string, MinigameEntry> = {
  jaguar: {
    title: "Acecho silencioso",
    tagline: "Así caza el jaguar en la selva: sin que lo escuchen.",
    Component: JaguarStalkGame,
  },
  "mono-aullador-negro": {
    title: "Cola de quinta mano",
    tagline: "Arrastra la cola de rama en rama por la copa de los árboles.",
    Component: HowlerCall,
  },
};
