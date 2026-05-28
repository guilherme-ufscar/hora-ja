"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface ChartDataset {
    label: string;
    data: number[];
    color?: string;
}

interface ChartSpec {
    type: "line" | "bar";
    title: string;
    labels: string[];
    datasets: ChartDataset[];
}

export default function ArticleChart({ chart }: { chart: ChartSpec }) {
    const data = {
        labels: chart.labels,
        datasets: chart.datasets.map((ds) => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.color || "#10b981",
            backgroundColor: (ds.color || "#10b981") + "33",
            fill: chart.type === "line",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const, labels: { color: "#94a3b8", font: { size: 12 } } },
            title: { display: true, text: chart.title, color: "#94a3b8", font: { size: 13 } },
        },
        scales: {
            x: { ticks: { color: "#64748b" }, grid: { color: "#1e293b" } },
            y: { ticks: { color: "#64748b" }, grid: { color: "#1e293b" } },
        },
    };

    return (
        <div className="glass-panel p-6 my-6">
            {chart.type === "bar" ? (
                <Bar data={data} options={options} />
            ) : (
                <Line data={data} options={options} />
            )}
        </div>
    );
}
