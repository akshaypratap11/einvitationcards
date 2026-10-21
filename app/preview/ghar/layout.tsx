import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Griha Pravesh & Hawan Card Preview | Sacred Traditional E-Invite",
  description:
    "Preview traditional Griha Pravesh and Hawan invitation cards featuring sacred Kalash motifs, Vedic Shlokas, auspicious muhurat, and Google Maps venue navigation.",
  alternates: {
    canonical: "/preview/ghar",
  },
  openGraph: {
    title: "Griha Pravesh & Hawan Card Preview | निमंत्रण Utsav",
    description:
      "Interactive preview of our devotional Griha Pravesh & Vastu Shanti invitation card.",
  },
};

export default function GharPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
