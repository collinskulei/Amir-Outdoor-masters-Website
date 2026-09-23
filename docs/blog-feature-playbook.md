# Blog Feature Playbook

A reusable spec for rebuilding this exact blog system — a Tiptap rich-text
editor plus a live, Yoast-style SEO / Readability / AEO / GEO audit — on any
future website. Built once for Amir Outdoor Masters; everything
site-specific is called out so you can swap it per project.

Reference implementation lives in this repo. Key files:

```
src/lib/seo/text-stats.ts          text-parsing heuristics (no deps)
src/lib/seo/analyze.ts             the analyzer + scoring engine
src/lib/types/database.ts          BlogPostRow / BlogCategoryRow types
src/lib/data/blog.ts               public data reads (published only)
src/lib/data/admin.ts              admin data reads (getAdminPosts etc.)
src/lib/actions/blog.ts            create/update/delete post
src/lib/actions/blog-categories.ts create/update/delete category
src/lib/actions/media.ts           generic image upload (reused by editor)
src/components/admin/blog/
  rich-text-editor.tsx             Tiptap wrapper + toolbar
  seo-panel.tsx                    score rings + checklist UI
  serp-preview.tsx                 Google-result preview
  post-form.tsx                    ties it all together (the big one)
  blog-category-dialog.tsx         category CRUD dialog
src/app/(site)/blog/               public listing + [slug] detail
src/app/admin/(dashboard)/blog*    admin list/new/edit + categories
supabase/migrations/002_blog.sql   schema for this feature alone
```

---

## 1. What it does

- Admin writes posts in a real rich-text editor (bold/italic/underline/
  strike, H2/H3, lists, blockquote, links, images, text align, undo/redo).
- While typing, a sidebar panel scores the post live across **four
  dimensions** — SEO, Readability, AEO (Answer Engine Optimization — being
  quoted directly by voice assistants / featured snippets), and GEO
  (Generative Engine Optimization — being cited by ChatGPT/Perplexity/AI
  Overviews) — each as a 0–100 ring plus a green/amber/red checklist with
  one-line fixes, the same interaction model as Yoast SEO in WordPress.
- A Google search-result preview (title / URL / description) updates live.
- Optional FAQ items per post, which double as an AEO signal (answer
  engines lift FAQ content directly) and get emitted as `FAQPage` JSON-LD.
- Structured data (`Article` / `BlogPosting` / `HowTo` / `FAQPage`) is
  chosen per post and rendered as JSON-LD on the public page.
- Public blog is a standard listing + detail pair with category filtering,
  reading time, related posts, and sitemap entries.

## 2. Data model

Two tables. Copy `supabase/migrations/002_blog.sql` verbatim as a starting
point — nothing in it is Amir-specific except the RLS pattern (any
`authenticated` user is an admin, because this project provisions admin
accounts by hand in Supabase Auth rather than a roles table; tighten this
if your project has real multi-role auth).

```sql
blog_categories (id, name, slug, sort_order, created_at)

blog_posts (
  id, title, slug, excerpt,
  content_html,        -- rendered HTML, what the public page prints
  content_json,         -- Tiptap's native doc, re-opened for editing
  cover_image_url, category_id, tags[], author_name,
  status,                -- 'draft' | 'published'
  published_at,

  -- SEO
  focus_keyword, secondary_keywords[], meta_title, meta_description, canonical_url,

  -- AEO / GEO / social
  og_image_url, schema_type, faq_items jsonb,   -- [{question, answer}]

  -- cached analysis (recomputed live client-side; persisted so list
  -- views can show a score badge without re-running the analyzer)
  seo_score, readability_score, word_count, reading_time_minutes,

  created_at, updated_at
)
```

**Why both `content_html` and `content_json`:** the public route never
loads the editor — it just prints `content_html` — while `content_json` is
what gets fed back into Tiptap when the post is reopened for editing, so
editing fidelity doesn't depend on parsing HTML back into a doc.

**Why cache `seo_score`/`readability_score` on the row:** the admin list
page shows a score badge per post without re-running the analyzer
server-side (the analyzer is a client-only DOMParser-based tool — see §4).

## 3. The analyzer engine (the reusable core)

This is the part worth lifting into any project almost unchanged —
`text-stats.ts` and `analyze.ts` have **zero framework dependencies** (no
React, no Next, no Supabase). They only assume `DOMParser`, so they must
run client-side (guarded with `typeof window !== "undefined"` fallbacks).

