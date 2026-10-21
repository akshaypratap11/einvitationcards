import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest RSVPs Dashboard | निमंत्रण Utsav",
  description: "View and manage guest attendance and responses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RsvpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
