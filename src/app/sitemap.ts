import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://horaja.com.br"; // Exemplo de domínio base em produção

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 1,
        },
        {
            url: `${baseUrl}/dolar`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/euro`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/libra`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/conversor`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];
}
