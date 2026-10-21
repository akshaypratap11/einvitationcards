import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://einvitationcard.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/apply", "/demo/"],
        disallow: [
          "/admin",
          "/create",
          "/edit/",
          "/c/",
          "/api/",
          "/rsvps/",
          "/my-cards",
          "/success",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
