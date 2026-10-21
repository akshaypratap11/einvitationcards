import React from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { getCardBySlug } from "@/lib/cards-db";
import { requireAdmin } from "@/lib/require-admin";
import EditCardClient from "./EditCardClient";

export const metadata: Metadata = {
  title: "Edit Invitation | निमंत्रण Utsav",
  description: "Edit your digital invitation details.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPage({ params }: EditPageProps) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const card = await getCardBySlug(params.slug);
  if (!card) {
    notFound();
  }

  return <EditCardClient card={card} />;
}
