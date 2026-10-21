import React, { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading invitation details...</span>
          </div>
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