### Design

```ts
type CheckStatus = "good" | "ok" | "bad";
type CheckCategory = "seo" | "readability" | "aeo" | "geo";

interface SeoCheck {
  id: string; category: CheckCategory; status: CheckStatus;
  label: string; message: string;   // message is always the actionable fix
}

function analyzeContent(input: AnalyzeInput): AnalyzeResult {
  // input: title, metaTitle, metaDescription, slug, focusKeyword,
  //        contentHtml, excerpt, faqItemCount, otherFocusKeywords?
  // returns: checks[], scores per category (0-100), overallScore,
  //          wordCount, readingTimeMinutes
}
```

Score per category = `(good=1, ok=0.5, bad=0)` averaged across that
category's checks, × 100. No ML, no external API calls — every check is a
documented heuristic (the same class of check Yoast itself runs). That
matters: it's instant, free, and works offline in the editor.

### The checks, by category (port these, tune the thresholds)

**SEO** — focus keyword set; keyword in title/slug/meta description/first
paragraph; keyword density (0.5–2.5% is the healthy band, >3% flags
stuffing); title length (30–60 chars); meta description length
(120–156 chars); content length (300 words minimum, 600+ preferred);
outbound + internal links present; image alt text coverage; subheading
presence for longer posts; optional cross-post keyword collision check
(pass `otherFocusKeywords` from a data-layer query).

**Readability** — Flesch Reading Ease (own syllable-counting heuristic in
`text-stats.ts`, no dependency); % of sentences over 20 words; transition-word
ratio (a fixed English word list); consecutive sentences sharing an opening
word; paragraph length.

**AEO** — does the post open with a concise (40–320 char) direct-answer
paragraph (this is what gets lifted into featured snippets/voice answers);
are any H2/H3s phrased as questions (`looksLikeQuestion()` checks for a
`?` or a leading question word); is there FAQ content; are there lists/
tables (structured content is what extraction pipelines parse reliably).

**GEO** — concrete numbers/stats present (regex for `%`, `$`, multi-digit
numbers — generative engines favor quantified claims over vague ones);
outbound citations to back claims; enough subheadings to give the content
a "chunked", quotable structure.

### Adapting it to a new site

- Swap the brand-domain check in `outbound-links`/`internal-links`
  (`analyze.ts` currently hardcodes `amiroutdoormasters` to tell internal
  from external links) for the new site's domain, or better, pass the
  site's own hostname into `AnalyzeInput` instead of hardcoding it.
- `TRANSITION_WORDS` and `QUESTION_WORDS` in `text-stats.ts` are
  English-only lists — replace them (or add a language param) for a
  non-English site.
- Everything else is content-agnostic and needs no changes.

## 4. Rich text editor (Tiptap v3)

```
@tiptap/react @tiptap/starter-kit @tiptap/extension-link
@tiptap/extension-image @tiptap/extension-placeholder
@tiptap/extension-character-count @tiptap/extension-underline
@tiptap/extension-text-align
```

`useEditor({ immediatelyRender: false, ... })` — **required** in any SSR
framework (Next.js, Remix, etc.). Without it, Tiptap renders once on the
server placeholder-empty and once on the client with real content,
producing a hydration mismatch.

`StarterKit.configure({ link: false })` — StarterKit bundles its own Link
extension; disable it and add `@tiptap/extension-link` separately
configured with `openOnClick: false` so links don't navigate away while
editing.

### The toolbar-focus gotcha (real bug, worth documenting)

Every toolbar button **must** neutralize mousedown before the click fires:

```tsx
<button
  type="button"
  onMouseDown={(e) => e.preventDefault()}   // <-- without this, formatting silently fails
  onClick={onClick}
>
```

Without `preventDefault` on `mousedown`, clicking a plain `<button>`
steals focus from the ProseMirror `contenteditable` *before* the `onClick`
handler runs. Tiptap's `.chain().focus()...run()` then restores focus but
the text **selection is already gone** — so `toggleHeading()`/`toggleBold()`
etc. either no-op or apply to a collapsed cursor, and selected text can
be silently lost. This is standard Tiptap folklore, but it's easy to skip
and the failure mode (content vanishing) doesn't look like a focus bug at
first glance. Caught this in this project's own QA pass — see §7.

### Image uploads from inside the editor

