import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { BlogPostCard } from "@/components/site/blog-post-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { cn } from "@/lib/utils";
import { getBlogCategories, getPublishedPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Landscaping and outdoor living guides, project breakdowns, and tips from Amir Outdoor Masters.",
};

export default async function BlogPage(props: PageProps<"/blog">) {
  const searchParams = await props.searchParams;
  const activeCategory = typeof searchParams.category === "string" ? searchParams.category : undefined;

  const [categories, posts] = await Promise.all([
    getBlogCategories(),
    getPublishedPosts({ categorySlug: activeCategory }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Guides, project stories, and tips"
        description="Practical advice on landscaping, hardscaping, and outdoor living, written by the crews doing the work."
      />
      <section className="py-20 sm:py-24">
        <Container>
          {categories.length > 0 && (
            <div className="mb-12 flex flex-wrap justify-center gap-2">
              <Link
                href="/blog"
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  !activeCategory ? "border-green-700 bg-green-700 text-white" : "border-border text-pine-900 hover:border-green-700"
                )}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    activeCategory === cat.slug ? "border-green-700 bg-green-700 text-white" : "border-border text-pine-900 hover:border-green-700"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {posts.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <BlogPostCard post={post} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 py-24 text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                {activeCategory ? "No posts in this category yet." : "No posts published yet. Check back soon."}
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
