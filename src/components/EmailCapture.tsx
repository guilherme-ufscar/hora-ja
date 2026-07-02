"use client";

import { useState } from "react";

interface EmailCaptureProps {
    title?: string;
    description?: string;
}

export default function EmailCapture({
    title = "Receba as melhores análises",
    description = "Cadastre seu email para receber análises exclusivas sobre câmbio, economia e investimentos."
}: EmailCaptureProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setStatus("error");
            setMessage("Por favor, insira um email válido.");
            return;
        }

        setStatus("loading");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name }),
            });

            if (res.ok) {
                setStatus("success");
                setMessage("Obrigado! Você receberá nossas análises em breve.");
                setEmail("");
                setName("");
            } else {
                const data = await res.json();
                setStatus("error");
                setMessage(data.error || "Erro ao cadastrar. Tente novamente.");
            }
        } catch {
            setStatus("error");
            setMessage("Erro de conexão. Tente novamente.");
        }
    }

    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-2xl mx-auto px-4">
                <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
                            Newsletter
                        </span>

                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-3">
                            {title}
                        </h2>

                        <p className="text-foreground/60 mb-8 max-w-md">
                            {description}
                        </p>

                        {status === "success" ? (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-emerald-500 font-semibold">{message}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        placeholder="Seu nome (opcional)"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-1 rounded-xl bg-background/50 border border-card-border px-5 py-3.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="flex-1 rounded-xl bg-background/50 border border-card-border px-5 py-3.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {status === "error" && message && (
                                    <p className="text-red-500 text-sm text-center">{message}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full rounded-xl bg-primary text-white font-bold py-4 px-8 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === "loading" ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Cadastrando...
                                        </span>
                                    ) : (
                                        "Quero me cadastrar"
                                    )}
                                </button>

                                <p className="text-xs text-foreground/40 text-center">
                                    Não compartilhamos seu email. Você pode cancelar a qualquer momento.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
