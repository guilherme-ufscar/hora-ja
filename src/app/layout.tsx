import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HoraJá Cambio | Cotações e conversor",
  description: "Plataforma para acompanhar cotações, comparar IOF, visualizar histórico cambial e consultar horários de mercados globais.",
  openGraph: {
    title: "HoraJá Cambio | Cotações e conversor",
    description: "Plataforma para acompanhar cotações, comparar IOF, visualizar histórico cambial e consultar horários de mercados globais.",
    url: SITE_URL,
    siteName: "HoraJá Cambio",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HoraJá Cambio | Cotações e conversor",
    description: "Consulte cotações em tempo real, IOF e histórico de moedas em uma experiência rápida e moderna.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="antialiased">
      <body
        className={`${inter.variable} font-sans bg-background text-foreground min-h-[100dvh] selection:bg-emerald-500 selection:text-white`}
      >
        <div className="relative flex min-h-[100dvh] flex-col">
          <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3621297766213698"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
