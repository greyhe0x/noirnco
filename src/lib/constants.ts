export const BRAND = {
  name: "Noir & Co",
  tagline: "Ghana, by Design.",
  description:
    "A program management and hospitality company specialising in structured, insight-driven experiences in Ghana for investors, businesses, and the diaspora.",
  email: "noircorp.inc@gmail.com",
  phone: "+233 55 120 4941",
  phoneSec: "+233 026 944 1977",
  location: "Accra, Ghana",
  social: {
    instagram: "#",
    twitter: "#",
    facebook: "#",
    linkedin: "#",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home",     href: "/"         },
  { label: "Services", href: "#services" },
  { label: "Programs", href: "#events"   },
  { label: "About",    href: "#about"    },
  { label: "FAQ",      href: "#faq"      },
  { label: "Contact",  href: "#contact"  },
] as const;

export const SERVICES = [
  {
    id: "corporate-hosting",
    title: "Investor & Corporate Hosting",
    description:
      "Executive visits, conferences, startup showcases, private dinners, and curated networking events — designed for impact.",
  },
  {
    id: "bespoke-logistics",
    title: "Bespoke Logistics",
    description:
      "Comprehensive coordination of arrivals, premium accommodation, and private transportation — seamlessly executed.",
  },
  {
    id: "curated-itineraries",
    title: "Curated Itineraries",
    description:
      "Thoughtfully designed experiences blending culture, leisure, and lifestyle across Ghana's most compelling destinations.",
  },
  {
    id: "concierge",
    title: "Personalised Concierge",
    description:
      "Tailored, on-demand support for both short-term visits and extended stays — your dedicated partner on the ground.",
  },
] as const;

export const STATS = [
  { value: "270+", label: "Participants Hosted" },
  { value: "8+",   label: "Markets Served"      },
  { value: "40+",  label: "Startups Supported"  },
  { value: "98%",  label: "Satisfaction Rate"   },
] as const;
