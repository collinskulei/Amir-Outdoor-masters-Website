import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/data/services";
import { getPublishedPosts } from "@/lib/data/blog";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amiroutdoormasters.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getAllServices(), getPublishedPosts()]);

  const staticRoutes = ["", "/services", "/portfolio", "/blog", "/about", "/contact", "/quote"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
  }));

  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
