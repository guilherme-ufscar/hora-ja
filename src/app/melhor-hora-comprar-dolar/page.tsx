import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";
import { articleContent } from "@/lib/site-content";

export const metadata = buildStaticMetadata(
    articleContent.dolar.slug,
    articleContent.dolar.title,
    articleContent.dolar.description,
);

export default function MelhorHoraComprarDolarPage() {
    return <ArticlePage title={articleContent.dolar.title} description={articleContent.dolar.description} sections={articleContent.dolar.sections} />;
}
