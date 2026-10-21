"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CardFormValues } from "./schema";
import PhotoUploader from "./PhotoUploader";

interface StepPhotosProps {
  form: UseFormReturn<CardFormValues>;
}

export default function StepPhotos({ form }: StepPhotosProps) {
  const { watch, setValue } = form;
  const eventType = watch("type");
  const groomPhoto = watch("groomPhoto");
  const bridePhoto = watch("bridePhoto");
  const heroPhoto = watch("heroPhoto");
  const photo1 = watch("photo1");
  const photo2 = watch("photo2");
  const gallery = watch("gallery") || [];

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-festive-gold/20 pb-3">
        <h3 className="font-serif text-xl font-bold text-festive-goldLight">
          Step 3: Photographs & Gallery
        </h3>
        <p className="text-xs text-festive-cream/70 mt-1">
          {eventType === "wedding" && "Add portraits and memorable snapshots for your animated wedding card."}
          {eventType === "birthday" && "Upload Then & Now throwback memories and celebration gallery snapshots."}
          {eventType === "ghar" && "Upload Old Home vs New Home memories, mandir photos, and family moments."}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. WEDDING PORTRAITS (STAYS EXACTLY AS IS) */}
      {/* ========================================================================= */}
      {eventType === "wedding" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Groom Photo */}
            <div className="p-4 rounded-2xl bg-festive-wine/60 border border-festive-gold/25 space-y-3">
              <PhotoUploader
                mode="single"
                label="Groom's Portrait"
                helperText="Used in the couple animation & wedding crest"
                aspectRatio="portrait"
                value={groomPhoto || ""}
                onChange={(url) =>
                  setValue("groomPhoto", url, { shouldDirty: true })
                }
                placeholderText="Select Groom's photo"
                tempId="wedding-portraits"
              />
            </div>

            {/* Bride Photo */}
            <div className="p-4 rounded-2xl bg-festive-wine/60 border border-festive-gold/25 space-y-3">
              <PhotoUploader
                mode="single"
                label="Bride's Portrait"
                helperText="Used in the couple animation & wedding crest"
                aspectRatio="portrait"
                value={bridePhoto || ""}
                onChange={(url) =>
                  setValue("bridePhoto", url, { shouldDirty: true })
                }
                placeholderText="Select Bride's photo"
                tempId="wedding-portraits"
              />
            </div>
          </div>

          {/* Optional Couple Banner / Hero Photo */}
          <div className="p-4 rounded-2xl bg-festive-wine/40 border border-festive-gold/20 space-y-3">
            <PhotoUploader
              mode="single"
              label="Cover / Couple Banner Photo (Optional)"
              helperText="Optional widescreen couple portrait"
              aspectRatio="landscape"
              value={heroPhoto || ""}
              onChange={(url) =>
                setValue("heroPhoto", url, { shouldDirty: true })
              }
              placeholderText="Select couple banner photo"
              tempId="wedding-hero"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BIRTHDAY PHOTOS: THEN & NOW PAIR + CELEBRANT HERO */}
      {/* ========================================================================= */}
      {eventType === "birthday" && (
        <div className="space-y-6">
          {/* Pair Photos: Then / Childhood vs Now */}
          <div className="p-5 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30 space-y-4">
            <div>
              <h4 className="font-serif text-base font-bold text-festive-goldLight flex items-center gap-2">
                <span>📸</span>
                <span>Then &amp; Now Photo Pair (Optional)</span>
              </h4>
              <p className="text-xs text-festive-cream/70 mt-0.5">
                Guests love seeing the sweet throwback comparison of childhood vs today!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-festive-wine/50 border border-festive-gold/20">
                <PhotoUploader
                  mode="single"
                  label="Photo 1: Then (Childhood / Early Years)"
                  helperText="A nostalgic snapshot from childhood"
                  aspectRatio="square"
                  value={photo1 || ""}
                  onChange={(url) => setValue("photo1", url, { shouldDirty: true })}
                  placeholderText="Upload childhood photo"
                  tempId="birthday-then"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-festive-wine/50 border border-festive-gold/20">
                <PhotoUploader
                  mode="single"
                  label="Photo 2: Now (Birthday Star Today)"
                  helperText="Recent portrait of the celebrant"
                  aspectRatio="square"
                  value={photo2 || ""}
                  onChange={(url) => setValue("photo2", url, { shouldDirty: true })}
                  placeholderText="Upload recent photo"
                  tempId="birthday-now"
                />
              </div>
            </div>
          </div>

          {/* Main Celebrant Hero / Profile Photo */}
          <div className="p-4 rounded-2xl bg-festive-wine/60 border border-festive-gold/25 space-y-3 max-w-md">
            <PhotoUploader
              mode="single"
              label="Birthday Celebrant's Portrait"
              helperText="Featured inside the decorative frame on the birthday card"
              aspectRatio="portrait"
              value={heroPhoto || ""}
              onChange={(url) =>
                setValue("heroPhoto", url, { shouldDirty: true })
              }
              placeholderText="Upload celebrant's photo"
              tempId="birthday-portrait"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GHAR FUNCTION PHOTOS: OLD HOME & NEW HOME PAIR + MANDIR HERO */}
      {/* ========================================================================= */}
      {eventType === "ghar" && (
        <div className="space-y-6">
          {/* Pair Photos: Old Home vs New Home */}
          <div className="p-5 rounded-2xl bg-festive-maroon/70 border border-festive-gold/30 space-y-4">
            <div>
              <h4 className="font-serif text-base font-bold text-festive-goldLight flex items-center gap-2">
                <span>🏡</span>
                <span>Old Home &amp; New Home Journey (Optional)</span>
              </h4>
              <p className="text-xs text-festive-cream/70 mt-0.5">
                Celebrate your family’s milestone journey from where it began to your new dream abode.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-festive-wine/50 border border-festive-gold/20">
                <PhotoUploader
                  mode="single"
                  label="Photo 1: Old Home / Cherished Beginnings"
                  helperText="Memories of where your family journey started"
                  aspectRatio="landscape"
                  value={photo1 || ""}
                  onChange={(url) => setValue("photo1", url, { shouldDirty: true })}
                  placeholderText="Upload old home / memories"
                  tempId="ghar-old"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-festive-wine/50 border border-festive-gold/20">
                <PhotoUploader
                  mode="single"
                  label="Photo 2: New Home / Dream Realized"
                  helperText="Your new home, entrance, or balcony"
                  aspectRatio="landscape"
                  value={photo2 || ""}
                  onChange={(url) => setValue("photo2", url, { shouldDirty: true })}
                  placeholderText="Upload new home photo"
                  tempId="ghar-new"
                />
              </div>
            </div>
          </div>

          {/* Main New Home / Family / Mandir Photo */}
          <div className="p-4 rounded-2xl bg-festive-wine/60 border border-festive-gold/25 space-y-3 max-w-lg">
            <PhotoUploader
              mode="single"
              label="New Home / Family / Mandir Photo"
              helperText="Displayed prominently on your Griha Pravesh invitation"
              aspectRatio="landscape"
              value={heroPhoto || ""}
              onChange={(url) =>
                setValue("heroPhoto", url, { shouldDirty: true })
              }
              placeholderText="Upload home or pooja photo"
              tempId="ghar-photo"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CHERISHED MOMENTS GALLERY (COMMON TO ALL EVENT TYPES) */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-festive-maroon/60 border border-festive-gold/30 space-y-4">
        <div>
          <h4 className="font-serif text-lg font-bold text-festive-goldLight flex items-center gap-2">
            <span>✨</span>
            <span>Cherished Memories Gallery</span>
          </h4>
          <p className="text-xs text-festive-cream/70 mt-0.5">
            Upload up to 12 photos. Guests can browse these memories in an interactive photo grid.
          </p>
        </div>

        <PhotoUploader
          mode="multi"
          maxFiles={12}
          value={gallery}
          onChange={(urls) => setValue("gallery", urls, { shouldDirty: true })}
          tempId="card-gallery"
        />
      </div>

      {/* Helpful Fallback Note */}
      <div className="p-3.5 rounded-xl bg-festive-wine/70 border border-festive-gold/20 text-xs text-festive-cream/80 flex items-start gap-2.5">
        <span className="text-festive-gold text-sm leading-none mt-0.5">✦</span>
        <span>
          <strong>All photos are optional:</strong> If photos are omitted, your card automatically displays regal gold initial-letter crests and auspicious Vedic emblems.
        </span>
      </div>
    </div>
  );
}
