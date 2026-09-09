"use client";

/* ============================================================
   QUIZ DEL EXPLORADOR · prototipo (sólo jaguar)
   ------------------------------------------------------------
   Componente aislado: todo el juego vive aquí. Se monta al
   final de la ficha con UNA línea condicionada al slug; si el
   slug no tiene preguntas (`QUIZZES`), no pinta nada.

   Para quitar la función por completo:
     1. borra este archivo
     2. borra `StampCounter.tsx` y `src/lib/stamps.ts`
     3. quita el import + bloque `<ExplorerQuiz .../>` en
        `src/app/especies/[slug]/page.tsx`
     4. quita el import + `<StampCounter />` en `SiteHeader.tsx`
   La ficha (y las otras 17) siguen igual sin tocar nada más.

   Las preguntas están escritas a mano a partir de los datos
   reales del jaguar (hábitat, Medidor de Cuidado, Carnet y
   fun_fact). Si la mecánica funciona, el siguiente paso sería
   generarlas desde la base para las 18 especies.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import type { SpeciesWithRegions } from "@/lib/queries";
import { addStamp, hasStamp, readStamps, TOTAL_SELLOS } from "@/lib/stamps";
import { StarIcon } from "@/components/ui/icons";

type Question = {
  prompt: string;
  options: string[];
  correct: number;
  /** Empujoncito de ánimo cuando fallan (nunca punitivo). */
  nudge: string;
};

const QUIZZES: Record<string, Question[]> = {
  jaguar: [
    {
      prompt: "¿Dónde se esconde el jaguar en Campeche?",
      options: [
        "En la selva, entre los árboles grandes",
        "En el mar, nadando entre los corales",
        "En el desierto, debajo de la arena",
      ],
      correct: 0,
      nudge: "Piensa en Calakmul y la Selva Maya: pura selva alta y verde.",
    },
    {
      prompt: "El Medidor de Cuidado del jaguar dice que…",
      options: [
        "le sobra de todo y no necesita ninguna ayuda",
        "hay que estar pendientes: quedan menos y su selva se hace pequeña",
        "ya se extinguió y no queda ni uno solo",
      ],
      correct: 1,
      nudge:
        "Todavía no está en peligro, pero va camino de estarlo si pierde selva. Es una señal de alerta temprana.",
    },
    {
      prompt: "En su Carnet de Exploración, ¿cómo se llama el jaguar en maya?",
      options: ["Áayin", "Tzimín", "Balam"],
      correct: 2,
      nudge:
        "Áayin es el cocodrilo y tzimín el tapir. El jaguar es Balam, un nombre que aparece hasta en ciudades mayas.",
    },
    {
      prompt: "¿Qué tienen de especial las manchas de cada jaguar?",
      options: [
        "Son únicas: no hay dos jaguares con el mismo dibujo, como nuestras huellas",
        "Todos los jaguares tienen exactamente las mismas manchas",
        "Se les borran en época de lluvias y vuelven a salir",
      ],
      correct: 0,
      nudge: "Cada jaguar lleva su propio patrón de manchas, irrepetible.",
    },
  ],
};

const DOT = "h-2.5 w-2.5 rounded-full border-2 border-line";

