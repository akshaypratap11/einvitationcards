import { z } from "zod";
import { EventType } from "@/types/card";

// Indian mobile phone regex: 10 digits, optionally starting with +91 or 91 or 0
const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[- ]*\s*)?|[0]?)?[6789]\d{9}$/;

export const eventItemSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Event title is required"),
  tagline: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().optional().default(""),
  photo: z.string().optional(),
});

export const scheduleItemSchema = z.object({
  id: z.string(),
  time: z.string().min(1, "Time is required"),
  title: z.string().min(2, "Title is required"),
  desc: z.string().optional(),
});

export const cardFormSchema = z
  .object({
    type: z.enum(["wedding", "birthday", "ghar"]),
    lang: z.enum(["en", "hi"]).default("en"),
    customerName: z.string().optional(),

    // Wedding fields
    groomName: z.string().optional(),
    brideName: z.string().optional(),
    groomParents: z.string().optional(),
    brideParents: z.string().optional(),
    groomInsta: z.string().optional(),
    brideInsta: z.string().optional(),
    groomPhoto: z.string().optional(),
    bridePhoto: z.string().optional(),
    hashtag: z.string().optional(),

    // Birthday fields
    personName: z.string().optional(),
    role: z.enum(["Girl", "Boy", "Man", "Woman"]).optional(),
    age: z.coerce.number().optional(),
    themeVariant: z.string().optional(),

    // Ghar fields
    functionName: z.string().optional(),
    familyName: z.string().optional(),
    muhurat: z.string().optional(),

    // Shared celebration details
    hostName: z.string().optional(),
    dressCode: z.string().optional(),
    rsvpBy: z.string().optional(),
    timeText: z.string().optional(),
    photo1: z.string().optional(),
    photo2: z.string().optional(),
    schedule: z
      .array(scheduleItemSchema)
      .max(8, "Maximum 8 schedule items allowed")
      .optional()
      .default([]),

    // Shared Details
    heroPhoto: z.string().optional(),
    message: z.string().optional(),
    mainDate: z.string().min(1, "Main ceremony date and time is required"),
    venueName: z.string().min(2, "Venue name is required"),
    venueAddress: z.string().min(3, "Venue address is required"),
    mapQuery: z.string().optional(),

    // Dynamic events (kept for Wedding itinerary only)
    events: z
      .array(eventItemSchema)
      .max(8, "Maximum 8 events allowed")
      .optional()
      .default([]),

    // Gallery & Contact
    gallery: z.array(z.string()).default([]),
    contactName: z.string().min(2, "Contact person name is required"),
    contactPhone: z
      .string()
      .min(10, "Phone number is required")
      .refine(
        (val) => indianPhoneRegex.test(val.replace(/\s+/g, "")),
        "Please enter a valid 10-digit Indian phone number (e.g. 9876543210)"
      ),
    contactEmail: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    rsvpEnabled: z.boolean().default(true),
    musicUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Custom validation per event type
    if (data.type === "wedding") {
      if (!data.groomName || data.groomName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["groomName"],
          message: "Groom's name is required (min 2 characters)",
        });
      }
      if (!data.brideName || data.brideName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["brideName"],
          message: "Bride's name is required (min 2 characters)",
        });
      }
      if (!data.events || data.events.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["events"],
          message: "Please add at least one wedding event",
        });
      }
    } else if (data.type === "birthday") {
      if (!data.personName || data.personName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["personName"],
          message: "Birthday person's name is required",
        });
      }
      if (!data.schedule || data.schedule.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["schedule"],
          message: "Please add at least one celebration schedule item",
        });
      }
    } else if (data.type === "ghar") {
      if (!data.familyName || data.familyName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["familyName"],
          message: "Family name is required (e.g. Sharma Parivar)",
        });
      }
      if (!data.schedule || data.schedule.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["schedule"],
          message: "Please add at least one pooja schedule item",
        });
      }
    }
  });

export type CardFormValues = z.infer<typeof cardFormSchema>;

