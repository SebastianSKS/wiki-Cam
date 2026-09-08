/** Overlay de textura impresa: grano fino + trama de medio tono. */
export function GrainOverlay() {
  return (
    <>
      <div className="grain-layer" aria-hidden />
      <div className="halftone-layer" aria-hidden />
    </>
  );
}
