import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCardBySlug } from "@/lib/cards-db";
import { CardData } from "@/types/card";
import WeddingRoyal from "@/components/templates/WeddingRoyal";
import BirthdayCelebration from "@/components/templates/BirthdayCelebration";
import GrihaPravesh from "@/components/templates/GrihaPravesh";
import { formatDisplayDate } from "@/lib/utils";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const card = await getCardBySlug(params.slug);
  if (!card) {
    return {
      title: "Invitation Not Found",
      description: "The requested digital invitation card could not be found.",
      robots: { index: false, follow: false },
    };
  }

  if (card.is_published === false) {
    return {
      title: "This invitation is not available | निमंत्रण Utsav",
      description: "This digital invitation is currently unavailable.",
      robots: { index: false, follow: false },
    };
  }

  const data = card.data as CardData;
  const isWedding = card.type === "wedding";
  const isBirthday = card.type === "birthday";

  const title = isWedding
    ? `${data.groomName || "Groom"} & ${data.brideName || "Bride"} – Wedding Invitation`
    : isBirthday
    ? `${data.personName || "Birthday"}'s Celebration – Birthday Invitation`
    : `${data.functionName || "Griha Pravesh"} – ${data.familyName || "Family"} Invitation`;

  const formattedDate = formatDisplayDate(data.mainDate, data.lang || "en");
  const description =
    data.message ||
    `You are cordially invited to celebrate with us on ${formattedDate} at ${data.venueName}. Tap to open the digital invitation.`;

  const ogImage =
    data.heroPhoto ||
    data.groomPhoto ||
    data.bridePhoto ||
    (data.gallery && data.gallery.length > 0 ? data.gallery[0] : undefined);

  const cardPath = `/c/${params.slug}`;

  return {
    title,
    description,
    // Strictly noindex, nofollow for individual guest cards as per privacy specs
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: cardPath,
    },
    // Keep Open Graph & Twitter for rich WhatsApp, iMessage, and Telegram previews
    openGraph: {
      title,
      description,
      type: "website",
      url: cardPath,
      siteName: "निमंत्रण Utsav",
      locale: data.lang === "hi" ? "hi_IN" : "en_IN",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PublicCardPage({ params }: PageProps) {
  const card = await getCardBySlug(params.slug);
  if (!card) {
    notFound();
  }

  // Unpublished card screen
  if (card.is_published === false) {
    return (
      <div className="min-h-screen bg-festive-wine text-festive-cream flex flex-col items-center justify-center p-6 text-center festive-pattern-bg">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-festive-maroon/90 border border-festive-gold/40 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-festive-wine border border-festive-gold/40 mx-auto flex items-center justify-center text-3xl shadow-inner">
            🪔
          </div>
          <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
            Status Update
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-festive-goldLight">
            This invitation is not available
          </h1>
          <p className="text-xs sm:text-sm text-festive-cream/75 leading-relaxed">
            The host has temporarily paused or unpublished this digital
            invitation card. Please check back later or contact the host
            directly.
          </p>
        </div>
      </div>
    );
  }

  const data = card.data as CardData;
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://einvitationcard.vercel.app";
  const cardUrl = `${siteUrl}/c/${card.slug}`;

  const isWedding = card.type === "wedding";
  const isBirthday = card.type === "birthday";

  const eventName = isWedding
    ? `${data.groomName || "Groom"} & ${data.brideName || "Bride"} Wedding Celebration`
    : isBirthday
    ? `${data.personName || "Birthday"}'s Celebration`
    : `${data.functionName || "Griha Pravesh"} – ${data.familyName || "Family"}`;

  const image =
    data.heroPhoto ||
    data.groomPhoto ||
    data.bridePhoto ||
    (data.gallery && data.gallery.length > 0
      ? data.gallery[0]
      : `${siteUrl}/favicon.svg`);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventName,
    description: data.message || `Cordially invited to ${eventName}`,
    startDate: data.mainDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: data.venueName || "Celebration Venue",
      address: {
        "@type": "PostalAddress",
        streetAddress: data.venueAddress || data.venueName || "India",
        addressCountry: "IN",
      },
    },
    image: image ? [image] : [],
    url: cardUrl,
    organizer: {
      "@type": "Person",
      name:
        data.groomParents ||
        data.hostName ||
        data.familyName ||
        data.contactName ||
        "Family Hosts",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {card.type === "wedding" && (
        <WeddingRoyal data={data} previewMode={false} slug={card.slug} />
      )}
      {card.type === "birthday" && (
        <BirthdayCelebration data={data} previewMode={false} slug={card.slug} />
      )}
      {card.type === "ghar" && (
        <GrihaPravesh data={data} previewMode={false} slug={card.slug} />
      )}
    </>
  );
}
