import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://horaja.com.br"; // Domínio oficial Base

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/api/",
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
