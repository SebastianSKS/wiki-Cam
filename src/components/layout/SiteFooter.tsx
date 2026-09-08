import { Link } from "next-view-transitions";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-[1400px] gap-px bg-line sm:grid-cols-3">
        <div className="bg-paper p-5">
          <p className="catalog text-ink-faint">Registro</p>
          <p className="mt-2 font-display text-2xl leading-none">
            Wiki·Campeche
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            Archivo vivo de la biodiversidad endémica del estado de Campeche,
            México. Cada ficha es un espécimen catalogado.
          </p>
        </div>
        <div className="bg-paper p-5">
          <p className="catalog text-ink-faint">Fuentes</p>
          <ul className="mt-2 space-y-1 text-xs text-ink-soft">
            <li>Taxonomía · GBIF Backbone</li>
            <li>Estado de conservación · UICN Red List</li>
            <li>Estatus nacional · NOM-059-SEMARNAT-2010</li>
            <li>Municipios · Marco Geoestadístico INEGI</li>
          </ul>
        </div>
        <div className="bg-paper p-5">
          <p className="catalog text-ink-faint">Navegación</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>
              <Link className="hover:text-rust" href="/especies">
                Índice de especies →
              </Link>
            </li>
            <li>
              <Link className="hover:text-rust" href="/mapa">
                Mapa de distribución →
              </Link>
            </li>
            <li>
              <Link className="hover:text-rust" href="/acerca">
                Metodología →
              </Link>
            </li>
          </ul>
          <p className="catalog mt-6 text-[0.5625rem] text-ink-faint">
            MMXXV · {year} · Campeche, MX
          </p>
        </div>
      </div>
      <p className="mx-auto max-w-[1400px] border-t border-line px-5 py-3 text-[0.625rem] text-ink-faint">
        Ningún espécimen fue molestado en la elaboración de este catálogo.
        Ilustraciones y fotografías pendientes de curaduría.
      </p>
    </footer>
  );
}
