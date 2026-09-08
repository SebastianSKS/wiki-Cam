import { Link } from "next-view-transitions";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/especies", label: "Criaturas", hover: "hover:bg-jungle hover:text-jungle-ink" },
  { href: "/mapa", label: "Mapa", hover: "hover:bg-sky hover:text-sky-ink" },
  { href: "/acerca", label: "Acerca", hover: "hover:bg-coral hover:text-coral-ink" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-line bg-paper/95">
      {/* altura fija: el swap tardío de webfonts no puede crecer la cabecera
          sticky y tapar el contenido de abajo */}
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-line bg-sun text-lg transition-transform duration-200 ease-[var(--ease-bounce)] group-hover:-rotate-12"
          >
            🐆
          </span>
          <span className="block leading-none">
            <span className="font-display block text-lg leading-none">
              Wiki<span className="text-rust">·</span>Campeche
            </span>
            <span className="hand hidden text-sm leading-none text-ink-faint sm:block">
              el libro de las criaturas
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border-[3px] border-line px-3 py-1.5 text-[0.8rem] font-extrabold transition-transform duration-150 ease-[var(--ease-bounce)] hover:-translate-y-0.5 ${item.hover}`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
