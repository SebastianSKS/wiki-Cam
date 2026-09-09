"use client";

/* ============================================================
   CONTADOR DE SELLOS · parte del prototipo "Quiz del Explorador"
   ------------------------------------------------------------
   Píldora discreta en la cabecera: "n/18 sellos". Lee de
   localStorage y se actualiza al vuelo cuando el quiz otorga
   un sello (evento propio) o cuando cambia en otra pestaña
   (evento `storage`).

   Se esconde mientras no haya ningún sello, para no meter
   ruido a quien llega por primera vez.

   Para quitarlo: borra este archivo y la línea
   `<StampCounter />` (+ su import) en `SiteHeader.tsx`.
   ============================================================ */

import { useEffect, useState } from "react";
import { readStamps, STAMP_EVENT, TOTAL_SELLOS } from "@/lib/stamps";
import { StarIcon } from "@/components/ui/icons";

export function StampCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setCount(readStamps().length);
    sync();
    window.addEventListener(STAMP_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STAMP_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // null = aún sin montar (evita desajuste de hidratación); 0 = nada que mostrar
  if (count == null || count === 0) return null;

  return (
    <span
      className="hidden items-center gap-1.5 rounded-full border-[3px] border-line bg-sun px-3 py-1.5 text-xs font-extrabold text-sun-ink sm:inline-flex"
      title="Sellos de explorador conseguidos en este navegador"
      aria-label={`${count} de ${TOTAL_SELLOS} sellos de explorador conseguidos`}
    >
      <StarIcon className="h-4 w-4" aria-hidden />
      {count}/{TOTAL_SELLOS}
    </span>
  );
}
