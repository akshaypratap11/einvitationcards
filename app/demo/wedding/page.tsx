import React from "react";
import { Metadata } from "next";
import WeddingRoyal from "@/components/templates/WeddingRoyal";
import DemoBanner from "@/components/demo/DemoBanner";
import { CardData } from "@/types/card";
import { getLatestCardByType } from "@/lib/cards-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const card = await getLatestCardByType("wedding");
  const data = (card?.data as CardData) || demoWeddingData;
  const groom = data.groomName || "Royal";
  const bride = data.brideName || "Wedding";
  return {
    title: `${groom} & ${bride} – Royal Wedding Card Live Demo | निमंत्रण Utsav`,
    description:
      "Live interactive preview of our royal Indian wedding invitation card with carved palace doors, shehnai music, and itinerary.",
  };
}

const demoWeddingData: CardData = {
  type: "wedding",
  lang: "en",
  groomName: "Aarav",
  brideName: "Diya",
  groomParents: "Mr. Rajesh Malhotra & Mrs. Sunita Malhotra",
  brideParents: "Mr. Vikram Sharma & Mrs. Anjali Sharma",
  groomInsta: "aarav.malhotra",
  brideInsta: "diya.sharma",
  // no real photos: uses royal initial-letter gradient placeholders
  mainDate: "2026-12-14T18:00:00+05:30",
  venueName: "Mankameshwar Royal Palace",
  venueAddress: "Damodar Nagar, Kanpur, Uttar Pradesh",
  mapQuery: "Mankameshwar Palace, Kanpur, Uttar Pradesh",
  message:
    "With the divine blessings of Lord Ganesha and our beloved elders, we request the honour of your presence as we unite in holy matrimony.",
  hashtag: "#AaravWedsDiya",
  events: [
    {
      id: "ev-1",
      title: "Mehndi Ki Raat",
      tagline: "Hands adorned with love, laughter & henna",
      date: "2026-12-11",
      time: "11:00",
      venue: "The Courtyard, Malhotra Farm, New Delhi",
    },
    {
      id: "ev-2",
      title: "Haldi Ceremony",
      tagline: "A golden auspicious glow for the couple",
      date: "2026-12-13",
      time: "09:30",
      venue: "The Courtyard, Malhotra Farm, New Delhi",
    },
    {
      id: "ev-3",
      title: "Sangeet Extravaganza",
      tagline: "An evening of dance, music & eternal joy",
      date: "2026-12-13",
      time: "19:00",
      venue: "Emerald Grand Ballroom, New Delhi",
    },
    {
      id: "ev-4",
      title: "Baraat & Sacred Pheras",
      tagline: "The seven holy vows of eternal companionship",
      date: "2026-12-14",
      time: "18:00",
      venue: "Mankameshwar Royal Palace, Kanpur",
    },
    {
      id: "ev-5",
      title: "Grand Wedding Reception",
      tagline: "Dinner, toasts, and royal celebrations",
      date: "2026-12-15",
      time: "19:30",
      venue: "Mankameshwar Royal Palace, Kanpur",
    },
  ],
  gallery: [],
  contactName: "Mr. Rajesh Malhotra",
  contactPhone: "+91 75210 38818",
  contactEmail: "rsvp@example.com",
  rsvpEnabled: true,
};

export default async function WeddingDemoPage() {
  const card = await getLatestCardByType("wedding");
  const data = (card?.data as CardData) || demoWeddingData;
  const slug = card?.slug || "demo-wedding";

  return (
    <>
      <WeddingRoyal data={data} previewMode={false} slug={slug} />
      <DemoBanner type="wedding" />
    </>
  );
}