The toolbar's image button opens a hidden `<input type="file">`, uploads
via a generic `uploadMedia(formData, folder)` server action (same one the
rest of the admin dashboard uses for cover images etc.), then calls
`editor.chain().focus().setImage({ src: url, alt: "" }).run()`. No
dedicated media library needed for v1 — reuse whatever generic upload
action the project already has.

## 5. Admin editor layout

`post-form.tsx` is a 3-column grid: content (title, slug, excerpt, editor,
FAQ builder) spans 2 columns; a sidebar spans 1, holding:

1. A status bar (draft/published switch + Save Draft / Publish buttons) —
   *outside* the tabs, always visible.
2. A `Tabs` with three panels: **Publish** (cover image, category, tags,
   author, structured-data type), **SEO / AEO** (SERP preview, focus
   keyword, secondary keywords, meta title/description, canonical URL, og
   image), **Analysis** (the score rings + checklist from `seo-panel.tsx`).

Analysis re-runs on a **350ms debounce** keyed off every field the
analyzer reads (title, meta fields, slug, focus keyword, content HTML,
excerpt, FAQ count) — cheap enough to not need memoization beyond that.

Slug auto-generates from the title (`slugify()`) until the admin manually
edits the slug field, then it stops auto-following.

## 6. Public rendering

- `dangerouslySetInnerHTML={{ __html: post.content_html }}` inside a
  `.prose .prose-pine` wrapper (Tailwind Typography plugin +
  a brand-color override block — see `globals.css`'s `.prose-pine` rules
  and swap the CSS custom properties, `--tw-prose-headings` etc., for a
  new brand).
- JSON-LD: one `Article`/`BlogPosting`/`HowTo`/`FAQPage` script (per
  `post.schema_type`) plus a second standalone `FAQPage` script whenever
  `faq_items.length > 0`, regardless of the chosen primary schema type —
  both can legally coexist on one page.
- FAQ section renders as native `<details>/<summary>` — zero JS, free
  accessibility, no accordion library needed.
- Sitemap: add published post URLs to `sitemap.ts` alongside static
  routes, keyed off `updated_at`.

## 7. Known gotchas hit while building this (check for these on a new stack)

1. **Base UI `Select` needs an `items` prop or it shows the raw value
   after the popup closes**, not the item's label. Any `<Select>` whose
   trigger should show a human label (category name, not a UUID) must
   pass `items={list.map(x => ({ value: x.id, label: x.name }))}` (or a
   plain `Record<string, ReactNode>` for fixed enums) to `Select`/`Root`.
   Affects every category/status/schema-type dropdown in this project —
   check whatever Select primitive your new stack uses for an equivalent
   requirement before shipping any dropdown that shows a name for an ID.
2. **`value={x ?? undefined}` on a controlled Select trips a React warning**
   ("changing from uncontrolled to controlled") the first time a value is
   picked, because the prop starts at `undefined` and later becomes a
   string. Pass `null` for "nothing selected" instead of `undefined`
   (`value={x}` where `x: string | null`), and keep it consistently
   defined (never `undefined`) across the component's lifetime.
3. **Toolbar buttons need `onMouseDown preventDefault`** — see §4.
4. **Next.js route-type generation lags new route files.** If
   `PageProps<'/new/route'>` errors with "does not satisfy AppRoutes"
   right after adding a page, run `npx next typegen` (or `next build`)
   once to regenerate `.next/**/routes.d.ts`, then re-check.

## 8. Adaptation checklist for a new website

- [ ] Copy the two lib files (`seo/text-stats.ts`, `seo/analyze.ts`) as-is.
- [ ] Swap the hardcoded domain string in `analyze.ts`'s link checks.
- [ ] Copy `blog_categories`/`blog_posts` schema; adjust the RLS pattern to
      match the new project's actual auth/roles model.
- [ ] Re-theme `.prose-pine` (rename + repoint the CSS vars) to the new
      brand's palette.
- [ ] Re-pick which shadcn/ui (or equivalent) primitives back `Select`,
      `Tabs`, `Dialog` — if it's Radix instead of Base UI, the `items`
      prop requirement in gotcha #1 won't apply, but double-check its own
      controlled-value quirks.
- [ ] Decide schema-type defaults for the new site's content types (a
      recipe site might want `Recipe`; a SaaS blog might drop `HowTo`).
- [ ] Point the image-upload action at whatever storage the new project
      uses (Supabase Storage here; S3/Cloudinary/etc. elsewhere) — the
      editor only needs a function that returns a public URL.
