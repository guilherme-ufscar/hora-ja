"use client";

import dynamic from "next/dynamic";
import type { ChartSpec } from "./ArticleChart";

const ArticleChart = dynamic(() => import("./ArticleChart"), { ssr: false });

export default function ArticleCharts({ charts }: { charts: ChartSpec[] }) {
    if (!charts.length) return null;
    return (
        <>
            {charts.map((chart, i) => (
                <ArticleChart key={i} chart={chart} />
            ))}
        </>
    );
}
