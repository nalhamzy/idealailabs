import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://idealailabs.com";
  const now = new Date();
  return [
    { url: `${base}/en`, lastModified: now, priority: 1 },
    { url: `${base}/ar`, lastModified: now, priority: 1 },
  ];
}
