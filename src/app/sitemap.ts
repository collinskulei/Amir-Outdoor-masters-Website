import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/data/services";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amiroutdoormasters.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getAllServices();

  const staticRoutes = ["", "/services", "/portfolio", "/about", "/contact", "/quote"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(service.updated_at),
  }));

  return [...staticRoutes, ...serviceRoutes];
}
