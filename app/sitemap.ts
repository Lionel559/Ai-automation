import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
