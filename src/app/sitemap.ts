import { MetadataRoute } from "next";
import { currencyDefinitions } from "@/lib/currencies";
import { SITE_URL } from "@/lib/metadata";
import { articleContent } from "@/lib/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        "/",
        "/conversor",
        "/cripto",
        "/noticias",
        articleContent.iof.slug,
        articleContent.exterior.slug,
        articleContent.dolar.slug,
        "/sobre",
        "/contato",
        "/politica-de-privacidade",
        "/termos-de-uso",
    ];

    const cryptoRoutes = ["btc", "eth", "sol", "xrp", "ada", "dot"].map((sym) => `/cripto/${sym}`);

    return [
        ...staticRoutes.map(
            (route): MetadataRoute.Sitemap[number] => ({
                url: `${SITE_URL}${route}`,
                lastModified: new Date(),
                changeFrequency: route === "/" ? "hourly" : "weekly",
                priority: route === "/" ? 1 : 0.8,
            }),
        ),
        ...cryptoRoutes.map(
            (route): MetadataRoute.Sitemap[number] => ({
                url: `${SITE_URL}${route}`,
                lastModified: new Date(),
                changeFrequency: "hourly",
                priority: 0.8,
            }),
        ),
        ...currencyDefinitions
            .filter((currency) => currency.code !== "BRL")
            .map(
                (currency): MetadataRoute.Sitemap[number] => ({
                    url: `${SITE_URL}${currency.route}`,
                    lastModified: new Date(),
                    changeFrequency: "hourly",
                    priority: currency.priority === "high" ? 0.9 : 0.75,
                }),
            ),
    ];
}
