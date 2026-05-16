"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppCurrencyData } from "@/lib/api";
import { currencyDefinitions, type CurrencyCode } from "@/lib/currencies";
import { formatDecimalInput, parseNumericInput } from "@/lib/calculations";
import { formatCurrency } from "@/lib/formatters";

type AlertDirection = "above" | "below";

interface ExchangeAlertsProps {
    currencies: Record<string, AppCurrencyData | null>;
}

interface BrowserAlert {
    id: string;
    currencyCode: CurrencyCode;
    target: string;
    direction: AlertDirection;
    createdAt: string;
    triggered: boolean;
}

const storageKey = "horaja-browser-alerts";

export default function ExchangeAlerts({ currencies }: ExchangeAlertsProps) {
    const [alerts, setAlerts] = useState<BrowserAlert[]>([]);
    const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
    const [target, setTarget] = useState("");
    const [direction, setDirection] = useState<AlertDirection>("above");
    const [status, setStatus] = useState<string | null>(null);
    const hydratedRef = useRef(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored) as BrowserAlert[];
                setAlerts(parsed.slice(0, 3));
            }
        } catch {
            setAlerts([]);
        } finally {
            hydratedRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (!hydratedRef.current) {
            return;
        }

        window.localStorage.setItem(storageKey, JSON.stringify(alerts));
    }, [alerts]);

    useEffect(() => {
        if (typeof window === "undefined" || Notification.permission !== "granted") {
            return;
        }

        setAlerts((current) => {
            let didTrigger = false;

            const nextAlerts = current.map((alert) => {
                if (alert.triggered) {
                    return alert;
                }

                const quote = currencies[alert.currencyCode];
                if (!quote) {
                    return alert;
                }

                const targetValue = parseNumericInput(alert.target);
                const matches = alert.direction === "above" ? quote.bid >= targetValue : quote.bid <= targetValue;

                if (!matches) {
                    return alert;
                }

                didTrigger = true;
                new Notification(`Alerta ${alert.currencyCode}/BRL`, {
                    body: `${alert.currencyCode} atingiu ${formatCurrency(quote.bid)} e cruzou seu alvo de ${formatCurrency(targetValue)}.`,
                    icon: "/favicon.ico",
                });

                return {
                    ...alert,
                    triggered: true,
                };
            });

            if (didTrigger) {
                setStatus("Um alerta de navegador foi disparado.");
            }

            return nextAlerts;
        });
    }, [currencies]);

    const alertCurrencyOptions = useMemo(
        () => currencyDefinitions.filter((currency) => currency.code !== "BRL"),
        [],
    );

    async function ensureBrowserPermission() {
        if (!("Notification" in window)) {
            throw new Error("Seu navegador não suporta alertas locais.");
        }

        if (Notification.permission === "granted") {
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            throw new Error("Permissão de notificação negada.");
        }
    }

    async function handleCreateAlert() {
        if (alerts.length >= 3) {
            setStatus("Limite de 3 alertas simultâneos atingido.");
            return;
        }

        const numericTarget = parseNumericInput(target);
        if (!Number.isFinite(numericTarget) || numericTarget <= 0) {
            setStatus("Informe um valor alvo válido.");
            return;
        }

        try {
            await ensureBrowserPermission();

            const alert: BrowserAlert = {
                id: crypto.randomUUID(),
                currencyCode,
                target,
                direction,
                createdAt: new Date().toISOString(),
                triggered: false,
            };

            setAlerts((current) => [...current, alert]);
            setTarget("");
            setStatus("Alerta salvo no navegador.");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Falha ao criar alerta.");
        }
    }

    function handleDeleteAlert(alert: BrowserAlert) {
        setAlerts((current) => current.filter((item) => item.id !== alert.id));
        setStatus("Alerta removido.");
    }

    return (
        <section className="glass-panel p-6 sm:p-8 rounded-[2rem] mt-12">
            <div className="flex flex-col gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Alertas de cotação</span>
                <h3 className="text-3xl font-black tracking-tight text-foreground">Crie alertas de navegador para acompanhar o preço alvo</h3>
                <p className="text-foreground/60">
                    Os alertas ficam salvos localmente neste navegador e disparam quando a cotação carregada no site cruza o alvo configurado. O limite é de 3 alertas ativos.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4">
                <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/70">
                    Moeda
                    <select
                        value={currencyCode}
                        onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                        className="min-h-[56px] rounded-2xl border border-card-border bg-foreground/5 px-4 text-base text-foreground outline-none"
                    >
                        {alertCurrencyOptions.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                                {currency.flag} {currency.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/70">
                    Valor alvo em BRL
                    <input
                        type="text"
                        inputMode="decimal"
                        value={target}
                        onChange={(e) => setTarget(formatDecimalInput(e.target.value))}
                        className="min-h-[56px] rounded-2xl border border-card-border bg-foreground/5 px-4 text-base text-foreground outline-none"
                        placeholder="5.40"
                    />
                </label>

                <div className="flex flex-col gap-2 text-sm font-semibold text-foreground/70">
                    Direção
                    <div className="flex gap-2 min-h-[56px]">
                        <button type="button" onClick={() => setDirection("above")} className={`rounded-2xl px-4 font-semibold ${direction === "above" ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70"}`}>
                            Acima
                        </button>
                        <button type="button" onClick={() => setDirection("below")} className={`rounded-2xl px-4 font-semibold ${direction === "below" ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70"}`}>
                            Abaixo
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={handleCreateAlert}
                    className="rounded-full bg-primary px-6 py-3 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors"
                >
                    Criar alerta no navegador
                </button>
                {status && <p className="text-sm text-primary">{status}</p>}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {alerts.map((alert) => {
                    const quote = currencies[alert.currencyCode];
                    return (
                        <div key={alert.id} className="rounded-3xl border border-card-border/60 bg-background/60 p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                        {alert.direction === "above" ? "Avisar acima" : "Avisar abaixo"}
                                    </div>
                                    <div className="mt-2 text-xl font-bold text-foreground">{alert.currencyCode}/BRL</div>
                                    <div className="mt-1 text-sm text-foreground/60">Atual: {quote ? formatCurrency(quote.bid) : "-"}</div>
                                </div>
                                <button type="button" onClick={() => handleDeleteAlert(alert)} className="text-sm font-semibold text-rose-600">
                                    Remover
                                </button>
                            </div>
                            <div className="mt-4 text-2xl font-black text-foreground">{formatCurrency(parseNumericInput(alert.target))}</div>
                            <div className="mt-2 text-sm text-foreground/50">
                                {alert.triggered ? "Disparado" : "Ativo"}
                            </div>
                        </div>
                    );
                })}
                {!alerts.length && (
                    <div className="rounded-3xl border border-card-border/60 bg-background/60 p-5 text-sm text-foreground/50">
                        Nenhum alerta ativo ainda.
                    </div>
                )}
            </div>
        </section>
    );
}
