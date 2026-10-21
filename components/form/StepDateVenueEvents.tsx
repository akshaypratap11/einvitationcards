"use client";

import React, { useEffect } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { CardFormValues } from "./schema";
import { nanoid } from "nanoid";
import PhotoUploader from "./PhotoUploader";

interface StepDateVenueEventsProps {
  form: UseFormReturn<CardFormValues>;
}

const weddingQuickSuggestions = [
  {
    title: "Mehndi Ki Raat",
    tagline: "Hands painted with love, laughter & henna",
    time: "11:00",
  },
  {
    title: "Haldi Ceremony",
    tagline: "A golden glow for the bride & groom to be",
    time: "09:30",
  },
  {
    title: "Sangeet Night",
    tagline: "An evening of music, dance & celebration",
    time: "19:00",
  },
  {
    title: "Baraat & Pheras",
    tagline: "The sacred vows — two souls, one journey",
    time: "18:00",
  },
  {
    title: "Reception Gala",
    tagline: "Raise a toast to the newly-weds",
    time: "19:30",
  },
];

const birthdayQuickSuggestions = [
  {
    title: "Arrival & Welcome Drinks",
    desc: "Enjoy welcome cocktails, mocktails and appetizers as we gather.",
    time: "7:00 PM",
  },
  {
    title: "Cake Cutting",
    desc: "Make a wish with us and celebrate the milestone!",
    time: "8:30 PM",
  },
  {
    title: "Dinner",
    desc: "Delight in a sumptuous celebratory feast.",
    time: "9:00 PM",
  },
  {
    title: "Music & Dance",
    desc: "Hit the dance floor with energetic DJ beats.",
    time: "9:45 PM",
  },
];

const gharQuickSuggestions = [
  {
    title: "Ganesh Pooja & Kalash Sthapana",
    desc: "Invoking auspicious blessings for peace and prosperity.",
    time: "8:00 AM",
  },
  {
    title: "Vastu Shanti Havan",
    desc: "Sacred fire ceremony for sanctifying the new home.",
    time: "9:30 AM",
  },
  {
    title: "Griha Pravesh",
    desc: "Auspicious step into our new abode with family & friends.",
    time: "11:00 AM",
  },
  {
    title: "Aarti & Blessings",
    desc: "Seeking elders' blessings and community prayers.",
    time: "12:15 PM",
  },
  {
    title: "Prasad & Bhojan",
    desc: "Traditional festive feast and Mahaprasad.",
    time: "1:00 PM",
  },
];

