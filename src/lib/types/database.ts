// Hand-written to match supabase/schema.sql. If you introspect a live
// project with `supabase gen types typescript`, this file can be replaced
// by the generated output. The app only relies on the shapes below.

export type LeadStatus = "new" | "contacted" | "closed";
export type BookingStatus = "requested" | "confirmed" | "declined" | "completed";

export interface BusinessHours {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  open: string | null;
  close: string | null;
}

export interface SiteSettingsRow {
  id: number;
  site_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  business_hours: BusinessHours[] | null;
  facebook_url: string | null;
  instagram_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  about_blurb: string | null;
  map_embed_url: string | null;
  updated_at: string;
}

export interface ServiceCategoryRow {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface ServiceRow {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItemRow {
  id: string;
  title: string;
  category_id: string | null;
  service_id: string | null;
  image_url: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  role_location: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  published: boolean;
  created_at: string;
}

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: LeadStatus;
  created_at: string;
}

export interface BookingRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_id: string | null;
  address: string | null;
  preferred_date: string | null;
  property_notes: string | null;
  status: BookingStatus;
  created_at: string;
}

export type BlogPostStatus = "draft" | "published";
export type BlogSchemaType = "Article" | "BlogPosting" | "HowTo" | "FAQPage";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogCategoryRow {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string;
  content_json: unknown;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  author_name: string;
  status: BlogPostStatus;
  published_at: string | null;

  focus_keyword: string | null;
  secondary_keywords: string[];
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;

  og_image_url: string | null;
  schema_type: BlogSchemaType;
  faq_items: FaqItem[];

  seo_score: number;
  readability_score: number;
  word_count: number;
  reading_time_minutes: number;

  created_at: string;
  updated_at: string;
}

type Table<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };

export interface Database {
  public: {
    Tables: {
      site_settings: Table<SiteSettingsRow>;
      service_categories: Table<ServiceCategoryRow>;
      services: Table<ServiceRow>;
      portfolio_items: Table<PortfolioItemRow>;
      testimonials: Table<TestimonialRow>;
      leads: Table<LeadRow>;
      bookings: Table<BookingRow>;
      blog_categories: Table<BlogCategoryRow>;
      blog_posts: Table<BlogPostRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
