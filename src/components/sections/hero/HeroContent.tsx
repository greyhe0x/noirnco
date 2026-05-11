"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronRight } from "lucide-react";
import { Button, HeadingOnLight, TextOnLight } from "@/components/ui";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import Link from "next/link";

const PARTNER_LOGOS = [
  { name: "KIC", abbr: "KIC" },
  { name: "Pelican Hotel", abbr: "PELICAN" },
  { name: "Adonai", abbr: "ADONAI" },
  { name: "Halcyon", abbr: "HALCYON" },
];

export function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const items = containerRef.current?.querySelectorAll("[data-animate]");
      if (!items) return;
      tl.fromTo(
        items,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start justify-center gap-3 lg:gap-5 lg:py-0 lg:pr-12 xl:pr-20"
    >
      {/* Headline */}
      <HeadingOnLight
        as="h1"
        weight="bold"
        data-animate
        className="opacity-0"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)", lineHeight: 1.08, letterSpacing: "-0.025em" }}
      >
        Ghana,{" "}
        <span className="text-gradient-primary">by Design.</span>
      </HeadingOnLight>

      {/* Social proof row */}
      <div data-animate className="flex items-center gap-3 opacity-0">
        <AvatarGroup count={5} size="md" />
        <div>
          <TextOnLight as="p" weight="semibold" className="leading-none" style={{ fontSize: "0.9375rem" }}>
            1201+ Participants
          </TextOnLight>
          <TextOnLight as="p" emphasis="muted" style={{ fontSize: "0.71875rem" }}>
            hosted from 15+ countries
          </TextOnLight>
        </div>
      </div>

      {/* Body */}
      <TextOnLight
        as="p"
        data-animate
        emphasis="muted"
        className="max-w-lg opacity-0"
        style={{ fontSize: "clamp(0.875rem, 1.4vw, 1rem)", lineHeight: 1.75 }}
      >
        A program management and hospitality company specialising in structured,
        insight-driven experiences in Ghana for investors, businesses, and the diaspora.
      </TextOnLight>

      {/* CTA  single button on hero */}
      <div data-animate className="opacity-0">
        <Button asChild size="lg" variant="primary" className="group">
          <Link href="/consultation">
            Plan Your Experience
            <ChevronRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </Button>
      </div>

      {/* Partner logos */}
      <div data-animate className="pt-2 opacity-0">
        <TextOnLight
          as="p"
          emphasis="muted"
          className="mb-3 uppercase"
          style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}
        >
          Trusted partners
        </TextOnLight>
        <div className="flex items-center gap-3 flex-wrap">
          {PARTNER_LOGOS.map((p) => (
            <div
              key={p.abbr}
              className="flex items-center justify-center h-8 px-3 rounded-md bg-gray-100 text-gray-400 font-heading font-bold"
              style={{ fontSize: "0.6rem", letterSpacing: "0.06em" }}
            >
              {p.abbr}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
