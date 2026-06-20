import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { SettingsProvider } from "@/components/SettingsProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Verified Property, Land & Cars in Kigali`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "houses for sale Kigali",
    "houses for rent Kigali",
    "land for sale Rwanda",
    "cars for sale Kigali",
    "property Rwanda",
    "Allan Multiservice Group",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Verified Property, Land & Cars`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSettings();
  const publicSettings = {
    phone: s.phone ?? SITE.phone,
    whatsapp: s.whatsapp ?? SITE.whatsapp,
    email: s.email ?? SITE.email,
  };
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh flex flex-col">
        <SettingsProvider value={publicSettings}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-[var(--color-sky)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SettingsProvider>
      </body>
    </html>
  );
}
