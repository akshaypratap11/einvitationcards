import React, { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import CreatePageClient from "./CreatePageClient";

interface CreatePageProps {
  searchParams: {
    type?: string;
    requestId?: string;
  };
}

export const metadata: Metadata = {
  title: "Create Invitation | Admin Console",
  description: "Design and customize animated invitations.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function CreatePage({ searchParams }: CreatePageProps) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const initialType = searchParams?.type;
  const requestId = searchParams?.requestId;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading celebration studio...</span>
          </div>
        </div>
      }
    >
      <CreatePageClient
        searchParamsType={initialType}
        requestId={requestId}
      />
    </Suspense>
  );
}
