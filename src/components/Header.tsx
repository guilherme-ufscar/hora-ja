"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full glass-header">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-white shadow-lg transition-transform group-hover:scale-105">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Hora<span className="text-primary">Já</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/dolar" className="hover:text-primary transition-colors">Dólar</Link>
                    <Link href="/euro" className="hover:text-primary transition-colors">Euro</Link>
                    <Link href="/libra" className="hover:text-primary transition-colors">Libra</Link>
                    <Link
                        href="/conversor"
                        className="rounded-full bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-colors"
                    >
                        Conversor
                    </Link>
                </nav>

                <div className="md:flex items-center md:hidden">
                    <button
                        className="text-foreground p-2 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-card-border shadow-2xl animate-in slide-in-from-top-2">
                    <nav className="flex flex-col px-6 py-8 gap-6 text-xl font-bold text-foreground items-center">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/dolar" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Cotação do Dólar</Link>
                        <Link href="/euro" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Cotação do Euro</Link>
                        <Link href="/libra" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Cotação da Libra</Link>
                        <Link
                            href="/conversor"
                            onClick={() => setIsMenuOpen(false)}
                            className="mt-4 w-full text-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-4 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                        >
                            Ir para o Conversor
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
