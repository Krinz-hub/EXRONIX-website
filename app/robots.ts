import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/login/",
          "/signup/",
          "/checkout/",
          "/api/",
        ],
      },
    ],

    sitemap: "https://www.zaynastudio.store/sitemap.xml",
  };
}