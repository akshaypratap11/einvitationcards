"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventType, CardData, EventItem } from "@/types/card";
import { cardFormSchema, CardFormValues, getDefaultFormValues } from "./schema";
import { makeSlug } from "@/lib/slug";
import StepBasicDetails from "./StepBasicDetails";
import StepDateVenueEvents from "./StepDateVenueEvents";
import StepPhotos from "./StepPhotos";
import StepContactReview from "./StepContactReview";
import LiveCardPreview from "./LiveCardPreview";

interface CreateWizardProps {
  initialType: EventType;
  initialData?: CardFormValues;
  editMode?: boolean;
  editSlug?: string;
  requestId?: string;
}

const STEPS = [
  { id: 0, key: "basic", label: "Basic Details", icon: "✦" },
  { id: 1, key: "schedule", label: "Date & Venue", icon: "📅" },
  { id: 2, key: "photos", label: "Photos", icon: "📸" },
  { id: 3, key: "contact", label: "Review & RSVP", icon: "✉" },
];

export default function CreateWizard({
  initialType,
  initialData,
  editMode = false,
  editSlug,
  requestId,
}: CreateWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const localStorageKey = `einvite_draft_${initialType}`;

  // Form setup with Zod resolver
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: initialData || getDefaultFormValues(initialType),
    mode: "onChange",
  });

  const {
    watch,
    trigger,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Prefill from customer request if requestId is present
  useEffect(() => {
    if (!requestId) return;
    fetch(`/api/requests/${requestId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.request) {
          const req = json.request;
          const defaults = getDefaultFormValues(req.type || initialType);
          const prefilled: Partial<CardFormValues> = {
            ...defaults,
            type: req.type || initialType,
            customerName: req.name,
            contactName: req.name,
            contactPhone: req.phone,
            contactEmail: req.email || "",
            venueName: req.venue || (req.city ? `${req.city} Banquet Hall` : defaults.venueName),
            venueAddress: req.city ? `${req.venue ? req.venue + ", " : ""}${req.city}` : defaults.venueAddress,
          };

          if (req.event_date) {
            prefilled.mainDate = req.event_date.includes("T")
              ? req.event_date
              : `${req.event_date}T18:00`;
          }

          if (req.type === "wedding" && req.details) {
            if (req.details.groomName) prefilled.groomName = String(req.details.groomName);
            if (req.details.brideName) prefilled.brideName = String(req.details.brideName);
            if (req.details.groomParents) prefilled.groomParents = String(req.details.groomParents);
            if (req.details.brideParents) prefilled.brideParents = String(req.details.brideParents);
            if (Array.isArray(req.details.eventsWanted) && req.details.eventsWanted.length > 0) {
              prefilled.events = req.details.eventsWanted.map((evTitle: string, idx: number) => ({
                id: `ev-${idx + 1}`,
                title: evTitle,
                tagline: `Celebration of ${evTitle}`,
                date: req.event_date || new Date().toISOString().split("T")[0],
                time: "18:00",
                venue: req.venue || req.city || "Celebration Hall",
              }));
            }
          } else if (req.type === "birthday" && req.details) {
            if (req.details.personName) prefilled.personName = String(req.details.personName);
            if (req.details.age) prefilled.age = Number(req.details.age);
            if (req.details.role) prefilled.role = req.details.role as "Girl" | "Boy" | "Man" | "Woman";
            if (req.details.theme) prefilled.themeVariant = String(req.details.theme);
            if (req.details.hostName) prefilled.hostName = String(req.details.hostName);
            if (req.details.timeText) prefilled.timeText = String(req.details.timeText);
            if (req.details.dressCode) prefilled.dressCode = String(req.details.dressCode);
            if (req.details.rsvpBy) prefilled.rsvpBy = String(req.details.rsvpBy);
            if (Array.isArray(req.details.schedule) && req.details.schedule.length > 0) {
              prefilled.schedule = req.details.schedule;
            }
          } else if (req.type === "ghar" && req.details) {
            if (req.details.functionName) prefilled.functionName = String(req.details.functionName);
            if (req.details.familyName) prefilled.familyName = String(req.details.familyName);
            if (req.details.muhurat) prefilled.muhurat = String(req.details.muhurat);
            if (req.details.hostName) prefilled.hostName = String(req.details.hostName);
            if (req.details.timeText) prefilled.timeText = String(req.details.timeText);
            if (req.details.dressCode) prefilled.dressCode = String(req.details.dressCode);
            if (req.details.rsvpBy) prefilled.rsvpBy = String(req.details.rsvpBy);
            if (Array.isArray(req.details.schedule) && req.details.schedule.length > 0) {
              prefilled.schedule = req.details.schedule;
            }
          }

          reset({ ...defaults, ...prefilled });
          setHasRestoredDraft(true);
        }
      })
      .catch((err) => console.warn("Failed to prefill from request:", err));
  }, [requestId, initialType, reset]);

  // Restore draft from localStorage on initial mount (skip if editing existing card or prefilling request)
  useEffect(() => {
    if (editMode || requestId) return;
    try {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          reset(parsed);
          setHasRestoredDraft(true);
        }
      }
    } catch {
      // Could not load draft from localStorage
    }
  }, [localStorageKey, reset, editMode, requestId]);

  // Autosave form state to localStorage whenever values change (only in creation mode)
  useEffect(() => {
    if (editMode) return;
    const subscription = watch((values) => {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(values));
        const now = new Date();
        setLastSavedTime(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch {
        // Handle storage quota issues gracefully
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, localStorageKey, editMode]);

  // Reset draft to defaults
  const handleResetDraft = () => {
    if (
      window.confirm(
        "Are you sure you want to reset this card draft? All your unsaved changes will be lost."
      )
    ) {
      localStorage.removeItem(localStorageKey);
      reset(getDefaultFormValues(initialType));
      setCurrentStep(0);
      setHasRestoredDraft(false);
      setLastSavedTime(null);
    }
  };

  // Step validation before advancing
  const handleNextStep = async () => {
    let stepValid = false;

    if (currentStep === 0) {
      if (initialType === "wedding") {
        stepValid = await trigger(["groomName", "brideName"]);
      } else if (initialType === "birthday") {
        stepValid = await trigger(["personName"]);
      } else if (initialType === "ghar") {
        stepValid = await trigger(["familyName"]);
      }
    } else if (currentStep === 1) {
      if (initialType === "wedding") {
        stepValid = await trigger(["mainDate", "venueName", "venueAddress", "events"]);
      } else {
        stepValid = await trigger(["mainDate", "venueName", "venueAddress", "schedule"]);
      }
    } else if (currentStep === 2) {
      stepValid = true; // Photos step is optional for now
    } else if (currentStep === 3) {
      stepValid = await trigger(["contactName", "contactPhone"]);
    }

    if (stepValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Convert watched form values into complete CardData for live preview
  const watchedValues = watch();

  const previewCardData: CardData = {
    type: watchedValues.type || initialType,
    lang: watchedValues.lang || "en",
    groomName: watchedValues.groomName || "Groom",
    brideName: watchedValues.brideName || "Bride",
    groomParents: watchedValues.groomParents,
    brideParents: watchedValues.brideParents,
    groomInsta: watchedValues.groomInsta,
    brideInsta: watchedValues.brideInsta,
    groomPhoto: watchedValues.groomPhoto,
    bridePhoto: watchedValues.bridePhoto,
    personName: watchedValues.personName,
    role: watchedValues.role,
    age: watchedValues.age,
    themeVariant: watchedValues.themeVariant,
    hostName: watchedValues.hostName,
    dressCode: watchedValues.dressCode,
    rsvpBy: watchedValues.rsvpBy,
    timeText: watchedValues.timeText,
    photo1: watchedValues.photo1,
    photo2: watchedValues.photo2,
    schedule: watchedValues.schedule,
    functionName: watchedValues.functionName,
    familyName: watchedValues.familyName,
    muhurat: watchedValues.muhurat,
    heroPhoto: watchedValues.heroPhoto,
    message: watchedValues.message,
    hashtag: watchedValues.hashtag,
    mainDate: watchedValues.mainDate || new Date().toISOString(),
    venueName: watchedValues.venueName || "Grand Palace Hotel",
    venueAddress: watchedValues.venueAddress || "Vasant Kunj, New Delhi",
    mapQuery: watchedValues.mapQuery,
    events:
      watchedValues.events && watchedValues.events.length > 0
        ? (watchedValues.events as EventItem[])
        : [
            {
              id: "ev-default",
              title: "Auspicious Ceremony",
              date: (watchedValues.mainDate || new Date().toISOString()).slice(0, 10),
              time: "18:00",
              venue: watchedValues.venueName || "Grand Palace Hotel",
            },
          ],
    gallery: watchedValues.gallery || [],
    contactName: watchedValues.contactName || "Host",
    contactPhone: watchedValues.contactPhone || "+91 75210 38818",
    contactEmail: watchedValues.contactEmail,
    rsvpEnabled: watchedValues.rsvpEnabled ?? true,
    musicUrl: watchedValues.musicUrl,
  };

  const onSubmit = async (values: CardFormValues) => {
    setIsPublishing(true);
    setPublishError(null);

    if (editMode && editSlug) {
      // EDIT MODE: Call PUT /api/cards/[slug]
      try {
        const res = await fetch(`/api/cards/${editSlug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: values,
            customer_name: values.customerName,
          }),
        });

        if (res.status === 401) {
          setPublishError("Session expired, please log in again");
          setTimeout(() => {
            window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
          }, 1000);
          return;
        }

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed to update card.");
        }

        router.push("/admin?tab=cards");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update card.";
        setPublishError(msg);
      } finally {
        setIsPublishing(false);
      }
    } else {
      // CREATION MODE: Generate slug, then POST /api/cards
      try {
        const slugPrimaryName =
          values.type === "wedding"
            ? values.groomName || "wedding"
            : values.type === "birthday"
            ? values.personName || "birthday"
            : values.familyName || "griha-pravesh";

        const slugSecondaryName = values.type === "wedding" ? values.brideName : undefined;
        const slug = makeSlug(slugPrimaryName, slugSecondaryName);

        const res = await fetch("/api/cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            type: values.type,
            data: values,
            customer_name: values.customerName,
            request_id: requestId,
          }),
        });

        if (res.status === 401) {
          setPublishError("Session expired, please log in again");
          setTimeout(() => {
            window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
          }, 1000);
          return;
        }

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed to create card.");
        }

        // Clean up draft from localStorage
        try {
          localStorage.removeItem(localStorageKey);
        } catch {
          // Ignore
        }

        router.push("/admin?tab=cards");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to create invitation.";
        setPublishError(msg);
      } finally {
        setIsPublishing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream festive-pattern-bg flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-festive-wine/95 backdrop-blur-md border-b border-festive-gold/25 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-festive-cream/70 hover:text-festive-gold flex items-center gap-1.5 transition-colors"
          >
            <span>←</span>
            <span>Admin Console</span>
          </Link>

          <span className="text-festive-gold/30">|</span>

          <div className="flex items-center gap-2">
            <span className="text-lg">
              {initialType === "wedding" ? "💍" : initialType === "birthday" ? "🎂" : "🪔"}
            </span>
            <span className="font-serif font-bold text-festive-goldLight text-sm sm:text-base capitalize">
              {editMode
                ? `Edit ${initialType === "wedding" ? "Wedding" : initialType === "birthday" ? "Birthday" : "Ghar"} Card`
                : initialType === "wedding"
                ? "Royal Wedding Card"
                : initialType === "birthday"
                ? "Birthday Celebration Card"
                : "Griha Pravesh & Puja Card"}
            </span>
            {editMode && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                Editing
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autosave status indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-festive-cream/70 bg-festive-maroon/60 px-3 py-1 rounded-full border border-festive-gold/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {lastSavedTime ? `Autosaved at ${lastSavedTime}` : "Draft autosave enabled"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetDraft}
            className="text-xs text-festive-gold/80 hover:text-rose-300 transition-colors underline decoration-dotted"
            title="Reset draft and start clean"
          >
            Reset
          </button>

          {/* Mobile Preview Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="lg:hidden px-3 py-1.5 rounded-full bg-festive-gold text-festive-wine font-semibold text-xs flex items-center gap-1.5 shadow-md"
          >
            <span>👁</span>
            <span>Preview</span>
          </button>
        </div>
      </header>

      {/* Draft Restored Banner */}
      {hasRestoredDraft && (
        <div className="bg-festive-gold/15 border-b border-festive-gold/30 px-4 py-1.5 text-center text-xs text-festive-goldLight flex items-center justify-center gap-2">
          <span>✨ Restored your previously saved draft from this device.</span>
          <button
            type="button"
            onClick={() => setHasRestoredDraft(false)}
            className="text-festive-cream/80 hover:text-festive-cream text-[11px] underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Layout: Form Left, Scaled Preview Right */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Stepper Wizard (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-6 pb-24 lg:pb-8">
          {/* Stepper Progress Bar */}
          <div className="bg-festive-maroon/70 border border-festive-gold/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md">
            <div className="flex items-center justify-between relative">
              {/* Connector line between steps */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-festive-gold/20 -z-0" />
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-festive-gold transition-all duration-300 -z-0"
                style={{
                  width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                }}
              />

              {STEPS.map((step, idx) => {
                const isActive = currentStep === idx;
                const isCompleted = currentStep > idx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      // Allow clicking on previous steps or current step
                      if (idx <= currentStep) {
                        setCurrentStep(idx);
                      }
                    }}
                    className={`relative z-10 flex flex-col items-center gap-1.5 focus:outline-none transition-transform ${
                      isActive ? "scale-105" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 ${
                        isActive
                          ? "bg-festive-gold text-festive-wine border-festive-goldLight shadow-lg ring-2 ring-festive-gold/40"
                          : isCompleted
                          ? "bg-festive-wine text-festive-gold border-festive-gold"
                          : "bg-festive-maroon text-festive-cream/40 border-festive-gold/30"
                      }`}
                    >
                      {isCompleted ? "✓" : step.icon}
                    </div>
                    <span
                      className={`text-[11px] font-medium tracking-tight hidden sm:block ${
                        isActive
                          ? "text-festive-goldLight font-bold"
                          : isCompleted
                          ? "text-festive-gold"
                          : "text-festive-cream/50"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Step Body */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-festive-maroon/70 border border-festive-gold/30 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-maroon-deep space-y-6"
          >
            {currentStep === 0 && <StepBasicDetails form={form} />}
            {currentStep === 1 && <StepDateVenueEvents form={form} />}
            {currentStep === 2 && <StepPhotos form={form} />}
            {currentStep === 3 && <StepContactReview form={form} />}

            {/* Publish Error Banner */}
            {publishError && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{publishError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPublishError(null)}
                  className="text-rose-300 hover:text-white text-xs font-bold px-2 py-0.5"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 border-t border-festive-gold/20 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 0 || isPublishing}
                className="px-5 py-2.5 rounded-xl border border-festive-gold/30 text-festive-cream/80 hover:text-festive-cream hover:border-festive-gold transition-colors text-sm font-medium disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Back
              </button>

              <div className="flex items-center gap-3">
                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-festive-gold text-festive-wine hover:bg-festive-goldLight transition-colors text-sm font-bold shadow-md flex items-center gap-2"
                  >
                    <span>Continue</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isPublishing || isSubmitting}
                    className="px-7 py-3 rounded-xl bg-festive-gold text-festive-wine hover:bg-festive-goldLight transition-all text-sm font-bold shadow-lg flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-festive-wine border-t-transparent animate-spin" />
                        <span>{editMode ? "Saving Changes..." : "Creating Invitation..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{editMode ? "Save Changes" : "Create my invitation"}</span>
                        <span>✨</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Live Card Preview (Desktop 5 cols) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-20 h-[calc(100vh-6rem)]">
          <div className="h-full rounded-3xl overflow-hidden border border-festive-gold/40 shadow-2xl bg-festive-wine/80">
            <LiveCardPreview
              data={previewCardData}
              type={initialType}
              isModal={false}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Preview Modal / Drawer */}
      {isMobilePreviewOpen && (
        <LiveCardPreview
          data={previewCardData}
          type={initialType}
          isModal={true}
          onCloseModal={() => setIsMobilePreviewOpen(false)}
        />
      )}

      {/* Mobile Bottom Sticky Bar for quick actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-festive-wine/95 backdrop-blur-lg border-t border-festive-gold/30 p-3 px-4 flex items-center justify-between shadow-2xl">
        <span className="text-xs font-serif text-festive-gold">
          Step {currentStep + 1} of {STEPS.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-festive-maroon border border-festive-gold/50 text-festive-goldLight text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>👁 Live Preview</span>
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 rounded-xl bg-festive-gold text-festive-wine font-bold text-xs shadow-md"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              disabled={isPublishing || isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="px-4 py-2 rounded-xl bg-festive-gold text-festive-wine font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-1.5"
            >
              {isPublishing ? (
                <>
                  <div className="w-3 h-3 rounded-full border-2 border-festive-wine border-t-transparent animate-spin" />
                  <span>{editMode ? "Saving..." : "Creating..."}</span>
                </>
              ) : (
                <span>{editMode ? "Save Changes" : "Create Card ✨"}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
