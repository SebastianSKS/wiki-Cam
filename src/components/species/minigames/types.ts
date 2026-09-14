import type { ComponentType } from "react";

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
  /** Frase de una línea bajo el título. */
  tagline: string;
  Component: ComponentType<MinigameProps>;
};
