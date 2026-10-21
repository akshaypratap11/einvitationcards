import React from "react";
import { Metadata } from "next";
import WeddingRoyal from "@/components/templates/WeddingRoyal";
import { CardData } from "@/types/card";

export const metadata: Metadata = {
  title: "Royal Indian Wedding Card Preview | निमंत्रण Utsav",
  description:
    "Preview the luxury royal Indian wedding invitation template featuring carved palace door animations, shehnai music, couple photo portraits, event itinerary, and RSVP.",
  alternates: {
    canonical: "/preview/wedding",
  },
  openGraph: {
    title: "Royal Indian Wedding Card Preview | निमंत्रण Utsav",
    description:
      "Interactive preview of our royal carved palace door wedding invitation card.",
  },
};

const sampleWeddingData: CardData = {
  type: "wedding",
  lang: "en",
  groomName: "Aarav",
  brideName: "Diya",
  groomParents: "Mr. Rajesh Malhotra & Mrs. Sunita Malhotra",
  brideParents: "Mr. Vikram Sharma & Mrs. Anjali Sharma",
  groomInsta: "aarav.malhotra",
  brideInsta: "diya.sharma",
  // no external photos to test initial-letter gradient placeholders
  mainDate: "2026-02-14T18:00:00+05:30",
  venueName: "Mankameshwar Palace",
  venueAddress: "Damodar Nagar, Kanpur, Uttar Pradesh",
  mapQuery: "Mankameshwar Palace, Damodar Nagar, Kanpur, Uttar Pradesh",
  message:
    "With the divine blessings of the Almighty and our beloved elders, we request the honour of your presence as we begin our forever.",
  hashtag: "#AaravWedsDiya",
  events: [
    {
      id: "ev-1",
      title: "Mehndi Ki Raat",
      tagline: "Hands painted with love, laughter & henna",
      date: "2026-02-11",
      time: "11:00",
      venue: "The Courtyard, Malhotra Farm, Vasant Kunj, New Delhi",
    },
    {
      id: "ev-2",
      title: "Haldi Ceremony",
      tagline: "A golden glow for the bride & groom to be",
      date: "2026-02-13",
      time: "09:00",
      venue: "The Courtyard, Malhotra Farm, Vasant Kunj, New Delhi",
    },
    {
      id: "ev-3",
      title: "Sangeet Night",
      tagline: "An evening of music, dance & celebration",
      date: "2026-02-13",
      time: "19:00",
      venue: "Emerald Ballroom, The Grand Palace, Aerocity, New Delhi",
    },
    {
      id: "ev-4",
      title: "Baraat & Pheras",
      tagline: "The sacred vows — two souls, one journey",
      date: "2026-02-14",
      time: "18:00",
      venue: "Mankameshwar Palace, Kanpur, Uttar Pradesh",
    },
    {
      id: "ev-5",
      title: "Reception Gala",
      tagline: "Raise a toast to the newly-weds",
      date: "2026-02-15",
      time: "19:00",
      venue: "Mankameshwar Palace, Kanpur, Uttar Pradesh",
    },
  ],
  gallery: [], // no photos to test hiding empty gallery section
  contactName: "Mr. Mohit Malhotra",
  contactPhone: "+91 75210 38818",
  contactEmail: "hello@example.com",
};

export default function WeddingPreviewPage() {
  return <WeddingRoyal data={sampleWeddingData} />;
}
