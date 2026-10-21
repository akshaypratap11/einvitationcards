import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitation Ready! | निमंत्रण Utsav",
  description: "Your digital invitation card is ready to share.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
