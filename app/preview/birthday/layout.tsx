import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birthday Party Card Preview | Animated Digital Invite",
  description:
    "Preview lively animated birthday invitation cards with confetti animations, childhood photo memory reel, live countdown timer, and venue map.",
  alternates: {
    canonical: "/preview/birthday",
  },
  openGraph: {
    title: "Birthday Party Card Preview | निमंत्रण Utsav",
    description:
      "Interactive preview of our celebratory birthday invitation card with confetti and music.",
  },
};

export default function BirthdayPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
