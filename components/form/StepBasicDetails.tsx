"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { CardFormValues } from "./schema";

interface StepBasicDetailsProps {
  form: UseFormReturn<CardFormValues>;
}

export default function StepBasicDetails({ form }: StepBasicDetailsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const eventType = watch("type");
  const groomName = watch("groomName");
  const brideName = watch("brideName");
  const currentHashtag = watch("hashtag");

  // Auto-suggest hashtag for wedding if user hasn't explicitly customized it
  useEffect(() => {
    if (eventType === "wedding" && groomName && brideName) {
      const gClean = groomName.trim().replace(/\s+/g, "");
      const bClean = brideName.trim().replace(/\s+/g, "");
      if (gClean && bClean && (!currentHashtag || currentHashtag.startsWith("#"))) {
        setValue("hashtag", `#${gClean}Weds${bClean}`, { shouldDirty: true });
      }
    }
  }, [groomName, brideName, eventType, setValue, currentHashtag]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-festive-gold/20 pb-3">
        <h3 className="font-serif text-xl font-bold text-festive-goldLight">
          Step 1: Basic Details
        </h3>
        <p className="text-xs text-festive-cream/70 mt-1">
          {eventType === "wedding" && "Enter the couple and family celebration details"}
          {eventType === "birthday" && "Enter the birthday star and celebration details"}
          {eventType === "ghar" && "Enter the auspicious house function details"}
        </p>
      </div>

      {/* ADMIN REFERENCE: CUSTOMER NAME */}
      <div className="p-3.5 rounded-2xl bg-festive-gold/10 border border-festive-gold/30">
        <label className="block text-xs uppercase tracking-wider text-festive-goldLight mb-1 font-semibold flex items-center justify-between">
          <span>Customer Name (for my reference only)</span>
          <span className="text-[10px] text-festive-cream/50 lowercase font-normal">not shown on card</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Ramesh Patel (Inquiry #204)"
          {...register("customerName")}
          className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/90 border border-festive-gold/40 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
        />
      </div>
      {/* WEDDING SPECIFIC FIELDS */}
      {eventType === "wedding" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Groom&apos;s Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav"
                {...register("groomName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
              {errors.groomName && (
                <p className="text-rose-400 text-xs mt-1">
                  {errors.groomName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Bride&apos;s Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Diya"
                {...register("brideName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
              {errors.brideName && (
                <p className="text-rose-400 text-xs mt-1">
                  {errors.brideName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Groom&apos;s Parents
              </label>
              <input
                type="text"
                placeholder="e.g. Mr. Rajesh & Mrs. Sunita Malhotra"
                {...register("groomParents")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Bride&apos;s Parents
              </label>
              <input
                type="text"
                placeholder="e.g. Mr. Vikram & Mrs. Anjali Sharma"
                {...register("brideParents")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Groom Instagram (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-festive-gold/70 text-sm">
                  @
                </span>
                <input
                  type="text"
                  placeholder="aarav.malhotra"
                  {...register("groomInsta")}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Bride Instagram (optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-festive-gold/70 text-sm">
                  @
                </span>
                <input
                  type="text"
                  placeholder="diya.sharma"
                  {...register("brideInsta")}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Wedding Hashtag
              </label>
              <input
                type="text"
                placeholder="#AaravWedsDiya"
                {...register("hashtag")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* BIRTHDAY SPECIFIC FIELDS */}
      {eventType === "birthday" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Birthday Person&apos;s Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                {...register("personName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
              {errors.personName && (
                <p className="text-rose-400 text-xs mt-1">
                  {errors.personName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Age Turning
              </label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 25"
                {...register("age")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>

          {/* Birthday Role Selector (Girl / Boy / Man / Woman) */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold flex items-center justify-between">
              <span>Celebrant Role</span>
              <span className="text-[10px] text-festive-cream/60 lowercase font-normal">
                shown as &quot;The Birthday {watch("role") || "Boy"}&quot;
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "Girl", label: "Girl", icon: "👧" },
                { id: "Boy", label: "Boy", icon: "👦" },
                { id: "Woman", label: "Woman", icon: "👩" },
                { id: "Man", label: "Man", icon: "👨" },
              ].map((r) => {
                const currentRole = watch("role") || "Boy";
                const isSelected = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      setValue("role", r.id as "Girl" | "Boy" | "Man" | "Woman", {
                        shouldDirty: true,
                      })
                    }
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-festive-gold text-festive-wine font-bold border-festive-goldLight shadow-md scale-[1.02]"
                        : "bg-festive-wine/70 text-festive-cream/80 border-festive-gold/30 hover:border-festive-gold/60"
                    }`}
                  >
                    <span className="text-base block">{r.icon}</span>
                    <span className="text-xs font-semibold block">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Hosted By (Family / Parents)
              </label>
              <input
                type="text"
                placeholder="e.g. Mr. & Mrs. Sharma"
                {...register("hostName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Celebration Time Text
              </label>
              <input
                type="text"
                placeholder="e.g. 7:00 PM onwards"
                {...register("timeText")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Dress Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Smart Casuals / Party Chic"
                {...register("dressCode")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                RSVP By Date (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 14th November"
                {...register("rsvpBy")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>

          {/* Theme Style Variant Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
              Birthday Theme Variant
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "kids", label: "Kids Fun", desc: "Bright & Bubbly", icon: "🎈" },
                { id: "adult", label: "Adult & Chic", desc: "Elegant Dark & Gold", icon: "🥂" },
                { id: "first", label: "1st Birthday", desc: "Soft Dreamy Pastel", icon: "🧸" },
              ].map((th) => {
                const currentVariant = watch("themeVariant") || "adult";
                const isSelected = currentVariant === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setValue("themeVariant", th.id, { shouldDirty: true })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-festive-gold text-festive-wine font-bold border-festive-goldLight shadow-md scale-[1.02]"
                        : "bg-festive-wine/70 text-festive-cream/80 border-festive-gold/30 hover:border-festive-gold/60"
                    }`}
                  >
                    <span className="text-xl block mb-0.5">{th.icon}</span>
                    <span className="text-xs font-semibold block">{th.label}</span>
                    <span
                      className={`text-[10px] block opacity-75 ${
                        isSelected ? "text-festive-wine" : "text-festive-cream/60"
                      }`}
                    >
                      {th.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GHAR FUNCTION SPECIFIC FIELDS */}
      {eventType === "ghar" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Function Name *
              </label>
              <select
                {...register("functionName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors"
              >
                <option value="Griha Pravesh">गृह प्रवेश (Griha Pravesh)</option>
                <option value="Vastu Puja">वास्तु पूजा एवं शांति (Vastu Shanti)</option>
                <option value="Satyanarayan Katha">श्री सत्यनारायण कथा (Satyanarayan Katha)</option>
                <option value="Mundan Sanskar">मुंडन संस्कार (Mundan Sanskar)</option>
                <option value="Kuan Pujan / Baby Function">कुआँ पूजन / नामकरण</option>
                <option value="Other Function">अन्य मांगलिक उत्सव (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
                Family Name *
              </label>
              <input
                type="text"
                placeholder="e.g. शर्मा परिवार (Sharma Parivar)"
                {...register("familyName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
              {errors.familyName && (
                <p className="text-rose-400 text-xs mt-1">
                  {errors.familyName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Host / Nimantrak Name
              </label>
              <input
                type="text"
                placeholder="e.g. श्री रमेश एवं श्रीमती सुनीता शर्मा"
                {...register("hostName")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Function Time Text
              </label>
              <input
                type="text"
                placeholder="e.g. प्रातः 08:00 बजे से"
                {...register("timeText")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
              Shubh Muhurat / Puja Time Note
            </label>
            <input
              type="text"
              placeholder="e.g. प्रातः 08:15 बजे कलश स्थापना एवं हवन"
              {...register("muhurat")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                Dress Code (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Traditional / Ethnic Wear"
                {...register("dressCode")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
                RSVP By Date (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 10th November"
                {...register("rsvpBy")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* INVITATION MESSAGE (COMMON TO ALL) */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
          Invitation Message / Blessings Note
        </label>
        <textarea
          rows={3}
          {...register("message")}
          placeholder="Write your heartfelt invitation message here..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40 resize-none leading-relaxed"
        />
        <p className="text-[11px] text-festive-cream/60 mt-1">
          This message is prominently displayed on the front of your digital card.
        </p>
      </div>
    </div>
  );
}
