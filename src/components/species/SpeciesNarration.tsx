"use client";

/* ============================================================
   ESCÚCHAME · narración en voz alta de la ficha
   ------------------------------------------------------------
   Pensado para niños de 3-5 años que todavía no leen: un botón
   grande que lee el texto amigable de la especie con la Web Speech
   API del navegador (sin servicio externo, sin API key). Prioriza
   una voz en español (es-MX si está disponible), a velocidad más
   lenta de lo normal. Nunca arranca sola — siempre la dispara un
   clic — y el mismo botón la detiene a la mitad. Si el navegador no
   soporta SpeechSynthesis, el componente no renderiza nada.
   ============================================================ */

import { useEffect, useState } from "react";
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

export function SpeciesNarration({ parts }: { parts: (string | null | undefined)[] }) {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const text = parts.filter((p): p is string => Boolean(p && p.trim())).join(" ");

  if (!supported || !text) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickSpanishVoice(voices);
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang ?? "es-MX";
    utter.rate = 0.85;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synth.speak(utter);
    setSpeaking(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
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
