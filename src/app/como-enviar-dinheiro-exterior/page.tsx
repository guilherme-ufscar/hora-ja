import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";
import { articleContent } from "@/lib/site-content";

export const metadata = buildStaticMetadata(
    articleContent.exterior.slug,
    articleContent.exterior.title,
    articleContent.exterior.description,
);

export default function ComoEnviarDinheiroExteriorPage() {
    return <ArticlePage title={articleContent.exterior.title} description={articleContent.exterior.description} sections={articleContent.exterior.sections} />;
}
