-- Amir Outdoor Masters — Blog system migration
-- Run this once in the Supabase SQL editor. Safe to run on the existing
-- project (only adds new tables/policies; doesn't touch anything else).

create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null unique,
  excerpt text,
  content_html text not null default '',
  content_json jsonb,
  cover_image_url text,
  category_id uuid references blog_categories (id) on delete set null,
  tags text[] not null default '{}',
  author_name text not null default 'Amir Outdoor Masters',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,

  focus_keyword text,
  secondary_keywords text[] not null default '{}',
  meta_title text,
  meta_description text,
  canonical_url text,

  og_image_url text,
  schema_type text not null default 'Article' check (schema_type in ('Article', 'BlogPosting', 'HowTo', 'FAQPage')),
  faq_items jsonb not null default '[]',

  seo_score smallint not null default 0,
  readability_score smallint not null default 0,
  word_count integer not null default 0,
  reading_time_minutes smallint not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_at_idx on blog_posts (status, published_at desc);

alter table blog_categories enable row level security;
alter table blog_posts enable row level security;

create policy "public read blog_categories" on blog_categories for select using (true);
create policy "public read published blog_posts" on blog_posts for select using (status = 'published');

create policy "admin all blog_categories" on blog_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all blog_posts" on blog_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