export default function StepDateVenueEvents({ form }: StepDateVenueEventsProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const eventType = watch("type");
  const venueName = watch("venueName");
  const venueAddress = watch("venueAddress");
  const mainDate = watch("mainDate");

  // Wedding itinerary array
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "events",
  });

  // Birthday & Ghar celebration schedule array
  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  // Auto-sync map query if user hasn't typed a custom query
  useEffect(() => {
    if (venueName && venueAddress) {
      setValue("mapQuery", `${venueName}, ${venueAddress}`);
    }
  }, [venueName, venueAddress, setValue]);

  const handleAddDefaultEvent = () => {
    if (fields.length >= 8) return;
    const defaultDate = mainDate ? mainDate.slice(0, 10) : "";
    append({
      id: `ev-${nanoid(4)}`,
      title: "",
      tagline: "",
      date: defaultDate,
      time: "18:00",
      venue: venueName || "",
      photo: "",
    });
  };

  const handleQuickAdd = (item: (typeof weddingQuickSuggestions)[0]) => {
    if (fields.length >= 8) return;
    const defaultDate = mainDate ? mainDate.slice(0, 10) : "";
    append({
      id: `ev-${nanoid(4)}`,
      title: item.title,
      tagline: item.tagline,
      date: defaultDate,
      time: item.time,
      venue: venueName || "",
      photo: "",
    });
  };

  const handleQuickAddSchedule = (item: {
    title: string;
    desc: string;
    time: string;
  }) => {
    if (scheduleFields.length >= 8) return;
    appendSchedule({
      id: `sch-${nanoid(4)}`,
      title: item.title,
      desc: item.desc,
      time: item.time,
    });
  };

  const handleAddDefaultSchedule = () => {
    if (scheduleFields.length >= 8) return;
    appendSchedule({
      id: `sch-${nanoid(4)}`,
      title: "",
      desc: "",
      time: eventType === "ghar" ? "10:00 AM" : "8:00 PM",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-festive-gold/20 pb-3">
        <h3 className="font-serif text-xl font-bold text-festive-goldLight">
          Step 2: Date, Venue & {eventType === "wedding" ? "Ceremony Schedule" : eventType === "birthday" ? "Order of Celebration" : "Pooja Schedule"}
        </h3>
        <p className="text-xs text-festive-cream/70 mt-1">
          {eventType === "wedding" && "Specify the primary wedding ceremony date, venue location, and traditional events."}
          {eventType === "birthday" && "Specify the party date, celebration venue, and timeline for the celebration."}
          {eventType === "ghar" && "Specify the auspicious date, venue address, and pooja program schedule."}
        </p>
      </div>

      {/* PRIMARY DATE & VENUE */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
            {eventType === "ghar" ? "Auspicious Date & Time (शुभ तिथि) *" : "Main Celebration Date & Time *"}
          </label>
          <input
            type="datetime-local"
            {...register("mainDate")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors"
          />
          {errors.mainDate && (
            <p className="text-rose-400 text-xs mt-1">
              {errors.mainDate.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
              Venue Name *
            </label>
            <input
              type="text"
              placeholder={
                eventType === "ghar"
                  ? "e.g. Shanti Niwas / Our Residence"
                  : eventType === "birthday"
                  ? "e.g. The Grand Lounge / House #12"
                  : "e.g. Mankameshwar Palace"
              }
              {...register("venueName")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
            />
            {errors.venueName && (
              <p className="text-rose-400 text-xs mt-1">
                {errors.venueName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
              Venue Address / City *
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Royal Palms, Civil Lines, Jaipur"
              {...register("venueAddress")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
            />
            {errors.venueAddress && (
              <p className="text-rose-400 text-xs mt-1">
                {errors.venueAddress.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. WEDDING ITINERARY EVENTS (STAYS EXACTLY AS IS) */}
      {/* ========================================================================= */}
      {eventType === "wedding" && (
        <>
          <div className="pt-2">
            <p className="text-xs uppercase tracking-wider text-festive-goldLight mb-2 font-semibold">
              Quick-Add Traditional Functions ({fields.length}/8):
            </p>
            <div className="flex flex-wrap gap-2">
              {weddingQuickSuggestions.map((item, idx) => {
                const alreadyAdded = fields.some((f) => f.title === item.title);
                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={fields.length >= 8}
                    onClick={() => handleQuickAdd(item)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      alreadyAdded
                        ? "border-festive-gold/50 bg-festive-gold/20 text-festive-goldLight"
                        : "border-festive-gold/30 hover:border-festive-gold text-festive-cream/80 hover:bg-festive-maroon/50"
                    }`}
                  >
                    + {item.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-festive-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-festive-goldLight">
                  Itinerary Events ({fields.length} of 8)
                </h4>
                <p className="text-xs text-festive-cream/70">
                  Each function will appear as an animated itinerary card.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDefaultEvent}
                disabled={fields.length >= 8}
                className="px-3.5 py-2 rounded-xl bg-festive-gold/20 hover:bg-festive-gold/30 border border-festive-gold/50 text-festive-goldLight text-xs font-semibold transition-colors disabled:opacity-40"
              >
                + Add Event
              </button>
            </div>

            {errors.events?.message && (
              <p className="text-rose-400 text-xs">{errors.events.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl bg-festive-maroon/60 border border-festive-gold/25 relative group space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-festive-gold/15">
                    <span className="text-xs font-bold text-festive-gold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-festive-gold/20 border border-festive-gold/40 flex items-center justify-center text-[11px]">
                        {index + 1}
                      </span>
                      Function {index + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Move Up"
                        disabled={index === 0}
                        onClick={() => move(index, index - 1)}
                        className="p-1 rounded text-xs text-festive-goldLight hover:bg-festive-gold/20 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        title="Move Down"
                        disabled={index === fields.length - 1}
                        onClick={() => move(index, index + 1)}
                        className="p-1 rounded text-xs text-festive-goldLight hover:bg-festive-gold/20 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          title="Delete Event"
                          onClick={() => remove(index)}
                          className="p-1 px-2 rounded text-xs text-rose-300 hover:bg-rose-900/40 ml-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sangeet Celebration"
                        {...register(`events.${index}.title` as const)}
                        className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                      />
                      {errors.events?.[index]?.title && (
                        <p className="text-rose-400 text-[10px] mt-0.5">
                          {errors.events[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1">
                        Tagline / Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dance, music and cocktail evening"
                        {...register(`events.${index}.tagline` as const)}
                        className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        {...register(`events.${index}.date` as const)}
                        className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1">
                        Time *
                      </label>
                      <input
                        type="time"
                        {...register(`events.${index}.time` as const)}
                        className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1">
                        Venue Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Courtyard Lawn"
                        {...register(`events.${index}.venue` as const)}
                        className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-festive-gold/15">
                    <PhotoUploader
                      mode="single"
                      label="Ceremony Photo (Optional)"
                      helperText="Appears as cover/background for this ceremony card"
                      aspectRatio="landscape"
                      value={watch(`events.${index}.photo` as const) || ""}
                      onChange={(url) =>
                        setValue(`events.${index}.photo` as const, url, {
                          shouldDirty: true,
                        })
                      }
                      placeholderText="Upload photo for this ceremony"
                      tempId={`event-${field.id || index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. BIRTHDAY OR GHAR DYNAMIC SCHEDULE (TIMELINE LIST 1 TO 8 ROWS) */}
      {/* ========================================================================= */}
      {(eventType === "birthday" || eventType === "ghar") && (
        <div className="space-y-4 pt-4 border-t border-festive-gold/20">
          {/* Quick-add chips */}
          <div>
            <p className="text-xs uppercase tracking-wider text-festive-goldLight mb-2 font-semibold">
              {eventType === "birthday"
                ? `Quick-Add Celebration Highlights (${scheduleFields.length}/8):`
                : `Quick-Add Auspicious Rituals (${scheduleFields.length}/8):`}
            </p>
            <div className="flex flex-wrap gap-2">
              {(eventType === "birthday"
                ? birthdayQuickSuggestions
                : gharQuickSuggestions
              ).map((item, idx) => {
                const alreadyAdded = scheduleFields.some(
                  (f) => f.title === item.title
                );
                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={scheduleFields.length >= 8}
                    onClick={() => handleQuickAddSchedule(item)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      alreadyAdded
                        ? "border-festive-gold/50 bg-festive-gold/20 text-festive-goldLight"
                        : "border-festive-gold/30 hover:border-festive-gold text-festive-cream/80 hover:bg-festive-maroon/50"
                    }`}
                  >
                    + {item.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule list header */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="font-serif text-lg font-bold text-festive-goldLight">
                {eventType === "birthday"
                  ? "Order of Celebration"
                  : "Pooja & Ceremony Schedule"}{" "}
                ({scheduleFields.length} of 8)
              </h4>
              <p className="text-xs text-festive-cream/70">
                {eventType === "birthday"
                  ? "A celebratory timeline with times, highlights and descriptions."
                  : "Sequential timeline of sacred rituals, havan, and prasad."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddDefaultSchedule}
              disabled={scheduleFields.length >= 8}
              className="px-3.5 py-2 rounded-xl bg-festive-gold/20 hover:bg-festive-gold/30 border border-festive-gold/50 text-festive-goldLight text-xs font-semibold transition-colors disabled:opacity-40"
            >
              + Add Item
            </button>
          </div>

          {errors.schedule?.message && (
            <p className="text-rose-400 text-xs">{errors.schedule.message}</p>
          )}

          {/* Dynamic Schedule Rows */}
          <div className="space-y-3">
            {scheduleFields.map((field, index) => (
              <div
                key={field.id}
                className="p-3.5 rounded-2xl bg-festive-maroon/60 border border-festive-gold/25 space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-festive-gold/15">
                  <span className="text-xs font-bold text-festive-gold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-festive-gold/20 border border-festive-gold/40 flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    <span>
                      {eventType === "birthday" ? "Event" : "Ritual"} {index + 1}
                    </span>
                  </span>

                  {scheduleFields.length > 1 && (
                    <button
                      type="button"
                      title="Remove Item"
                      onClick={() => removeSchedule(index)}
                      className="p-1 px-2 rounded text-xs text-rose-300 hover:bg-rose-900/40"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1 font-semibold">
                      Time Text *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8:00 PM"
                      {...register(`schedule.${index}.time` as const)}
                      className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                    />
                    {errors.schedule?.[index]?.time && (
                      <p className="text-rose-400 text-[10px] mt-0.5">
                        {errors.schedule[index]?.time?.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1 font-semibold">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder={
                        eventType === "birthday"
                          ? "e.g. Cake Cutting & Cheers"
                          : "e.g. Vastu Shanti Havan"
                      }
                      {...register(`schedule.${index}.title` as const)}
                      className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                    />
                    {errors.schedule?.[index]?.title && (
                      <p className="text-rose-400 text-[10px] mt-0.5">
                        {errors.schedule[index]?.title?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-festive-cream/80 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder={
                      eventType === "birthday"
                        ? "e.g. Make a wish with us and celebrate!"
                        : "e.g. Sacred Vedic chanting and auspicious fire ritual."
                    }
                    {...register(`schedule.${index}.desc` as const)}
                    className="w-full px-3 py-2 rounded-lg bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