export function getDefaultFormValues(type: EventType): CardFormValues {
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  nextMonth.setHours(18, 0, 0, 0);
  const defaultIsoDate = nextMonth.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  const defaultEventDate = nextMonth.toISOString().slice(0, 10);

  if (type === "wedding") {
    return {
      type: "wedding",
      lang: "en",
      groomName: "",
      brideName: "",
      groomParents: "",
      brideParents: "",
      groomInsta: "",
      brideInsta: "",
      groomPhoto: "",
      bridePhoto: "",
      heroPhoto: "",
      hashtag: "",
      message:
        "With the divine blessings of the Almighty and our beloved elders, we request the honour of your presence as we begin our forever.",
      mainDate: defaultIsoDate,
      venueName: "",
      venueAddress: "",
      mapQuery: "",
      events: [
        {
          id: "ev-1",
          title: "Baraat & Pheras",
          tagline: "The sacred vows — two souls, one journey",
          date: defaultEventDate,
          time: "18:00",
          venue: "",
        },
      ],
      schedule: [],
      gallery: [],
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      rsvpEnabled: true,
      musicUrl: "",
    };
  }

  if (type === "birthday") {
    return {
      type: "birthday",
      lang: "en",
      personName: "",
      role: "Boy",
      age: 25,
      hostName: "",
      themeVariant: "adult",
      timeText: "7:00 PM onwards",
      dressCode: "Smart Casuals / Party Chic",
      rsvpBy: "14th November",
      photo1: "",
      photo2: "",
      message:
        "Join us as we raise a toast, pop the confetti, and celebrate another wonderful year of joy, memories, and laughter!",
      mainDate: defaultIsoDate,
      venueName: "",
      venueAddress: "",
      mapQuery: "",
      schedule: [
        {
          id: "sch-1",
          time: "7:00 PM",
          title: "Arrival & Welcome Drinks",
          desc: "Enjoy cocktails, mocktails and appetizers as we welcome you.",
        },
        {
          id: "sch-2",
          time: "8:30 PM",
          title: "Cake Cutting",
          desc: "Make a wish with us and celebrate the milestone!",
        },
        {
          id: "sch-3",
          time: "9:00 PM",
          title: "Dinner",
          desc: "Delight in a sumptuous celebratory feast.",
        },
        {
          id: "sch-4",
          time: "9:45 PM",
          title: "Music & Dance",
          desc: "Hit the dance floor with energetic DJ beats.",
        },
      ],
      events: [],
      gallery: [],
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      rsvpEnabled: true,
      musicUrl: "",
    };
  }

  // Ghar
  return {
    type: "ghar",
    lang: "hi",
    functionName: "Griha Pravesh",
    familyName: "",
    hostName: "",
    muhurat: "Pratah Shubh Muhurat (08:15 AM)",
    timeText: "8:00 AM onwards",
    dressCode: "Traditional / Ethnic Wear",
    rsvpBy: "10th November",
    photo1: "",
    photo2: "",
    message:
      "ईश्वर की कृपा और बड़ों के आशीर्वाद से हम अपने नवनिर्मित गृह में प्रवेश कर रहे हैं। इस पावन अवसर पर आपकी स्नेहमयी उपस्थिति सादर प्रार्थनीय है।",
    mainDate: defaultIsoDate,
    venueName: "",
    venueAddress: "",
    mapQuery: "",
    schedule: [
      {
        id: "sch-1",
        time: "8:00 AM",
        title: "Ganesh Pooja & Kalash Sthapana",
        desc: "Invoking auspicious blessings for peace and prosperity.",
      },
      {
        id: "sch-2",
        time: "9:30 AM",
        title: "Vastu Shanti Havan",
        desc: "Sacred fire ceremony for sanctifying the new home.",
      },
      {
        id: "sch-3",
        time: "11:00 AM",
        title: "Griha Pravesh",
        desc: "Auspicious step into our new abode with family & friends.",
      },
      {
        id: "sch-4",
        time: "12:15 PM",
        title: "Aarti & Blessings",
        desc: "Seeking elders' blessings and community prayers.",
      },
      {
        id: "sch-5",
        time: "1:00 PM",
        title: "Prasad & Bhojan",
        desc: "Traditional festive feast and Mahaprasad.",
      },
    ],
    events: [],
    gallery: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    rsvpEnabled: true,
    musicUrl: "",
  };
}
