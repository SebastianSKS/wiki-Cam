import { Link } from "next-view-transitions";
import { ThemeToggle } from "./ThemeToggle";
import { StampCounter } from "./StampCounter"; // prototipo "Quiz del Explorador"
import { JaguarMark } from "@/components/ui/icons";

const NAV = [
  {
    href: "/especies",
    label: "Criaturas",
    hover: "hover:bg-jungle hover:text-jungle-ink",
  },
  { href: "/mapa", label: "Mapa", hover: "hover:bg-sky hover:text-sky-ink" },
  { href: "/acerca", label: "Acerca", hover: "hover:bg-coral hover:text-coral-ink" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-line bg-paper-2/95">
      {/* Alto FIJO (h-20 = 80px): ni el logo ni el swap tardío de webfonts
          pueden crecer la cabecera sticky y tapar el contenido de abajo. */}
      <div className="relative mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-2 px-2 sm:gap-3 sm:px-8">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-line bg-sun text-sun-ink transition-transform duration-200 ease-[var(--ease-bounce)] group-hover:-rotate-6 sm:h-[52px] sm:w-[52px]">
            <JaguarMark className="h-6 w-6 sm:h-8 sm:w-8" />
          </span>
          <span className="block leading-none">
            <span className="font-display block text-base leading-none sm:text-2xl">
              Wiki<span className="text-rust">·</span>Campeche
            </span>
            <span className="hand mt-1 hidden text-sm leading-none text-ink-faint sm:block">
              el libro de las criaturas
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border-[3px] border-line px-2 py-1.5 text-xs font-extrabold transition-transform duration-150 ease-[var(--ease-bounce)] hover:-translate-y-0.5 sm:px-4 sm:py-2.5 sm:text-sm ${item.hover}`}
            >
              {item.label}
            </Link>
          ))}
          <StampCounter />
          <ThemeToggle />
        </nav>

        {/* Filo de color tipo canto de libro: textura sutil, coherente con el
            sistema, para que la barra no se sienta hueca. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-sun/70"
        />
      </div>
    </header>
  );
}
