import dynamic from "next/dynamic";
import { getCurrencyHistory } from "@/lib/api";

interface CurrencyHistoryProps {
    base: string;
}

const CurrencyHistoryChart = dynamic(() => import("@/components/CurrencyHistoryChart"), {
    loading: () => (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center text-foreground/50">
            Carregando gráfico histórico...
        </div>
    ),
});

export default async function CurrencyHistory({ base }: CurrencyHistoryProps) {
    const [history7, history30, history90, history365] = await Promise.all([
        getCurrencyHistory(base, 7),
        getCurrencyHistory(base, 30),
        getCurrencyHistory(base, 90),
        getCurrencyHistory(base, 365),
    ]);

    return (
        <CurrencyHistoryChart
            histories={{
                7: history7,
                30: history30,
                90: history90,
                365: history365,
            }}
        />
    );
}
