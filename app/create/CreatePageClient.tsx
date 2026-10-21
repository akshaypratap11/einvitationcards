"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { EventType } from "@/types/card";
import OccasionPicker from "@/components/form/OccasionPicker";
import CreateWizard from "@/components/form/CreateWizard";

const VALID_TYPES: EventType[] = ["wedding", "birthday", "ghar"];

interface CreatePageClientProps {
  searchParamsType?: string;
  requestId?: string;
}

export default function CreatePageClient({
  searchParamsType,
  requestId: propRequestId,
}: CreatePageClientProps) {
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") || searchParamsType;
  const requestId = searchParams.get("requestId") || propRequestId;

  const isValidType = rawType && VALID_TYPES.includes(rawType as EventType);

  if (!isValidType) {
    return <OccasionPicker />;
  }

  return (
    <CreateWizard
      initialType={rawType as EventType}
      requestId={requestId}
    />
  );
}
