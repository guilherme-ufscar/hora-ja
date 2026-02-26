import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hora Já | Cotações e Horário",
  description: "Plataforma rápida e moderna para consultar o horário de Brasília e as principais cotações de moedas.",
  openGraph: {
    title: "Hora Já | Cotações e Horário",
    description: "Plataforma rápida e moderna para consultar o horário de Brasília e as principais cotações de moedas.",
    url: "https://horaja.com.br",
    siteName: "Hora Já",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hora Já | Cotações e Horário",
    description: "Consulte o horário de Brasília e converta moedas super rápido.",
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
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
