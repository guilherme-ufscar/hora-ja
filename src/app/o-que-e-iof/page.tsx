import ArticlePage from "@/components/ArticlePage";
import { buildStaticMetadata } from "@/lib/metadata";
import { articleContent } from "@/lib/site-content";

export const metadata = buildStaticMetadata(
    articleContent.iof.slug,
    articleContent.iof.title,
    articleContent.iof.description,
);

export default function OQueEIofPage() {
    return <ArticlePage title={articleContent.iof.title} description={articleContent.iof.description} sections={articleContent.iof.sections} />;
}
