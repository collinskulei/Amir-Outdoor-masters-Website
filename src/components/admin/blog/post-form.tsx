"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { RichTextEditor } from "@/components/admin/blog/rich-text-editor";
import { SeoPanel } from "@/components/admin/blog/seo-panel";
import { SerpPreview } from "@/components/admin/blog/serp-preview";
import { analyzeContent } from "@/lib/seo/analyze";
import { slugify } from "@/lib/utils";
import { createPost, updatePost, type BlogPostInput } from "@/lib/actions/blog";
import type { BlogCategoryRow, BlogPostRow, BlogSchemaType, FaqItem } from "@/lib/types/database";

export function PostForm({
  categories,
  post,
  otherFocusKeywords,
}: {
  categories: BlogCategoryRow[];
  post?: BlogPostRow;
  otherFocusKeywords: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(post?.content_html ?? "");
  const [contentJson, setContentJson] = useState<unknown>(post?.content_json ?? null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.cover_image_url ?? null);
  const [categoryId, setCategoryId] = useState<string | null>(post?.category_id ?? null);
  const [tagsInput, setTagsInput] = useState((post?.tags ?? []).join(", "));
  const [authorName, setAuthorName] = useState(post?.author_name ?? "Amir Outdoor Masters");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");

  const [focusKeyword, setFocusKeyword] = useState(post?.focus_keyword ?? "");
  const [secondaryKeywordsInput, setSecondaryKeywordsInput] = useState((post?.secondary_keywords ?? []).join(", "));
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonical_url ?? "");

  const [ogImageUrl, setOgImageUrl] = useState<string | null>(post?.og_image_url ?? null);
  const [schemaType, setSchemaType] = useState<BlogSchemaType>(post?.schema_type ?? "Article");
  const [faqItems, setFaqItems] = useState<FaqItem[]>(post?.faq_items ?? []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const [analysis, setAnalysis] = useState(() =>
    analyzeContent({
      title,
      metaTitle,
      metaDescription,
      slug,
      focusKeyword,
      contentHtml,
      excerpt,
      faqItemCount: faqItems.length,
      otherFocusKeywords,
    })
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalysis(
        analyzeContent({
          title,
          metaTitle,
          metaDescription,
          slug,
          focusKeyword,
          contentHtml,
          excerpt,
          faqItemCount: faqItems.length,
          otherFocusKeywords,
        })
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [title, metaTitle, metaDescription, slug, focusKeyword, contentHtml, excerpt, faqItems.length, otherFocusKeywords]);

  const parsedTags = useMemo(
    () => tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    [tagsInput]
  );
  const parsedSecondaryKeywords = useMemo(
    () => secondaryKeywordsInput.split(",").map((t) => t.trim()).filter(Boolean),
    [secondaryKeywordsInput]
  );

  function updateFaqItem(index: number, patch: Partial<FaqItem>) {
    setFaqItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function handleSave(nextStatus: "draft" | "published") {
    const input: BlogPostInput = {
      title,
      slug,
      excerpt,
      content_html: contentHtml,
      content_json: contentJson,
      cover_image_url: coverImageUrl,
      category_id: categoryId,
      tags: parsedTags,
      author_name: authorName,
      status: nextStatus,
      focus_keyword: focusKeyword,
      secondary_keywords: parsedSecondaryKeywords,
      meta_title: metaTitle,
      meta_description: metaDescription,
      canonical_url: canonicalUrl,
      og_image_url: ogImageUrl,
      schema_type: schemaType,
      faq_items: faqItems.filter((f) => f.question.trim() && f.answer.trim()),
      seo_score: analysis.scores.seo,
      readability_score: analysis.scores.readability,
      word_count: analysis.wordCount,
      reading_time_minutes: analysis.readingTimeMinutes,
    };

    startTransition(async () => {
      const result = post
        ? await updatePost(post.id, input, post.published_at)
        : await createPost(input);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(nextStatus === "published" ? "Post published." : "Draft saved.");
      router.push("/admin/blog");
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How Much Does Cabro Paving Cost in Kenya?"
            className="mt-2 h-12 text-lg"
          />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">/blog/</span>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="h-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="mt-2"
            placeholder="One or two sentences shown on the blog listing page."
          />
        </div>

        <div>
          <Label>Content</Label>
          <div className="mt-2">
            <RichTextEditor
              content={contentHtml}
              onChange={(html, json) => {
                setContentHtml(html);
                setContentJson(json);
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>FAQ section (optional, boosts AEO)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setFaqItems((prev) => [...prev, { question: "", answer: "" }])}
            >
              <Plus className="h-3.5 w-3.5" />
              Add question
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="rounded-xl border border-border p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, { question: e.target.value })}
                      placeholder="Question, e.g. How long does cabro paving take to install?"
                      className="h-10"
                    />
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(index, { answer: e.target.value })}
                      placeholder="A direct, concise answer."
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => setFaqItems((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {faqItems.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No FAQ items yet. Adding a few common questions here is one of the strongest AEO signals, answer engines lift these directly.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Switch checked={status === "published"} onCheckedChange={(v) => setStatus(v ? "published" : "draft")} />
            <span className="text-sm font-medium text-pine-950">{status === "published" ? "Published" : "Draft"}</span>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" disabled={pending} onClick={() => handleSave("draft")}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Draft
            </Button>
            <Button className="btn-clay" disabled={pending} onClick={() => handleSave("published")}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="publish">
          <TabsList className="w-full">
            <TabsTrigger value="publish" className="flex-1">Publish</TabsTrigger>
            <TabsTrigger value="seo" className="flex-1">SEO / AEO</TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="space-y-5 pt-4">
            <ImageUploadField label="Cover image" folder="blog" value={coverImageUrl} onChange={setCoverImageUrl} aspect="aspect-video" />
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                items={categories.map((c) => ({ value: c.id, label: c.name }))}
                value={categoryId}
                onValueChange={(v) => setCategoryId(v)}
              >
                <SelectTrigger id="category" className="mt-2 h-11 w-full">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="mt-2 h-11" />
            </div>
            <div>
              <Label htmlFor="author">Author name</Label>
              <Input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="mt-2 h-11" />
            </div>
            <div>
              <Label htmlFor="schema-type">Structured data type</Label>
              <Select
                items={{ Article: "Article", BlogPosting: "Blog Posting", HowTo: "How-To", FAQPage: "FAQ Page" }}
                value={schemaType}
                onValueChange={(v) => setSchemaType(v as BlogSchemaType)}
              >
                <SelectTrigger id="schema-type" className="mt-2 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                  <SelectItem value="HowTo">How-To</SelectItem>
                  <SelectItem value="FAQPage">FAQ Page</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Controls the JSON-LD schema published with this post. FAQ items are always added as FAQPage schema alongside it when present.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-5 pt-4">
            <SerpPreview title={metaTitle || title} slug={slug} description={metaDescription} />
            <div>
              <Label htmlFor="focus-keyword">Focus keyword</Label>
              <Input
                id="focus-keyword"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. cabro paving cost"
                className="mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="secondary-keywords">Secondary keywords (comma separated)</Label>
              <Input
                id="secondary-keywords"
                value={secondaryKeywordsInput}
                onChange={(e) => setSecondaryKeywordsInput(e.target.value)}
                className="mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="meta-title">SEO title</Label>
              <Input id="meta-title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-2 h-11" />
              <p className="mt-1 text-xs text-muted-foreground">{(metaTitle || title).length} characters</p>
            </div>
            <div>
              <Label htmlFor="meta-description">Meta description</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">{metaDescription.length} characters</p>
            </div>
            <div>
              <Label htmlFor="canonical-url">Canonical URL (optional)</Label>
              <Input id="canonical-url" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} className="mt-2 h-11" />
            </div>
            <ImageUploadField label="Social share image (og:image)" folder="blog" value={ogImageUrl} onChange={setOgImageUrl} aspect="aspect-video" />
          </TabsContent>

          <TabsContent value="analysis" className="pt-4">
            <SeoPanel result={analysis} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
