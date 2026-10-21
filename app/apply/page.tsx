import React, { Suspense } from "react";
import { Metadata } from "next";
import ApplyClient from "./ApplyClient";
import { EventType } from "@/types/card";

export const metadata: Metadata = {
  title: "Apply for a Digital Invitation Card | निमंत्रण Utsav",
  description:
    "Request your custom animated Indian digital invitation card for Weddings, Birthdays, and Griha Pravesh. Submit details in 2 minutes and share photos via WhatsApp.",
  alternates: {
    canonical: "/apply",
  },
};

interface ApplyPageProps {
  searchParams: {
    type?: string;
  };
}

export default function ApplyPage({ searchParams }: ApplyPageProps) {
  const rawType = searchParams?.type || "wedding";
  const validTypes: EventType[] = ["wedding", "birthday", "ghar"];
  const initialType: EventType = validTypes.includes(rawType as EventType)
    ? (rawType as EventType)
    : "wedding";

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading application form...</span>
          </div>
        </div>
      }
    >
      <ApplyClient initialType={initialType} />
    </Suspense>
  );
}
