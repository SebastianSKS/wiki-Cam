"use client";

/* ============================================================
   ESCÚCHAME · narración en voz alta, apartado por apartado
   ------------------------------------------------------------
   Pensado para niños de 3-5 años que todavía no leen: un botón por
   cada bloque de texto de la ficha (historia, dato curioso, hábitat)
   que lee SOLO ese apartado con la Web Speech API del navegador (sin
   servicio externo, sin API key). Prioriza una voz en español
   (es-MX si está disponible), a velocidad más lenta de lo normal.
   Nunca arranca sola — siempre la dispara un clic — y el mismo botón
   la detiene a la mitad. Si el navegador no soporta SpeechSynthesis,
   el botón no se renderiza.

   Coordinación entre apartados: `SpeciesNarrationProvider` es la
   única fuente de verdad de "quién está hablando" y del
   `speechSynthesis` global (que es un singleton del navegador,
   compartido aunque haya varios botones). Cada botón sólo pregunta
   "¿el que habla soy yo?" — así, al pulsar uno nunca se encima con
   otro: el propio `speak()` cancela cualquier lectura en curso antes
   de empezar la nueva, y el estado de React (no un evento async del
   navegador) es lo que decide qué botón se ve en "Detener".

   Bug corregido: `getVoices()` devuelve `[]` en la primera carga en
   varios navegadores porque la lista llega de forma asíncrona (evento
   `voiceschanged`, que en Safari a veces ni dispara). El proveedor la
   pide de entrada, escucha `voiceschanged` y además reintenta un par
   de veces por si el evento no llega. Pase lo que pase, `speak()`
   nunca espera a que carguen las voces antes de hablar — si al
   momento del clic no hay ninguna en español, narra con la voz por
   defecto del navegador en vez de quedarse en silencio; esperar (con
   `await`) antes de llamar a `speak()` rompería además el gesto de
   usuario que Safari/iOS exige para permitir el audio.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { SpeakerIcon, StopIcon } from "@/components/ui/icons";

function pickSpanishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  return (
    voices.find((v) => v.lang.toLowerCase() === "es-mx") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("es"))
  );
}

type NarrationCtx = {
  supported: boolean;
  activeId: string | null;
  speak: (id: string, text: string) => void;
  stop: () => void;
};

const Ctx = createContext<NarrationCtx | null>(null);

export function SpeciesNarrationProvider({ children }: { children: ReactNode }) {
  const [supported, setSupported] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    setSupported(true);

    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
    };
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    // Safari no siempre dispara "voiceschanged": un par de reintentos
    // cortos cubre ese caso sin bloquear nada (no afecta al click).
    const retry1 = window.setTimeout(loadVoices, 300);
    const retry2 = window.setTimeout(loadVoices, 1200);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      window.clearTimeout(retry1);
      window.clearTimeout(retry2);
      synth.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setActiveId(null);
  }, []);

  const speak = useCallback((id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
    const synth = window.speechSynthesis;
    // Cancela cualquier lectura en curso (de este apartado o de otro) antes
    // de empezar: nunca hay dos voces sonando a la vez.
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const freshVoices = synth.getVoices();
    const voices = freshVoices.length ? freshVoices : voicesRef.current;
    const voice = pickSpanishVoice(voices);
    // Si aún no hay voces cargadas, se habla igual con la voz por defecto
    // del navegador: mejor eso que quedarse callado.
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang ?? "es-MX";
    utter.rate = 0.85;
    utter.onend = () => setActiveId((cur) => (cur === id ? null : cur));
    utter.onerror = () => setActiveId((cur) => (cur === id ? null : cur));

    synth.speak(utter);
    setActiveId(id);
  }, []);

  const value = useMemo(
    () => ({ supported, activeId, speak, stop }),
    [supported, activeId, speak, stop],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function SpeciesNarration({
  parts,
}: {
  parts: (string | null | undefined)[];
}) {
  const ctx = useContext(Ctx);
  const id = useId();
  const text = parts.filter((p): p is string => Boolean(p && p.trim())).join(" ");

  if (!ctx || !ctx.supported || !text) return null;

  const speaking = ctx.activeId === id;

  return (
    <button
      type="button"
      onClick={() => (speaking ? ctx.stop() : ctx.speak(id, text))}
      aria-pressed={speaking}
      className={cn(
        "inline-flex min-h-12 items-center gap-2 rounded-full border-[3px] border-line px-5 py-3 text-sm font-extrabold",
        "shadow-[var(--shadow-toy)] transition-transform duration-150 ease-[var(--ease-bounce)]",
        "hover:-translate-y-0.5 active:translate-y-1 active:scale-95 active:shadow-[var(--shadow-toy-press)]",
        speaking ? "bg-coral text-coral-ink" : "bg-sun text-sun-ink",
      )}
    >
      {speaking ? (
        <StopIcon className="h-5 w-5 shrink-0" />
      ) : (
        <SpeakerIcon className="h-5 w-5 shrink-0" />
      )}
      {speaking ? "Detener" : "Escúchame"}
    </button>
  );
}
