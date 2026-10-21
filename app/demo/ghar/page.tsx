import React from "react";
import { Metadata } from "next";
import GrihaPravesh from "@/components/templates/GrihaPravesh";
import DemoBanner from "@/components/demo/DemoBanner";
import { CardData } from "@/types/card";
import { getLatestCardByType } from "@/lib/cards-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const card = await getLatestCardByType("ghar");
  const data = (card?.data as CardData) || demoGharData;
  const func = data.functionName || "Griha Pravesh";
  const fam = data.familyName || "Family";
  return {
    title: `${func} Invitation – ${fam} | निमंत्रण Utsav`,
    description:
      "Live interactive preview of our auspicious Griha Pravesh invitation card with traditional Kalash motifs, Vedic Shlokas, Old & New Home memory collision, and sacred pooja timeline.",
  };
}

const demoGharData: CardData = {
  type: "ghar",
  lang: "en",
  functionName: "Griha Pravesh",
  familyName: "Sharma Parivar",
  hostName: "Mr. Rakesh Sharma",
  contactName: "Mr. Rakesh Sharma",
  contactPhone: "+91 75210 38818",
  mainDate: "2026-12-06T08:00:00+05:30",
  timeText: "8:00 AM onwards",
  muhurat: "8:00 AM onwards · Muhurat 10:30 AM",
  venueName: "Plot 24, Green Valley Residency, Your City",
  venueAddress: "",
  mapQuery: "Green Valley Residency",
  dressCode: "Traditional / Ethnic wear",
  rsvpBy: "28th November",
  message:
    "With the grace of Lord Ganesha and the blessings of our elders, we joyfully invite you and your family to the Griha Pravesh of our new home — to bless it with your presence.",
  photo1: "",
  photo2: "",
  schedule: [
    {
      id: "p-1",
      time: "8:00 AM",
      title: "Ganesh Pooja & Kalash Sthapana",
      desc: "Invoking Lord Ganesha’s blessings.",
    },
    {
      id: "p-2",
      time: "9:00 AM",
      title: "Vastu Shanti Havan",
      desc: "Purifying and blessing the new home.",
    },
    {
      id: "p-3",
      time: "10:30 AM",
      title: "Griha Pravesh",
      desc: "The auspicious first step into our home.",
    },
    {
      id: "p-4",
      time: "11:30 AM",
      title: "Aarti & Blessings",
      desc: "Seek the blessings of the elders.",
    },
    {
      id: "p-5",
      time: "12:30 PM",
      title: "Prasad & Bhojan",
      desc: "Lunch with family and friends.",
    },
  ],
  gallery: [],
  rsvpEnabled: true,
};

export default async function GharDemoPage() {
  const card = await getLatestCardByType("ghar");
  const data = (card?.data as CardData) || demoGharData;
  const slug = card?.slug || "demo-ghar";

  return (
    <>
      <GrihaPravesh
        data={data}
        previewMode={false}
        showPlaceholders={!card?.data?.gallery?.length}
        slug={slug}
      />
      <DemoBanner type="ghar" />
    </>
  );
}
