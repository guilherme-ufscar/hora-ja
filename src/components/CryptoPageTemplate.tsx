"use client";

import { useState, useEffect, useCallback } from "react";
import NotificationInfo from "@/components/NotificationInfo";
import AffiliateSection from "@/components/AffiliateSection";
import { cryptoAffiliatePartners } from "@/lib/site-content";

interface CryptoData {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        color: string;
    }[];
}

const CRYPTO_CONFIG: Record<string, { name: string; icon: string; description: string; geckoId: string; about: string[] }> = {
    BTC: {
        name: "Bitcoin",
        icon: "₿",
        description: "A primeira e mais valiosa criptomoeda do mundo, criada em 2009 por um desconhecido sob o pseudônimo Satoshi Nakamoto.",
        geckoId: "bitcoin",
        about: [
            "O Bitcoin foi a primeira criptomoeda a resolver o problema do gasto duplo sem depender de um banco ou intermediário central, usando uma rede pública de computadores e o mecanismo de consenso chamado proof-of-work. Seu fornecimento é limitado a 21 milhões de unidades, característica que costuma ser citada como argumento para o apelido de 'ouro digital'.",
            "A cada quatro anos, aproximadamente, ocorre o chamado halving, que reduz pela metade a recompensa paga aos mineradores. Historicamente esses eventos concentram bastante atenção do mercado por reduzirem o ritmo de emissão de novas moedas.",
            "No Brasil, o preço do BTC em reais reflete tanto a cotação internacional em dólar quanto a variação do próprio USD/BRL, por isso o valor em BRL pode se mover mesmo quando o preço em dólar está estável. Por ser um ativo de alta volatilidade, oscilações de dois dígitos em poucos dias não são incomuns.",
        ],
    },
    ETH: {
        name: "Ethereum",
        icon: "Ξ",
        description: "Plataforma descentralizada que permite a criação de contratos inteligentes e aplicações descentralizadas (dApps).",
        geckoId: "ethereum",
        about: [
            "O Ethereum foi lançado em 2015 e ampliou o conceito introduzido pelo Bitcoin ao permitir contratos inteligentes — programas que executam regras automaticamente na blockchain. Isso o tornou a base de boa parte do ecossistema de finanças descentralizadas (DeFi), tokens e NFTs.",
            "Em 2022, a rede migrou do modelo de mineração (proof-of-work) para o proof-of-stake, no evento conhecido como 'The Merge', reduzindo drasticamente seu consumo de energia e mudando a forma como novas moedas são emitidas e validadas.",
            "O ether (ETH) é usado para pagar as taxas de transação da rede, chamadas de gas, cujo valor varia conforme a demanda. Como qualquer criptoativo, seu preço em reais combina a cotação global e a variação do dólar frente ao real, e está sujeito a forte volatilidade.",
        ],
    },
    SOL: {
        name: "Solana",
        icon: "◎",
        description: "Blockchain de alta performance focado em escalabilidade e baixas taxas de transação.",
        geckoId: "solana",
        about: [
            "A Solana é uma blockchain projetada para alta velocidade e taxas baixas, capaz de processar um grande número de transações por segundo. Para isso, combina o mecanismo de proof-of-stake com uma técnica própria chamada proof-of-history, que ajuda a ordenar as transações de forma eficiente.",
            "Esse foco em desempenho fez da Solana uma das redes mais usadas para aplicações que exigem muitas transações rápidas e baratas, como jogos, marketplaces de NFT e projetos de finanças descentralizadas.",
            "Em contrapartida, a rede já passou por episódios de instabilidade e interrupções que geraram debate sobre o equilíbrio entre velocidade e descentralização. O preço do SOL em reais acompanha a cotação internacional e o câmbio do dólar, com volatilidade típica de criptoativos.",
        ],
    },
    XRP: {
        name: "Ripple",
        icon: "✕",
        description: "Protocolo de pagamento digital voltado a transações rápidas e de baixo custo entre instituições financeiras.",
        geckoId: "ripple",
        about: [
            "O XRP é o ativo digital associado ao XRP Ledger, uma rede criada com foco em pagamentos e transferências internacionais rápidas e de baixo custo entre instituições. Diferente do Bitcoin, não usa mineração: as transações são validadas por um conjunto de servidores independentes.",
            "A empresa Ripple, ligada ao projeto, promove o uso do XRP como ponte para conversão entre moedas em remessas internacionais, um caso de uso que a diferencia de criptomoedas mais voltadas a reserva de valor ou contratos inteligentes.",
            "O XRP esteve no centro de uma longa disputa judicial nos Estados Unidos sobre sua classificação regulatória, tema que historicamente influenciou bastante seu preço. Como os demais criptoativos, seu valor em reais depende da cotação global e do dólar, com alta volatilidade.",
        ],
    },
    ADA: {
        name: "Cardano",
        icon: "₳",
        description: "Blockchain de terceira geração baseado em provas acadêmicas e pesquisa peer-reviewed.",
        geckoId: "cardano",
        about: [
            "A Cardano é uma blockchain de proof-of-stake conhecida por sua abordagem baseada em pesquisa acadêmica e revisão por pares antes de implementar novas funcionalidades. Seu ativo nativo é o ADA, nome inspirado na matemática Ada Lovelace.",
            "O projeto é desenvolvido em fases com nomes de figuras históricas e busca oferecer contratos inteligentes e escalabilidade com forte ênfase em segurança e sustentabilidade da rede.",
            "Por priorizar validação acadêmica, a evolução da Cardano tende a ser mais gradual do que a de concorrentes. O preço do ADA em reais segue a cotação internacional combinada à variação do dólar, e mantém a volatilidade característica do mercado cripto.",
        ],
    },
    DOT: {
        name: "Polkadot",
        icon: "●",
        description: "Protocolo que conecta diferentes blockchains, permitindo a interoperabilidade entre redes.",
        geckoId: "polkadot",
        about: [
            "A Polkadot foi criada para resolver um problema específico do setor: permitir que diferentes blockchains se comuniquem e troquem informações entre si, algo conhecido como interoperabilidade. Seu ativo nativo é o DOT.",
            "A rede usa uma arquitetura em que uma cadeia principal (Relay Chain) coordena a segurança de várias cadeias paralelas especializadas, chamadas parachains, que podem ser desenvolvidas por projetos independentes.",
            "O DOT também é usado em governança e no mecanismo de staking que dá segurança à rede. Assim como os demais criptoativos, seu preço em reais combina a cotação global e o câmbio do dólar, estando sujeito a oscilações expressivas.",
        ],
    },
};

