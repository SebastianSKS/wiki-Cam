import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono, Newsreader } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { GrainOverlay } from "@/components/layout/GrainOverlay";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { themeInitScript } from "@/components/layout/ThemeToggle";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wiki-campeche.local"),
  title: {
    default: "Wiki·Campeche — Índice de especies endémicas",
    template: "%s — Wiki·Campeche",
  },
  description:
    "Catálogo editorial de la biodiversidad endémica del estado de Campeche, México. Fichas de espécimen con taxonomía, estado de conservación y distribución municipal.",
  keywords: [
    "Campeche",
    "especies endémicas",
    "biodiversidad",
    "jaguar",
    "Selva Maya",
    "conservación",
  ],
  authors: [{ name: "Wiki·Campeche" }],
  openGraph: {
    title: "Wiki·Campeche — Índice de especies endémicas",
    description:
      "Catálogo editorial de la biodiversidad endémica del estado de Campeche.",
    type: "website",
    locale: "es_MX",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1eadb" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html
        lang="es"
        className={`${display.variable} ${mono.variable} ${serif.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-dvh">
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <a href="#contenido" className="skip-link catalog border border-rust bg-paper px-3 py-2">
            Saltar al contenido
          </a>
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
