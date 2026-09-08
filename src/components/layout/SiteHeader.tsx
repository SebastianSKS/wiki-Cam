import { Link } from "next-view-transitions";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/especies", label: "Índice" },
  { href: "/mapa", label: "Mapa" },
  { href: "/acerca", label: "Acerca" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-stretch justify-between">
        <Link
          href="/"
          className="group flex shrink flex-col justify-center overflow-hidden border-r border-line px-3 py-2 transition-colors hover:bg-ink hover:text-paper sm:px-4 sm:py-2.5"
        >
          <span className="font-display whitespace-nowrap text-base leading-none sm:text-lg">
            Wiki<span className="text-rust group-hover:text-index">·</span>Campeche
          </span>
          <span className="catalog mt-1 hidden text-[0.5625rem] text-ink-faint group-hover:text-paper/70 sm:block">
            Índice de especies endémicas
          </span>
        </Link>

        <nav className="flex items-stretch">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="catalog flex items-center border-l border-line px-2.5 text-[0.5625rem] text-ink transition-colors hover:bg-jungle hover:text-jungle-ink sm:px-4 sm:text-[0.6875rem]"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center border-l border-line px-2 sm:px-3">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
