import type { ComponentType } from "react";

/* ============================================================
   BARRA DE CALIDAD DE UN MINIJUEGO (léela antes de escribir uno)
   ------------------------------------------------------------
   Las primeras versiones de Acecho silencioso y Cola de quinta mano
   fallaron por lo mismo: una píldora con circulitos/una barra de
   progreso flotando sobre la ilustración. Funcionaba, pero se veía un
   widget de formulario suelto, no parte del libro. No repitas eso.

   Antes de dar un minijuego por terminado, pruébalo tú mismo y
   pregúntate: si se lo enseño a un niño de 8 años sin explicarle
   nada, ¿entiende en 3 segundos qué tiene que hacer? ¿Se ve parte del
   cuento o un formulario? Si la respuesta no es un "sí" claro, sigue
   iterando antes de hacer commit.

   Reglas concretas:
   1. El escenario ES la ilustración real de la especie —
      <SpeciesScene slug="..." compact /> (de
      @/components/illustration/SpeciesIllustration), con su mismo
      marco/acuarela/fondo de hábitat. Nunca un icono nuevo en un
      círculo sobre una barra separada. Quien actúa es el propio
      dibujo: anima sus partes reales alcanzándolas por selector
      (`svg[aria-label^="Ilustración"] [data-tail]`, `[data-eye]`,
      o cualquier `path`/`ellipse` con un `fill`/`stroke` de paleta
      reconocible — el mismo truco que ya usa SpeciesDiscover), nunca
      un token abstracto aparte. Si de verdad hace falta un progreso
      visible, que sea un rastro temático pequeño (huellas, ramas: ver
      JaguarStalk/HowlerCall) — jamás una barra o pastilla de puntos.
   2. Una sola instrucción, de una línea: la `tagline` de este
      registro (se muestra en el encabezado del modal). El texto de
      estado dentro del minijuego (el `role="status"`) sólo reacciona
      al momento — "¡Bien!", "¡Te vio!", "¡Ganaste!" — nunca repite ni
      contradice la instrucción con otra frase distinta.
   3. Feedback con vida en cada acierto: rebote, destello, algo del
      fondo moviéndose (hojas, ondas), un cambio de color que además
      se mueve — no sólo un punto que pasa de gris a verde.
   4. Misma paleta y trazo que el resto del sitio: nada de colores ni
      formas nuevas fuera de las variables de tema; reutiliza las
      animaciones ya definidas en globals.css (`sway`, `blink`,
      `tail-wag`, `twinkle`) antes de inventar una nueva.
   5. Cada minijuego debe sentirse distinto de los demás en mecánica
      Y en sensación — no repitas la interacción de otro con otro
      dibujo encima (sostener/soltar del jaguar ≠ arrastrar del
      saraguato; el siguiente no debería ser un tercer sabor de lo
      mismo).
   ============================================================ */

/**
 * Contrato mínimo de un minijuego de especie. `SpeciesMinigame` monta el
 * modal (título, cerrar, backdrop) y le pasa sólo `reduced`; el resto del
 * contenido y su estado son responsabilidad del propio minijuego.
 */
export type MinigameProps = {
  /** true con prefers-reduced-motion: sin transiciones/animaciones decorativas. */
  reduced: boolean;
};

export type MinigameEntry = {
  /** Título corto, va en el encabezado del modal. */
  title: string;
  /**
   * La ÚNICA instrucción del minijuego, en una frase. Va bajo el título,
   * bien visible antes de jugar. El texto de estado del propio minijuego
   * nunca debe repetirla con otras palabras ni decir algo distinto.
   */
  tagline: string;
  Component: ComponentType<MinigameProps>;
};
