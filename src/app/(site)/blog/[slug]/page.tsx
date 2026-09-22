import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { BlogPostCard } from "@/components/site/blog-post-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CtaBanner } from "@/components/site/cta-banner";
import { getPostBySlug, getRelatedPosts } from "@/lib/data/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amiroutdoormasters.com";

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || undefined;

  return {
    title,
    description,
    alternates: post.canonical_url ? { canonical: post.canonical_url } : { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.og_image_url || post.cover_image_url ? [post.og_image_url || post.cover_image_url!] : undefined,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": post.schema_type,
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author_name },
    publisher: { "@type": "Organization", name: "Amir Outdoor Masters" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  const faqJsonLd =
    post.faq_items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq_items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <article>
        <section className="bg-field-pattern bg-pine-950 py-20 sm:py-24">
          <Container>
            <AnimatedSection className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{post.title}</h1>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-pine-200/90">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.author_name}
                </span>
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.reading_time_minutes} min read
                </span>
              </div>
            </AnimatedSection>
          </Container>
        </section>

        <Container className="py-16 sm:py-20">
          {post.cover_image_url && (
            <AnimatedSection className="relative mx-auto mb-12 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl">
              <Image src={post.cover_image_url} alt={post.title} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" priority />
            </AnimatedSection>
          )}

          <AnimatedSection
            className="prose prose-pine mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />

          {post.tags.length > 0 && (
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.faq_items.length > 0 && (
            <div className="mx-auto mt-16 max-w-3xl">
              <h2 className="text-2xl font-bold text-pine-950">Frequently asked questions</h2>
              <div className="mt-6 space-y-3">
                {post.faq_items.map((item, i) => (
                  <details key={i} className="group rounded-xl border border-border p-4 open:bg-green-50/50">
                    <summary className="cursor-pointer text-sm font-semibold text-pine-950">
                      {item.question}
                    </summary>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </Container>

        {related.length > 0 && (
          <section className="bg-green-50 py-20 sm:py-24">
            <Container>
              <h2 className="clay-line text-2xl font-bold text-pine-950 sm:text-3xl">More from the blog</h2>
              <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <StaggerItem key={p.id}>
                    <BlogPostCard post={p} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <div className="mt-10 flex justify-center">
                <Link href="/blog" className="text-sm font-semibold text-green-700 hover:text-clay-600">
                  View all posts →
                </Link>
              </div>
            </Container>
          </section>
        )}
      </article>

      <CtaBanner />
    </>
  );
}
