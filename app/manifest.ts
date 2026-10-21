import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "निमंत्रण Utsav | Royal Indian Digital Invitations",
    short_name: "निमंत्रण Utsav",
    description:
      "Create animated Indian wedding invitations, birthday cards & Griha Pravesh e-invites with music, RSVP, and Google Maps directions.",
    start_url: "/",
    display: "standalone",
    background_color: "#2a0612",
    theme_color: "#420b1e",
    orientation: "portrait",
    categories: ["lifestyle", "events", "social"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