interface CryptoPageTemplateProps {
    symbol: string;
}

export default function CryptoPageTemplate({ symbol }: CryptoPageTemplateProps) {
    const config = CRYPTO_CONFIG[symbol];
    const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<"7" | "30" | "90" | "365">("30");
    const [periodStats, setPeriodStats] = useState<{ low: number; high: number; change: number } | null>(null);

    // Buscar dados reais da API CoinGecko via proxy interno
    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const days = period;
            const res = await fetch(`/api/crypto/prices?action=history&symbol=${symbol}&days=${days}`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error("Erro ao buscar histórico");
            const history = await res.json();

            const lastIdx = history.prices.length - 1;
            const change = (history.prices[lastIdx] - history.prices[0]) / history.prices[0] * 100;
            const periodPrices = history.prices;

            setCryptoData({
                symbol,
                name: config.name,
                price: periodPrices[lastIdx],
                change24h: change,
                high24h: Math.max(...periodPrices.slice(-Math.min(30, periodPrices.length))),
                low24h: Math.min(...periodPrices.slice(-Math.min(30, periodPrices.length))),
                volume24h: 0,
            });

            // Calcular estatísticas do período
            setPeriodStats({
                low: Math.min(...periodPrices),
                high: Math.max(...periodPrices),
                change,
            });

            // Amostra de até 60 pontos para o gráfico
            const targetPoints = 60;
            const step = Math.max(1, Math.floor(history.prices.length / targetPoints));
            const sample: { label: string; price: number }[] = [];
            for (let i = 0; i < history.prices.length; i += step) {
                sample.push({ label: history.labels[i], price: history.prices[i] });
            }
            if (sample[sample.length - 1].label !== history.labels[lastIdx]) {
                sample.push({ label: history.labels[lastIdx], price: history.prices[lastIdx] });
            }

            setChartData({
                labels: sample.map(s => s.label),
                datasets: [{
                    label: config.name,
                    data: sample.map(s => s.price),
                    color: "#10b981",
                }],
            });
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            // Fallback com dados simulados
            const basePrice: Record<string, number> = {
                BTC: 635000, ETH: 18500, SOL: 145, XRP: 3.50, ADA: 2.85, DOT: 42,
            };
            const price = basePrice[symbol] || 1000;
            const labels: string[] = [];
            const prices: number[] = [];
            const daysNum = parseInt(period);
            for (let i = daysNum; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }));
                prices.push(price * (0.9 + Math.random() * 0.2));
            }
            setCryptoData({
                symbol, name: config.name, price: prices[prices.length - 1],
                change24h: (Math.random() - 0.5) * 10,
                high24h: Math.max(...prices.slice(-30)), low24h: Math.min(...prices.slice(-30)), volume24h: 0,
            });
            setPeriodStats({
                low: Math.min(...prices),
                high: Math.max(...prices),
                change: (prices[prices.length - 1] - prices[0]) / prices[0] * 100,
            });
            setChartData({ labels, datasets: [{ label: config.name, data: prices, color: "#10b981" }] });
        } finally {
            setLoading(false);
        }
    }, [symbol, config.name, period]);

    useEffect(() => {
        fetchData();
        // Atualiza a cada 60 segundos (dinâmico)
        const interval = setInterval(fetchData, 60_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const formatPrice = (price: number) => {
        if (price >= 1000) {
            return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
        return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 4 });
    };

    const formatLargeNumber = (num: number) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
        if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
        if (num >= 1000) return (num / 1000).toFixed(2) + "K";
        return num.toFixed(2);
    };

    if (!config) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-xl text-foreground/60">Criptomoeda não encontrada.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <section className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
                <div>
                    <section className="flex flex-col items-center text-center mb-10 sm:mb-16 animate-in fade-in zoom-in duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/50"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest uppercase">Criptoativo</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
                            {config.icon} {config.name}
                        </h1>
                        <p className="text-lg text-foreground/60 max-w-2xl">
                            {config.description}
                        </p>
                    </section>

                    <NotificationInfo
                        currencyCode={symbol}
                        currencyName={config.name}
                        currencyFlag={config.icon}
                    />

                    <section className="glass-panel p-8 sm:p-12 rounded-[3rem] mb-16 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl shadow-emerald-900/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>

                        <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
                            <div className="text-left flex flex-col items-center sm:items-start">
                                <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Valor em BRL</span>
                                {loading ? (
                                    <div className="h-16 w-48 bg-card-bg rounded animate-pulse"></div>
                                ) : (
                                    <div className="text-6xl sm:text-7xl font-black tracking-tighter tabular-nums drop-shadow-sm text-foreground">
                                        {formatPrice(cryptoData?.price || 0)}
                                    </div>
                                )}
                                <div className="mt-4 flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                                        (cryptoData?.change24h || 0) >= 0
                                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                            : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                                    }`}>
                                        {(cryptoData?.change24h || 0) >= 0 ? "↑" : "↓"} {Math.abs(cryptoData?.change24h || 0).toFixed(2)}%
                                    </span>
                                    <span className="text-sm font-medium text-foreground/50">24h</span>
                                </div>
                            </div>

                            <div className="w-full sm:w-px h-px sm:h-32 bg-card-border/50"></div>

                            <div className="text-left flex flex-col items-center sm:items-end gap-2">
                                <span className="text-sm font-medium text-foreground/50">Máxima 24h</span>
                                <span className="text-lg font-semibold text-foreground/80 bg-foreground/5 px-4 py-2 rounded-2xl">
                                    {formatPrice(cryptoData?.high24h || 0)}
                                </span>
                                <span className="text-sm font-medium text-foreground/50">Mínima 24h</span>
                                <span className="text-lg font-semibold text-foreground/80 bg-foreground/5 px-4 py-2 rounded-2xl">
                                    {formatPrice(cryptoData?.low24h || 0)}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">Histórico de preço</h2>
                                <p className="text-sm text-foreground/60 mt-1">Compare o comportamento em diferentes janelas de tempo.</p>
                            </div>
                            <div className="flex gap-2 p-1 bg-card-bg rounded-xl">
                                {(["7", "30", "90", "365"] as const).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setPeriod(d)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${period === d ? "bg-primary text-white" : "text-foreground/60 hover:text-foreground"}`}
                                    >
                                        {d === "7" ? "7 dias" : d === "30" ? "30 dias" : d === "90" ? "90 dias" : "365 dias"}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-4">
                            <div className="glass-panel p-6 rounded-[2rem]">
                                {loading ? (
                                    <div className="h-64 bg-card-bg rounded-xl animate-pulse"></div>
                                ) : chartData && chartData.datasets[0].data.length > 0 ? (
                                    <div className="h-64 w-full flex items-end gap-[2px]">
                                        {chartData.datasets[0].data.map((price, i) => {
                                            const max = Math.max(...chartData.datasets[0].data);
                                            const min = Math.min(...chartData.datasets[0].data);
                                            const range = max - min || 1;
                                            const height = ((price - min) / range) * 100;
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex-1 rounded-t-sm transition-colors"
                                                    style={{
                                                        height: `${Math.max(height, 8)}%`,
                                                        minWidth: '2px',
                                                        background: `linear-gradient(to top, #10b981, #34d399)`,
                                                    }}
                                                    title={`${chartData.labels[i]}: ${formatPrice(price)}`}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-foreground/40">
                                        Sem dados disponíveis
                                    </div>
                                )}
                                <div className="flex justify-between mt-4 text-xs text-foreground/40">
                                    <span>{chartData?.labels[0] || "início"}</span>
                                    <span>{chartData?.labels[chartData.labels.length - 1] || "hoje"}</span>
                                </div>
                            </div>

                            <div className="glass-panel p-5 rounded-[2rem]">
                                <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">Resumo do período</div>
                                <div className="space-y-4 text-sm text-foreground/70">
                                    <div>
                                        <div className="text-foreground/50">Variação no período</div>
                                        <strong className={`text-xl ${(periodStats?.change || 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                            {(periodStats?.change || 0) >= 0 ? "+" : ""}{periodStats?.change.toFixed(2)}%
                                        </strong>
                                    </div>
                                    <div>
                                        <div className="text-foreground/50">Menor cotação</div>
                                        <strong className="text-base text-foreground">{formatPrice(periodStats?.low || 0)}</strong>
                                    </div>
                                    <div>
                                        <div className="text-foreground/50">Maior cotação</div>
                                        <strong className="text-base text-foreground">{formatPrice(periodStats?.high || 0)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="prose prose-slate dark:prose-invert max-w-none mb-16">
                        <h2>Sobre o {config.name}</h2>
                        {config.about.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                        <p>
                            O mercado de criptoativos opera 24 horas por dia, 7 dias por semana, e os preços podem mudar a qualquer momento.
                            As cotações exibidas têm caráter informativo e não constituem recomendação de investimento — criptomoedas são ativos
                            de alto risco e volatilidade, e o valor pode oscilar significativamente em curtos períodos.
                        </p>
                    </section>

                    <AffiliateSection
                        partners={cryptoAffiliatePartners}
                        eyebrow="Onde comprar cripto"
                        title="Exchanges para comparar antes de fechar a operação"
                        description="Compare taxas e recursos entre as principais exchanges antes de comprar ou vender."
                    />
                </div>

                <aside className="xl:sticky xl:top-24 flex flex-col gap-6">
                    <div className="glass-panel p-5">
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">Resumo</div>
                        <div className="space-y-4 text-sm text-foreground/70">
                            <div>
                                <div className="text-foreground/50">Preço atual</div>
                                <strong className="text-xl text-foreground">{formatPrice(cryptoData?.price || 0)}</strong>
                            </div>
                            <div>
                                <div className="text-foreground/50">Variação 24h</div>
                                <strong className={`text-xl ${(cryptoData?.change24h || 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                    {(cryptoData?.change24h || 0) >= 0 ? "+" : ""}{cryptoData?.change24h?.toFixed(2)}%
                                </strong>
                            </div>
                            <div>
                                <div className="text-foreground/50">Volume 24h</div>
                                <strong className="text-base text-foreground">
                                    R$ {formatLargeNumber(cryptoData?.volume24h || 0)}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-5">
                        <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">Outras Criptos</div>
                        <div className="space-y-2">
                            {Object.entries(CRYPTO_CONFIG)
                                .filter(([sym]) => sym !== symbol)
                                .map(([sym, cfg]) => (
                                    <a
                                        key={sym}
                                        href={`/cripto/${sym.toLowerCase()}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-bg transition-colors"
                                    >
                                        <span className="text-xl">{cfg.icon}</span>
                                        <div>
                                            <div className="font-semibold text-foreground text-sm">{cfg.name}</div>
                                            <div className="text-xs text-foreground/50">{sym}</div>
                                        </div>
                                    </a>
                                ))}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}