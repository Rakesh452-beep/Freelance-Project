import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dhananjayproject-rho.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/booking`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/review`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
