import { createClient } from "@/lib/supabase/server";
import type { BlogCategoryRow, BlogPostRow } from "@/lib/types/database";

export type PublicBlogPost = BlogPostRow & { category: BlogCategoryRow | null };

export async function getBlogCategories(): Promise<BlogCategoryRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("blog_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getPublishedPosts(options?: {
  limit?: number;
  categorySlug?: string;
}): Promise<PublicBlogPost[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const [{ data: posts }, { data: categories }] = await Promise.all([
    (() => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (options?.limit) query = query.limit(options.limit);
      return query;
    })(),
    supabase.from("blog_categories").select("*"),
  ]);

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]));
  let results = (posts ?? []).map((p) => ({ ...p, category: p.category_id ? (categoryById.get(p.category_id) ?? null) : null }));

  if (options?.categorySlug) {
    results = results.filter((p) => p.category?.slug === options.categorySlug);
  }

  return results;
}

export async function getPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!post) return null;

  let category: BlogCategoryRow | null = null;
  if (post.category_id) {
    const { data } = await supabase.from("blog_categories").select("*").eq("id", post.category_id).maybeSingle();
    category = data ?? null;
  }

  return { ...post, category };
}

export async function getRelatedPosts(post: PublicBlogPost, limit = 3): Promise<PublicBlogPost[]> {
  const all = await getPublishedPosts();
  const sameCategory = all.filter((p) => p.id !== post.id && p.category_id === post.category_id);
  const rest = all.filter((p) => p.id !== post.id && p.category_id !== post.category_id);
  return [...sameCategory, ...rest].slice(0, limit);
}
