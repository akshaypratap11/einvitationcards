/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://einvitationcard.vercel.app";

export const viewport: Viewport = {
  themeColor: "#420b1e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "निमंत्रण Utsav | Royal Indian Digital Invitation Card Maker",
    template: "%s | निमंत्रण Utsav",
  },
  description:
    "Create luxury animated digital invitation cards for Indian Weddings, Birthdays, and Griha Pravesh celebrations in 2 minutes. Instant WhatsApp sharing, RSVP tracking, Google Maps directions, music, and photo gallery.",
  keywords: [
    "digital wedding invitation card",
    "shadi card maker online",
    "online wedding card maker",
    "animated wedding card whatsapp",
    "whatsapp invitation card with rsvp",
    "griha pravesh invitation card online",
    "housewarming e-invite",
    "birthday invitation maker online",
    "indian digital invitation card",
    "royal indian wedding invitation",
    "शादी का डिजिटल कार्ड",
    "गृह प्रवेश निमंत्रण पत्र",
    "e-invitation card maker india",
    "nimantran utsav",
  ],
  authors: [{ name: "निमंत्रण Utsav", url: siteUrl }],
  creator: "निमंत्रण Utsav",
  publisher: "निमंत्रण Utsav",
  category: "Events & Digital Invitations",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
    url: siteUrl,
    siteName: "निमंत्रण Utsav",
    title: "निमंत्रण Utsav | Royal Indian Digital Invitation Card Maker",
    description:
      "Create luxury animated digital invitations for Indian Weddings, Birthdays, and Griha Pravesh celebrations in 2 minutes with music, RSVP, and photo galleries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "निमंत्रण Utsav | Royal Indian Digital Invitation Card Maker",
    description:
      "Create luxury animated digital invitations for Weddings, Birthdays, and Griha Pravesh celebrations in 2 minutes with music, RSVP, and photo galleries.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.svg",
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "निमंत्रण Utsav",
      description:
        "Royal Indian Digital Invitation Card Maker for Weddings, Birthdays, and Griha Pravesh",
      inLanguage: ["en-IN", "hi-IN"],
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "निमंत्रण Utsav",
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      sameAs: [],
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "निमंत्रण Utsav E-Invitation Maker",
      url: siteUrl,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
      featureList: [
        "Animated Royal Carved Door Opening",
        "Background Shehnai & Festive Music",
        "Couple Photo Collision Animation",
        "Multi-Event Ceremony Itinerary",
        "Live Countdown Clock",
        "Interactive Google Maps Directions",
        "One-Tap Add to Calendar",
        "WhatsApp Sharing Link with Rich Previews",
        "Real-Time Guest RSVP Tracker",
        "Dual Language Support (English & Hindi)",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-screen bg-festive-wine text-festive-cream antialiased selection:bg-festive-gold/30 selection:text-festive-goldLight">
        {children}
      </body>
    </html>
  );
}
