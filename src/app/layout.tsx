import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noirnco.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Noir & Co — Ghana, by Design.",
    template: "%s | Noir & Co",
  },
  description:
    "Noir & Co is Ghana's premier program management and hospitality company. We design structured, insight-driven experiences for investors, corporations, and the diaspora, from curated itineraries and investor delegations to bespoke logistics and on-ground concierge support.",
  keywords: [
    "Ghana program management",
    "investor delegation Ghana",
    "corporate hosting Accra",
    "Ghana market entry",
    "diaspora experience Ghana",
    "Noir and Co",
    "Ghana hospitality",
    "Accra events",
    "Ghana business travel",
    "fellowship program Ghana",
  ],
  authors:  [{ name: "Noir & Co" }],
  creator:  "Noir & Co",

  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         BASE_URL,
    siteName:    "Noir & Co",
    title:       "Noir & Co — Ghana, by Design.",
    description:
      "Ghana's premier program management company. We design curated investor delegations, corporate programs, and diaspora experiences — delivered with precision and elevated hospitality.",
    images: [
      {
        url:    "/images/forum-1.png",
        width:  1200,
        height: 630,
        alt:    "Noir & Co — Ghana Investor Forum Series, Accra",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Noir & Co — Ghana, by Design.",
    description:
      "Ghana's premier program management company. We design curated investor delegations, corporate programs, and diaspora experiences — delivered with precision and elevated hospitality.",
    images: ["/images/forum-1.png"],
  },

  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FC883E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
