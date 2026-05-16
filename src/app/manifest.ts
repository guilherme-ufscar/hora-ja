import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "HoraJá Cambio",
        short_name: "HoraJá Cambio",
        description: "Cotações, conversor com IOF, histórico cambial e alertas push.",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#10b981",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "48x48",
                type: "image/x-icon",
            },
        ],
        id: SITE_URL,
    };
}
