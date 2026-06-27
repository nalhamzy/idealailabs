import type { MetadataRoute } from "next";
import { demoDefinitions } from "@/lib/platform";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://idealailabs.com";
  const now = new Date();
  const localized = [
    { url: `${base}/en`, lastModified: now, priority: 1 },
    { url: `${base}/ar`, lastModified: now, priority: 1 },
    { url: `${base}/en/demos`, lastModified: now, priority: 0.9 },
    { url: `${base}/ar/demos`, lastModified: now, priority: 0.9 },
  ];
  const demos = demoDefinitions.flatMap((demo) => [
    { url: `${base}/en/demos/${demo.key}`, lastModified: now, priority: 0.85 },
    { url: `${base}/ar/demos/${demo.key}`, lastModified: now, priority: 0.85 },
  ]);
  return [...localized, ...demos];
}
