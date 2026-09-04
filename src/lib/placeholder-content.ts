// Fallback content shown before the admin has configured Supabase or added
// real data, so the site always renders a complete, on-brand page instead
// of empty sections. Everything here mirrors the shape of the DB rows.

import type {
  BookingStatus,
  BusinessHours,
  LeadStatus,
  PortfolioItemRow,
  ServiceCategoryRow,
  ServiceRow,
  SiteSettingsRow,
  TestimonialRow,
} from "@/lib/types/database";

export const defaultBusinessHours: BusinessHours[] = [
  { day: "Mon", open: "08:00", close: "17:00" },
  { day: "Tue", open: "08:00", close: "17:00" },
  { day: "Wed", open: "08:00", close: "17:00" },
  { day: "Thu", open: "08:00", close: "17:00" },
  { day: "Fri", open: "08:00", close: "17:00" },
  { day: "Sat", open: "09:00", close: "14:00" },
  { day: "Sun", open: null, close: null },
];

export const defaultSiteSettings: SiteSettingsRow = {
  id: 1,
  site_name: "Amir Outdoor Masters",
  tagline: "Landscaping & Outdoor Living, Done Right",
  phone: "(555) 010-2024",
  whatsapp_number: null,
  email: "hello@amiroutdoormasters.com",
  address: "Serving the Greater Metro Area",
  business_hours: defaultBusinessHours,
  facebook_url: null,
  instagram_url: null,
  logo_url: null,
  favicon_url: null,
  about_blurb:
    "For over a decade, Amir Outdoor Masters has helped homeowners and businesses turn ordinary yards into outdoor spaces they never want to leave. From the first consultation to the final walkthrough, our crews bring the same standard: honest pricing, clean work, and craftsmanship that holds up season after season.",
  map_embed_url: null,
  updated_at: new Date(0).toISOString(),
};

export const placeholderCategories: (ServiceCategoryRow & { services: ServiceRow[] })[] = [
  {
    id: "cat-lawn-care",
    name: "Lawn Care",
    slug: "lawn-care",
    sort_order: 1,
    created_at: new Date(0).toISOString(),
    services: [
      mkService("srv-mowing", "cat-lawn-care", "Mowing & Edging", "mowing-edging", "Weekly and bi-weekly care that keeps every lawn crisp.", "Scissors", 1),
      mkService("srv-fertilization", "cat-lawn-care", "Fertilization & Weed Control", "fertilization-weed-control", "Seasonal treatment programs for thick, healthy turf.", "Sprout", 2),
      mkService("srv-aeration", "cat-lawn-care", "Aeration & Seeding", "aeration-seeding", "Relieve compacted soil and fill in bare patches.", "Wind", 3),
    ],
  },
  {
    id: "cat-landscape-design",
    name: "Landscape Design",
    slug: "landscape-design",
    sort_order: 2,
    created_at: new Date(0).toISOString(),
    services: [
      mkService("srv-design-install", "cat-landscape-design", "Design & Installation", "design-installation", "Custom planting plans built around how you use your yard.", "Trees", 1),
      mkService("srv-mulching", "cat-landscape-design", "Mulching & Bed Maintenance", "mulching-bed-maintenance", "Clean bed lines and fresh mulch that hold up all season.", "Layers", 2),
    ],
  },
  {
    id: "cat-hardscaping",
    name: "Hardscaping",
    slug: "hardscaping",
    sort_order: 3,
    created_at: new Date(0).toISOString(),
    services: [
      mkService("srv-patios", "cat-hardscaping", "Patios & Walkways", "patios-walkways", "Paver and natural stone hardscapes built to last decades.", "Square", 1),
      mkService("srv-retaining-walls", "cat-hardscaping", "Retaining Walls", "retaining-walls", "Engineered walls that solve drainage and grading problems.", "BrickWall", 2),
      mkService("srv-outdoor-living", "cat-hardscaping", "Outdoor Living Spaces", "outdoor-living-spaces", "Fire pits, kitchens, and seating areas made for entertaining.", "Flame", 3),
    ],
  },
  {
    id: "cat-irrigation",
    name: "Irrigation & Drainage",
    slug: "irrigation-drainage",
    sort_order: 4,
    created_at: new Date(0).toISOString(),
    services: [
      mkService("srv-sprinkler", "cat-irrigation", "Sprinkler Systems", "sprinkler-systems", "Efficient irrigation design, installation, and repair.", "Droplets", 1),
      mkService("srv-drainage", "cat-irrigation", "Drainage Solutions", "drainage-solutions", "French drains and grading fixes for standing water.", "CloudRain", 2),
    ],
  },
  {
    id: "cat-seasonal",
    name: "Seasonal Services",
    slug: "seasonal-services",
    sort_order: 5,
    created_at: new Date(0).toISOString(),
    services: [
      mkService("srv-cleanup", "cat-seasonal", "Spring & Fall Cleanup", "spring-fall-cleanup", "Leaf removal, bed cleanup, and season changeover.", "Leaf", 1),
      mkService("srv-snow", "cat-seasonal", "Snow Removal", "snow-removal", "Reliable plowing and walkway clearing all winter.", "Snowflake", 2),
    ],
  },
  {
    id: "cat-tree-care",
    name: "Tree & Shrub Care",
    slug: "tree-shrub-care",
    sort_order: 6,
    created_at: new Date(0).toISOString(),
    services: [
      mkService("srv-pruning", "cat-tree-care", "Pruning & Trimming", "pruning-trimming", "Shape and health-focused trimming for trees and shrubs.", "TreeDeciduous", 1),
      mkService("srv-removal", "cat-tree-care", "Tree Removal", "tree-removal", "Safe removal of hazardous or unwanted trees.", "Axe", 2),
    ],
  },
];

function mkService(
  id: string,
  category_id: string,
  name: string,
  slug: string,
  summary: string,
  icon: string,
  sort_order: number
): ServiceRow {
  return {
    id,
    category_id,
    name,
    slug,
    summary,
    description: summary,
    image_url: null,
    icon,
    featured: sort_order === 1,
    sort_order,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

export const placeholderServices: ServiceRow[] = placeholderCategories.flatMap((c) => c.services);

export const placeholderTestimonials: TestimonialRow[] = [
  {
    id: "t1",
    name: "Dana R.",
    role_location: "Homeowner",
    quote:
      "The crew transformed a drainage nightmare into the nicest part of our backyard. They showed up when they said they would and left the site spotless every day.",
    rating: 5,
    avatar_url: null,
    published: true,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "t2",
    name: "Marcus T.",
    role_location: "Property Manager",
    quote:
      "We switched three commercial properties over to Amir Outdoor Masters and haven't looked back. Communication is easy and the lawns have never looked better.",
    rating: 5,
    avatar_url: null,
    published: true,
    created_at: new Date(0).toISOString(),
  },
  {
    id: "t3",
    name: "Priya S.",
    role_location: "Homeowner",
    quote:
      "Our new patio and fire pit is exactly what we pictured. The design process made it easy to see everything before a single stone was laid.",
    rating: 5,
    avatar_url: null,
    published: true,
    created_at: new Date(0).toISOString(),
  },
];

export const placeholderPortfolio: PortfolioItemRow[] = [];

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  declined: "Declined",
  completed: "Completed",
};
