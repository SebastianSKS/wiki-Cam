import { Link } from "next-view-transitions";
import {
  DnaIcon,
  SproutIcon,
  PinIcon,
  MapIcon,
  BookIcon,
} from "@/components/ui/icons";

const SOURCES = [
  { Icon: BookIcon, text: "Fichas y nombres en maya · bio.campeche.gob.mx" },
  { Icon: DnaIcon, text: "Nombres y familias · GBIF" },
  { Icon: SproutIcon, text: "Cómo están · Lista Roja UICN" },
  { Icon: PinIcon, text: "Estatus en México · NOM-059-SEMARNAT" },
  { Icon: MapIcon, text: "Municipios · INEGI" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t-[3px] border-line bg-paper-2">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-12 sm:grid-cols-3 sm:px-8">
        <div>
          <p className="font-display text-2xl">
            Wiki<span className="text-rust">·</span>Campeche
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Un libro de cuentos sobre la fauna y la flora de Campeche, México:
            algunas especies sólo viven aquí, otras comparten su hogar con
            vecinos cercanos. Ilustrado a mano, para toda la familia.
          </p>
        </div>
        <div>
          <p className="hand text-lg text-ink-faint">¿De dónde salen los datos?</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {SOURCES.map((s) => (
              <li key={s.text} className="flex items-center gap-2">
                <s.Icon className="h-[18px] w-[18px] shrink-0" />
                {s.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="hand text-lg text-ink-faint">Pasar la página</p>
          <ul className="mt-2 space-y-1 text-sm font-bold">
            <li>
              <Link className="hover:text-rust" href="/especies">
                El índice de criaturas →
              </Link>
            </li>
            <li>
              <Link className="hover:text-rust" href="/mapa">
                El mapa de Campeche →
              </Link>
            </li>
            <li>
              <Link className="hover:text-rust" href="/acerca">
                De qué trata →
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-xs text-ink-faint">
            Hecho con cariño · {year} · Campeche, MX
          </p>
        </div>
      </div>
      <p className="mx-auto max-w-[1200px] border-t-[3px] border-dashed border-line px-4 py-3 text-xs text-ink-faint sm:px-8">
        Ningún animal fue molestado para hacer este libro. Las ilustraciones son
        dibujos, no fotos: así imaginamos a cada criatura.
      </p>
    </footer>
  );
}
