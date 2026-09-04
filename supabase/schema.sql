-- Amir Outdoor Masters — Supabase schema
-- Run this once in the Supabase SQL editor for a fresh project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- site_settings — singleton row that drives header/footer/about content and
-- the uploadable logo. Hero slideshow images are NOT stored here — they're
-- plain files under storage media/hero/desktop and media/hero/mobile, listed
-- at request time (see src/lib/data/hero-images.ts), so the admin can add,
-- remove, or reorder (by filename) any number of slides without a migration.
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id smallint primary key default 1,
  site_name text not null default 'Amir Outdoor Masters',
  tagline text default 'Landscaping & Outdoor Living, Done Right',
  phone text,
  whatsapp_number text,
  email text,
  address text,
  business_hours jsonb default '[
    {"day":"Mon","open":"08:00","close":"17:00"},
    {"day":"Tue","open":"08:00","close":"17:00"},
    {"day":"Wed","open":"08:00","close":"17:00"},
    {"day":"Thu","open":"08:00","close":"17:00"},
    {"day":"Fri","open":"08:00","close":"17:00"},
    {"day":"Sat","open":"09:00","close":"14:00"},
    {"day":"Sun","open":null,"close":null}
  ]'::jsonb,
  facebook_url text,
  instagram_url text,
  logo_url text,
  favicon_url text,
  about_blurb text,
  map_embed_url text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- service_categories
-- ---------------------------------------------------------------------------
create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references service_categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  summary text,
  description text,
  image_url text,
  icon text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- portfolio_items — project gallery
-- ---------------------------------------------------------------------------
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id uuid references service_categories (id) on delete set null,
  service_id uuid references services (id) on delete set null,
  image_url text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_location text,
  quote text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  avatar_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- leads — general contact form submissions
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- bookings — quote / site-visit requests
-- ---------------------------------------------------------------------------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service_id uuid references services (id) on delete set null,
  address text,
  preferred_date date,
  property_notes text,
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'declined', 'completed')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table site_settings enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table portfolio_items enable row level security;
alter table testimonials enable row level security;
alter table leads enable row level security;
alter table bookings enable row level security;

-- Public (anon) can read published marketing content.
create policy "public read site_settings" on site_settings for select using (true);
create policy "public read service_categories" on service_categories for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read portfolio_items" on portfolio_items for select using (true);
create policy "public read published testimonials" on testimonials for select using (published = true);

-- Public (anon) can create leads/bookings, but never read or edit them back.
create policy "public insert leads" on leads for insert with check (true);
create policy "public insert bookings" on bookings for insert with check (true);

-- Authenticated admins (any signed-in user, since accounts are created by the
-- team directly in Supabase Auth) get full read/write on everything.
create policy "admin all site_settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all service_categories" on service_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all services" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all portfolio_items" on portfolio_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all leads" on leads for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin all bookings" on bookings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Storage — public "media" bucket for logo, hero backgrounds, service &
-- portfolio photos, testimonial avatars. Create the bucket once from the
-- Supabase dashboard (Storage > New bucket > "media", Public bucket = on),
-- then apply these policies.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin write media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
