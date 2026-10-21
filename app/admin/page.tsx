import React, { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllCardRequests } from "@/lib/requests-db";
import { getAllCards } from "@/lib/cards-db";
import { requireAdmin } from "@/lib/require-admin";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | निमंत्रण Utsav",
  description: "Administrative console for managing celebration requests and invitations.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const [requests, cards] = await Promise.all([
    getAllCardRequests().catch(() => []),
    getAllCards().catch(() => []),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading admin console...</span>
          </div>
        </div>
      }
    >
      <AdminDashboardClient
        initialRequests={requests}
        initialCards={cards}
      />
    </Suspense>
  );
}
