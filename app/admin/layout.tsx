import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | निमंत्रण Utsav",
  description: "Administrative console for managing celebration requests and invitations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-festive-wine text-festive-cream font-sans">{children}</div>;
}
