"use client";

import React from "react";
import { CardRecord } from "@/types/card";
import { CardFormValues } from "@/components/form/schema";
import CreateWizard from "@/components/form/CreateWizard";

interface EditCardClientProps {
  card: CardRecord;
}

export default function EditCardClient({ card }: EditCardClientProps) {
  const initialData = {
    ...card.data,
    customerName: card.customer_name || card.data?.customerName || "",
  } as CardFormValues;

  return (
    <CreateWizard
      initialType={card.type}
      initialData={initialData}
      editMode={true}
      editSlug={card.slug}
    />
  );
}
