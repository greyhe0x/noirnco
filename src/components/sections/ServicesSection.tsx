"use client";

import React from "react";
import Image from "next/image";
import { Container, HeadingOnLight, TextOnLight, Text, Card } from "@/components/ui";
import { useGsapFadeIn, useGsapReveal } from "@/hooks/useGsapFadeIn";

const SERVICES = [
  {
    title: "Investor & Corporate Hosting",
    description:
      "Executive visits, conferences, startup showcases, private dinners, and curated networking events designed for impact and deal-flow.",
    image: "/images/service-corporate-hosting.png",
    tag: "Corporate",
  },
  {
    title: "Bespoke Logistics",
    description:
      "Comprehensive coordination of arrivals, premium accommodation, private transportation and seamlessly executed from touchdown to departure.",
    image: "/images/service-logistics.png",
    tag: "Logistics",
  },
  {
    title: "Curated Itineraries",
    description:
      "Thoughtfully designed programs blending culture, commerce, leisure, and lifestyle across Ghana's most compelling destinations.",
    image: "/images/service-itineraries.png",
    tag: "Itineraries",
  },
  {
    title: "Personalised Concierge",
    description:
      "Tailored, on-demand support for both short-term visits and extended stays. Your dedicated partner on the ground in Ghana.",
    image: "/images/service-concierge.png",
    tag: "Concierge",
  },
] as const;

/* ── Service card ───────────────────────────────────────────────────────── */
function ServiceCard({ title, description, image, tag }: (typeof SERVICES)[number]) {
  return (
    <Card hover className="group overflow-hidden p-0 flex flex-col gap-0 border-0 rounded-none shadow-none hover:shadow-sm cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle bottom fade into card bg */}
        <div
          className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(255,244,237,0.25), transparent)" }}
        />
      </div>

      {/* Text content */}
      <div className="p-6 flex flex-col gap-2 bg-surface">
        <h3 className="font-heading font-bold text-secondary" style={{ fontSize: "1.0625rem" }}>
          {title}
        </h3>
        <Text size="sm" color="muted">
          {description}
        </Text>
      </div>
    </Card>
  );
}

export function ServicesSection() {
  const headerRef = useGsapReveal<HTMLDivElement>({ y: 30 });
  const cardsRef  = useGsapFadeIn<HTMLDivElement>({ stagger: 0.12, y: 40 });

  return (
    <section id="services" className="section-padding bg-background">
      <Container>
        {/* Header */}
        <div ref={headerRef} className="max-w-xl mb-14 text-center w-full mx-auto">
          <HeadingOnLight as="h2" className="mb-4 text-center text-secondary-light">
            One Partner. <br/>Every Detail Covered.
          </HeadingOnLight>
          <TextOnLight emphasis="muted" className="text-center">
          At Noir & Co, we create purposeful, refined experiences that connect people to opportunity, culture, and community in Ghana.
          </TextOnLight>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
