"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Users, MapPin, Star, Award } from "lucide-react";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { FloatingCard } from "@/components/ui/FloatingCard";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.4 });

      tl.fromTo(".hero-circle",            { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1 })
        .fromTo(".hero-image-placeholder",  { opacity: 0, y: 24 },       { opacity: 1, y: 0, duration: 0.7 }, 0.5)
        .fromTo(".hero-badge",              { opacity: 0, scale: 0.8 },  { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, 0.7)
        .fromTo(".hero-floating-card",      { opacity: 0, y: 16 },       { opacity: 1, y: 0, duration: 0.6 }, 1.0);
    },
    { scope: containerRef }
  );

  return (
    /*
     * On mobile: compact circle only (no badges, no card)  sits above the text.
     * On lg+:    full-size canvas with floating badges and stat card.
     */
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center py-4 lg:py-0 min-h-[200px] lg:min-h-[520px]"
    >
      {/* Outer glow ring  desktop only (too wide for mobile) */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/10 bg-primary/5 pointer-events-none" />

      {/* Main circle  responsive size */}
      {/* hero-portrait.jpg: a strong portrait photo, ideally shot from waist up */}
      <div className="hero-circle relative w-[170px] h-[170px] sm:w-[260px] sm:h-[260px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
        <Image
          src="/images/hero-portrait.png"
          alt="Noir & Co"
          fill
          priority
          sizes="(max-width: 640px) 170px, (max-width: 1024px) 260px, 380px"
          className="hero-image-placeholder object-cover object-top"
        />
        {/* Subtle warm tint ring so it sits in the brand palette */}
        <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 ring-inset pointer-events-none" />
      </div>

      {/* ── Floating badge pills  desktop only ─────────────────────────────── */}
      <FloatingBadge
        icon={<Users size={12} />}
        label="Expert Team"
        className="hero-badge hidden lg:flex absolute top-[15%] left-[2%]"
      />
      <FloatingBadge
        icon={<Star size={12} />}
        label="Curated Programs"
        className="hero-badge hidden lg:flex absolute top-[15%] right-[2%]"
      />
      <FloatingBadge
        icon={<MapPin size={12} />}
        label="Based in Accra"
        className="hero-badge hidden lg:flex absolute bottom-[20%] left-[2%]"
      />
      <FloatingBadge
        icon={<Award size={12} />}
        label="98% Satisfaction"
        className="hero-badge hidden lg:flex absolute bottom-[20%] right-[2%]"
      />

      {/* ── Stat card  desktop only ─────────────────────────────────────────── */}
      <FloatingCard
        stat="1201+"
        label="Participants Hosted"
        subLabel="Across 15+ global markets"
        showAvatars
        avatarImages={[
          "/images/participant-1.png",
          "/images/participant-2.png",
          "/images/participant-3.png",
          "/images/participant-4.png",
        ]}
        className="hero-floating-card hidden lg:flex absolute bottom-[4%] left-1/2 -translate-x-1/2"
      />
    </div>
  );
}