export function ExplorerQuiz({
  species,
  number,
}: {
  species: SpeciesWithRegions;
  number: number;
}) {
  const questions = QUIZZES[species.slug];

  const [chosen, setChosen] = useState<(number | null)[]>(() =>
    (questions ?? []).map(() => null),
  );
  const [solved, setSolved] = useState<boolean[]>(() =>
    (questions ?? []).map(() => false),
  );
  const [live, setLive] = useState("");
  const [hadBefore, setHadBefore] = useState(false);
  const [stampCount, setStampCount] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  const allSolved = questions != null && solved.every(Boolean);

  // Al montar: ¿ya tenía el sello de esta criatura? (para el texto del final)
  useEffect(() => {
    if (!questions) return;
    setHadBefore(hasStamp(species.slug));
  }, [species.slug, questions]);

  // Al completar: guarda el sello y lleva el foco al aviso final.
  useEffect(() => {
    if (!allSolved) return;
    addStamp(species.slug);
    setStampCount(readStamps().length);
    setLive(
      `Completaste el quiz. Conseguiste el sello de la criatura número ${number}.`,
    );
    bannerRef.current?.focus();
  }, [allSolved, species.slug, number]);

  if (!questions) return null;

  function pick(qi: number, oi: number) {
    if (solved[qi]) return;
    setChosen((prev) => prev.map((v, i) => (i === qi ? oi : v)));
    if (oi === questions![qi].correct) {
      setSolved((prev) => prev.map((v, i) => (i === qi ? true : v)));
      setLive("¡Muy bien! Respuesta correcta.");
    } else {
      setLive("Casi. Lee la pista y prueba con otra.");
    }
  }

  const solvedCount = solved.filter(Boolean).length;

  return (
    <section
      aria-labelledby="eq-title"
      className="mx-auto mt-16 max-w-[880px] border-t-[3px] border-dashed border-line pt-10"
    >
      <style>{`
        @keyframes eq-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.05); }
          70% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        @keyframes eq-nudge {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes eq-stamp-in {
          0% { transform: scale(0.4) rotate(-16deg); opacity: 0; }
          60% { transform: scale(1.12) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(-5deg); opacity: 1; }
        }
        .eq-pop { animation: eq-pop .45s var(--ease-bounce) 1; }
        .eq-nudge { animation: eq-nudge .3s ease-in-out 1; }
        .eq-stamp-in { animation: eq-stamp-in .6s var(--ease-bounce) 1; }
        @media (prefers-reduced-motion: reduce) {
          .eq-pop, .eq-nudge, .eq-stamp-in { animation: none !important; }
        }
      `}</style>

      <p className="hand text-xl text-ink-soft">un juego rápido</p>
      <h2 id="eq-title" className="font-display text-[clamp(1.6rem,4vw,2.25rem)]">
        Pon a prueba lo que aprendiste
      </h2>
      <p className="mt-2 max-w-prose text-ink-soft">
        Cuatro preguntas sobre {species.commonNameEs}. No hay prisa ni
        calificación: si fallas, lo intentas otra vez. Al terminar te llevas un
        sello para tu carnet.
      </p>

      {hadBefore && !allSolved && (
        <p className="hand mt-3 text-lg text-jungle-deep">
          Ya conseguiste este sello antes — puedes volver a jugar.
        </p>
      )}

      {/* Progreso, sin marcador de aciertos: sólo cuántas llevas resueltas */}
      <div
        className="mt-5 flex items-center gap-2"
        aria-label={`${solvedCount} de ${questions.length} preguntas resueltas`}
      >
        {questions.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={`${DOT} ${solved[i] ? "bg-jungle" : "bg-paper"}`}
          />
        ))}
        <span className="hand ml-1 text-lg text-ink-faint">
          {solvedCount} / {questions.length}
        </span>
      </div>

      <ol className="mt-6 space-y-5">
        {questions.map((q, qi) => {
          const isSolved = solved[qi];
          const pickIdx = chosen[qi];
          const wrongPick = pickIdx != null && !isSolved;
          return (
            <li
              key={qi}
              className="rounded-[26px] border-[3px] border-line bg-paper-2 p-5 shadow-[var(--card-shadow)]"
            >
              <p className="hand text-lg text-ink-faint">Pregunta {qi + 1}</p>
              <p id={`eq-q${qi}`} className="mt-0.5 font-display text-xl">
                {q.prompt}
              </p>

              <div
                role="group"
                aria-labelledby={`eq-q${qi}`}
                className="mt-3 grid gap-2.5"
              >
                {q.options.map((opt, oi) => {
                  const chosenHere = pickIdx === oi;
                  const showCorrect = isSolved && oi === q.correct;
                  const showWrong = wrongPick && chosenHere;
                  const lockOthers = isSolved && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => pick(qi, oi)}
                      disabled={lockOthers}
                      aria-pressed={chosenHere}
                      className={[
                        "w-full rounded-2xl border-[3px] px-4 py-3 text-left font-bold",
                        "shadow-[var(--shadow-sticker)] transition-transform duration-150 ease-[var(--ease-bounce)]",
                        "hover:-translate-y-0.5 active:translate-y-0.5",
                        "focus-visible:outline-[3px] focus-visible:outline-offset-2",
                        showCorrect
                          ? "eq-pop border-line bg-jungle text-jungle-ink"
                          : showWrong
                            ? "eq-nudge border-coral bg-paper text-ink"
                            : "border-line bg-paper text-ink",
                        lockOthers ? "opacity-45" : "",
                      ].join(" ")}
                    >
                      <span className="mr-2" aria-hidden>
                        {showCorrect ? "✓" : showWrong ? "↻" : "○"}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isSolved && (
                <p className="mt-3 font-bold text-jungle-deep">
                  {qi === 2
                    ? "¡Exacto! Balam quiere decir jaguar en maya."
                    : "¡Exacto! Lo tenías en esta página."}
                </p>
              )}
              {wrongPick && (
                <p className="mt-3 rounded-2xl border-[3px] border-dashed border-line bg-paper px-4 py-2 text-sm text-ink-soft">
                  <span className="hand mr-1 text-base text-rust">
                    inténtalo otra vez:
                  </span>
                  {q.nudge}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {/* Aviso final + sello. role=status + foco para lectores de pantalla. */}
      <div
        ref={bannerRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="mt-8 outline-none"
      >
        {allSolved && (
          <div className="flex flex-col items-center gap-4 rounded-[28px] border-[3px] border-line bg-sun p-6 text-center text-sun-ink shadow-[var(--card-shadow)] sm:flex-row sm:text-left">
            <svg
              viewBox="0 0 100 100"
              className="eq-stamp-in h-24 w-24 shrink-0"
              style={{ color: "var(--rust)" }}
              aria-hidden
            >
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <text x="50" y="40" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="15" fill="currentColor">
                Nº {number}
              </text>
              <text x="50" y="58" textAnchor="middle" fontFamily="var(--font-body)" fontWeight="800" fontSize="8" letterSpacing="1" fill="currentColor">
                SELLO
              </text>
              <path d="M50 64l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="currentColor" />
            </svg>
            <div>
              <p className="font-display text-2xl leading-tight">
                {hadBefore
                  ? `Volviste a completar el quiz de ${species.commonNameEs}`
                  : `¡Sello de la criatura n.º ${number} conseguido!`}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-bold sm:justify-start">
                <StarIcon className="h-4 w-4" />
                Guardado en este navegador · {stampCount} / {TOTAL_SELLOS} sellos
              </p>
              <p className="mt-1 text-sm">
                Lo verás en el contador de la cabecera. Cuando haya más criaturas
                con juego, podrás completar el carnet entero.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Región viva para anunciar cada acierto/fallo sin mover el foco. */}
      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </section>
  );
}
