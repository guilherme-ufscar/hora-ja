"use client";

import { useState, useEffect, useCallback } from "react";

interface NotificationRule {
    id: number;
    type: string;
    value: string;
    currency_code: string;
    condition_type: string;
    condition_value: number;
    created_at: string;
}

interface NotificationBellProps {
    currencyCode?: string;
    currencyName?: string;
    currencyFlag?: string;
    className?: string;
}

export default function NotificationBell({
    currencyCode,
    currencyName,
    currencyFlag,
    className = ""
}: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [contactValue, setContactValue] = useState("");
    const [name, setName] = useState("");
    const [conditionType, setConditionType] = useState("price_above");
    const [conditionValue, setConditionValue] = useState("");
    const [existingRules, setExistingRules] = useState<NotificationRule[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const fetchRules = useCallback(async () => {
        if (!contactValue) {
            setExistingRules([]);
            return;
        }

        try {
            const res = await fetch(`/api/notifications?type=email&value=${encodeURIComponent(contactValue)}`);
            if (res.ok) {
                const data = await res.json();
                setExistingRules(data.rules || []);
            }
        } catch {
            // Ignore
        }
    }, [contactValue]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const resetForm = () => {
        setContactValue("");
        setName("");
        setConditionType("price_above");
        setConditionValue("");
        setExistingRules([]);
        setSuccess("");
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactValue || !conditionValue) {
            setError("Preencha todos os campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "email",
                    value: contactValue,
                    currency_code: currencyCode || "BTC",
                    condition_type: conditionType,
                    condition_value: parseFloat(conditionValue),
                    name: name || undefined,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Notificação configurada! Você receberá alertas quando a condição for atingida.");
                resetForm();
                fetchRules();
            } else {
                setError(data.error || "Erro ao configurar");
            }
        } catch {
            setError("Erro de conexão");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ruleId: number) => {
        try {
            await fetch(`/api/notifications?id=${ruleId}`, { method: "DELETE" });
            fetchRules();
        } catch {
            // Ignore
        }
    };

    const getConditionLabel = (rule: NotificationRule) => {
        const conditionLabels: Record<string, string> = {
            price_above: "acima de",
            price_below: "abaixo de",
            change_percent: "variação de",
        };
        const prefix = rule.condition_type === "change_percent" ? "" : "R$ ";
        const suffix = rule.condition_type === "change_percent" ? "%" : "";
        return `${conditionLabels[rule.condition_type] || rule.condition_type} ${prefix}${rule.condition_value}${suffix}`;
    };

    return (
        <>
            {/* Botão do ícone */}
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors ${className}`}
                title="Receber notificações"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="text-sm font-bold hidden sm:inline">Notificar</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
                    <div className="glass-panel p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-foreground">
                                {currencyFlag && currencyName ? `${currencyFlag} Notificar ${currencyName}` : "Configurar Notificações"}
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-foreground/50 hover:text-foreground text-2xl">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block">
                                    Seu email
                                </label>
                                <input
                                    type="email"
                                    value={contactValue}
                                    onChange={(e) => setContactValue(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block">
                                    Seu nome (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nome para identificação"
                                    className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="border-t border-card-border pt-4 mt-2">
                                <p className="text-sm text-foreground/60 mb-3">Quando deseja ser notificado?</p>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setConditionType("price_above")}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${conditionType === "price_above" ? "bg-primary text-white" : "bg-card-bg border border-card-border"}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                            <path d="m6 15 6-6 6 6"/>
                                        </svg>
                                        Subir
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConditionType("price_below")}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${conditionType === "price_below" ? "bg-primary text-white" : "bg-card-bg border border-card-border"}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                            <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                        Cair
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1 block">
                                        {conditionType === "change_percent" ? "Porcentagem (%)" : `Valor em R$`}
                                    </label>
                                    <input
                                        type="number"
                                        step={conditionType === "change_percent" ? "0.1" : "0.01"}
                                        value={conditionValue}
                                        onChange={(e) => setConditionValue(e.target.value)}
                                        placeholder={conditionType === "change_percent" ? "5" : "5.50"}
                                        required
                                        className="w-full rounded-xl bg-card-bg border border-card-border px-4 py-3 text-foreground focus:outline-none focus:border-primary"
                                    />
                                    <p className="text-xs text-foreground/40 mt-1">
                                        {conditionType === "change_percent"
                                            ? "Ex: 5 = notificar quando variar 5%"
                                            : conditionType === "price_above"
                                                ? "Ex: 6.00 = notificar quando passar de R$ 6,00"
                                                : "Ex: 5.00 = notificar quando cair para abaixo de R$ 5,00"
                                        }
                                    </p>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            {success && <p className="text-emerald-500 text-sm">{success}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-white font-bold py-4 px-6 hover:from-primary-hover hover:to-emerald-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary"
                            >
                                {loading ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin w-5 h-5">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                        </svg>
                                        <span>ATIVAR NOTIFICAÇÃO</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Regras existentes */}
                        {contactValue && existingRules.length > 0 && (
                            <div className="mt-6 border-t border-card-border pt-4">
                                <h3 className="text-sm font-bold text-foreground mb-3">Notificações ativas:</h3>
                                <div className="space-y-2">
                                    {existingRules.map((rule) => (
                                        <div key={rule.id} className="flex items-center justify-between p-3 bg-card-bg rounded-lg">
                                            <div>
                                                <div className="text-sm font-medium text-foreground">
                                                    {rule.currency_code} - {getConditionLabel(rule)}
                                                </div>
                                                <div className="text-xs text-foreground/50">
                                                    Notificar por email
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                className="text-red-500 hover:text-red-600 text-sm"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
