import type { MinigameEntry } from "./types";
// EN PAUSA — ver nota abajo. No se borran: quedan listos para retomar.
// import { JaguarStalkGame } from "./JaguarStalk";
// import { HowlerCall } from "./HowlerCall";

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
 *
 * EN PAUSA (jaguar y mono-aullador-negro): tras dos rediseños ninguno
 * llegó de verdad a la barra de calidad de arriba. En vez de seguir
 * iterando a ciegas, se desactivaron aquí — el jaguar y el saraguato se
 * comportan ahora igual que cualquier otra especie (sin icono, sin
 * clic especial en la ilustración). El código sigue completo y sin
 * tocar en JaguarStalk.tsx / HowlerCall.tsx (y sus iconos propios en
 * icons.tsx): para retomarlos con un concepto mejor pensado, vuelve a
 * importar el componente que corresponda y descomenta su entrada aquí
 * abajo (o reemplaza el contenido del archivo por el nuevo concepto,
 * como ya se hizo antes).
 */
export const MINIGAMES: Record<string, MinigameEntry> = {
  // jaguar: {
  //   title: "Acecho silencioso",
  //   tagline: "Sostén para acercarte. Suelta si el jaguar se pone alerta.",
  //   Component: JaguarStalkGame,
  // },
  // "mono-aullador-negro": {
  //   title: "Cola de quinta mano",
  //   tagline: "Arrastra la cola hacia la rama; suéltala cuando brille.",
  //   Component: HowlerCall,
  // },
};
