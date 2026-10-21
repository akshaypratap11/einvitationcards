import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Cards | निमंत्रण Utsav",
  description: "View and manage your saved invitations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
