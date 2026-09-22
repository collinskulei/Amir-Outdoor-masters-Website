"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { BlogPostStatus, BlogSchemaType, FaqItem } from "@/lib/types/database";

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  content_json: unknown;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  author_name: string;
  status: BlogPostStatus;

  focus_keyword: string;
  secondary_keywords: string[];
  meta_title: string;
  meta_description: string;
  canonical_url: string;

  og_image_url: string | null;
  schema_type: BlogSchemaType;
  faq_items: FaqItem[];

  seo_score: number;
  readability_score: number;
  word_count: number;
  reading_time_minutes: number;
};

function buildRow(input: BlogPostInput) {
  return {
    title: input.title,
    slug: input.slug ? slugify(input.slug) : slugify(input.title),
    excerpt: input.excerpt || null,
    content_html: input.content_html,
    content_json: input.content_json,
    cover_image_url: input.cover_image_url,
    category_id: input.category_id,
    tags: input.tags,
    author_name: input.author_name || "Amir Outdoor Masters",
    status: input.status,
    focus_keyword: input.focus_keyword || null,
    secondary_keywords: input.secondary_keywords,
    meta_title: input.meta_title || null,
    meta_description: input.meta_description || null,
    canonical_url: input.canonical_url || null,
    og_image_url: input.og_image_url,
    schema_type: input.schema_type,
    faq_items: input.faq_items,
    seo_score: input.seo_score,
    readability_score: input.readability_score,
    word_count: input.word_count,
    reading_time_minutes: input.reading_time_minutes,
  };
}

export async function createPost(input: BlogPostInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };
  if (!input.title.trim()) return { error: "Title is required." };

  const row = buildRow(input);
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...row, published_at: input.status === "published" ? new Date().toISOString() : null })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { id: data.id as string };
}

export async function updatePost(id: string, input: BlogPostInput, currentPublishedAt: string | null) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };
  if (!input.title.trim()) return { error: "Title is required." };

  const row = buildRow(input);
  const publishedAt =
    input.status === "published" ? (currentPublishedAt ?? new Date().toISOString()) : currentPublishedAt;

  const { error } = await supabase
    .from("blog_posts")
    .update({ ...row, published_at: publishedAt, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${row.slug}`);
  return {};
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return {};
}
