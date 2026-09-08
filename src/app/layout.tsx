import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito, Fraunces, Caveat } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WatercolorDefs } from "@/components/illustration/WatercolorDefs";
import { themeInitScript } from "@/components/layout/ThemeToggle";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wiki-campeche.local"),
  title: {
    default: "Wiki·Campeche — El libro de las criaturas de Campeche",
    template: "%s — Wiki·Campeche",
  },
  description:
    "Un libro de cuentos sobre los animales que sólo viven en Campeche, México. Ilustrado a mano, para niñas, niños y familias curiosas.",
  keywords: [
    "Campeche",
    "animales",
    "niños",
    "especies endémicas",
    "jaguar",
    "selva",
    "naturaleza",
  ],
  authors: [{ name: "Wiki·Campeche" }],
  openGraph: {
    title: "Wiki·Campeche — El libro de las criaturas de Campeche",
    description:
      "Un libro de cuentos sobre los animales que sólo viven en Campeche.",
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1c3e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html
        lang="es"
        className={`${display.variable} ${body.variable} ${serif.variable} ${hand.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-dvh">
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <a
            href="#contenido"
            className="skip-link catalog rounded-full border-[3px] border-rust bg-paper px-4 py-2 text-ink"
          >
            Saltar al contenido
          </a>
          <WatercolorDefs />
          <GrainOverlay />
          <SmoothScroll />
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
        </body>
      </html>
    </ViewTransitions>
  );
}
