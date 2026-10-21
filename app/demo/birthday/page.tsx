import React from "react";
import { Metadata } from "next";
import BirthdayCelebration from "@/components/templates/BirthdayCelebration";
import DemoBanner from "@/components/demo/DemoBanner";
import { CardData } from "@/types/card";
import { getLatestCardByType } from "@/lib/cards-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const card = await getLatestCardByType("birthday");
  const data = (card?.data as CardData) || demoBirthdayData;
  const name = data.personName || "Birthday";
  return {
    title: `You’re Invited – ${name}’s Celebration | निमंत्रण Utsav`,
    description:
      "Live interactive preview of our luxury navy and gold birthday celebration invitation card with candlelight animation, then and now memories, and countdown timer.",
  };
}

const demoBirthdayData: CardData = {
  type: "birthday",
  lang: "en",
  personName: "Riya",
  age: 25,
  role: "Girl",
  hostName: "Mr. & Mrs. Sharma",
  contactPhone: "+91 75210 38818",
  mainDate: "2026-11-21T19:00:00+05:30",
  timeText: "7:00 PM onwards",
  venueName: "The Sky Lounge, Civil Lines",
  venueAddress: "Civil Lines, New Delhi 110054",
  mapQuery: "The Sky Lounge, Civil Lines",
  dressCode: "Glam & Gold — black, navy or champagne",
  rsvpBy: "14th November",
  message:
    "Another year of laughter, love and little adventures. Come raise a glass and celebrate with us — your presence is the best gift of all.",
  photo1: "",
  photo2: "",
  schedule: [
    {
      id: "s-1",
      time: "7:00 PM",
      title: "Arrival & Welcome Drinks",
      desc: "Mingle, meet and settle in.",
    },
    {
      id: "s-2",
      time: "8:00 PM",
      title: "Cake Cutting",
      desc: "Make a wish with us.",
    },
    {
      id: "s-3",
      time: "8:30 PM",
      title: "Dinner",
      desc: "A curated multi-cuisine spread.",
    },
    {
      id: "s-4",
      time: "9:30 PM",
      title: "Music & Dance",
      desc: "DJ, dance floor and good vibes.",
    },
  ],
  gallery: [],
  contactName: "Mr. & Mrs. Sharma",
  rsvpEnabled: true,
};

export default async function BirthdayDemoPage() {
  const card = await getLatestCardByType("birthday");
  const data = (card?.data as CardData) || demoBirthdayData;
  const slug = card?.slug || "demo-birthday";

  return (
    <>
      <BirthdayCelebration
        data={data}
        previewMode={false}
        showPlaceholders={!card?.data?.gallery?.length}
        slug={slug}
      />
      <DemoBanner type="birthday" />
    </>
  );
}
