"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AvatarGroup } from "@/components/ui/AvatarGroup";

gsap.registerPlugin(ScrollTrigger);

export function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(".quote-mark",    { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6 })
        .fromTo(".quote-text",    { opacity: 0, y: 30 },      { opacity: 1, y: 0,    duration: 0.8 }, "-=0.3")
        .fromTo(".quote-attr",    { opacity: 0, y: 16 },      { opacity: 1, y: 0,    duration: 0.55 }, "-=0.2");
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-secondary py-24 md:py-32"
    >
      {/* Background decorative rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-10 flex flex-col items-center text-center gap-12">

        {/* Giant decorative quote mark */}
        <div
          className="quote-mark select-none pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <svg
            width="72" height="56" viewBox="0 0 72 56" fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 56V33.6C0 14.9333 8.8 4.26667 26.4 1.6L29.6 7.2C21.0667 9.6 16.5333 15.4667 16 24.8H28.8V56H0ZM43.2 56V33.6C43.2 14.9333 52 4.26667 69.6 1.6L72.8 7.2C64.2667 9.6 59.7333 15.4667 59.2 24.8H72V56H43.2Z"
              fill="rgba(252,136,62,0.3)"
            />
          </svg>
        </div>

        {/* The quote */}
        <blockquote
          className="quote-text font-heading font-semibold text-white"
          style={{
            fontSize: "clamp(1.375rem, 3.5vw, 2.25rem)",
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            opacity: 0,
          }}
        >
          Ghana is one of the most compelling destinations on earth for investors and the
          diaspora. Our job is to ensure that every person who walks through its doors does so with{" "}
          <strong className="text-golden font-bold">the right context</strong>,{" "}
          <strong className="text-golden font-bold">the right connections</strong>, and{" "}
          <strong className="text-golden font-bold">the confidence to act</strong>.
        </blockquote>

        {/* Attribution */}
        <div className="quote-attr flex items-center gap-4" style={{ opacity: 0 }}>
          {/* Noir & Co logo */}
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0 border-2 border-white/20 p-2">
            <Image
              src="/logo.png"
              alt="Noir & Co"
              width={880}
              height={1100}
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          <div className="text-left">
            <p className="font-heading font-semibold text-white" style={{ fontSize: "1rem" }}>
              Noir &amp; Co
            </p>
            <p className="font-body text-white/50" style={{ fontSize: "0.8125rem" }}>
              Program Management &amp; Hospitality, Accra
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-white/15 mx-2" />

          {/* Social proof with real participant images */}
          <div className="hidden sm:flex items-center gap-2">
            <AvatarGroup
              count={4}
              size="sm"
              images={[
                "/images/participant-1.png",
                "/images/participant-2.png",
                "/images/participant-3.png",
                "/images/participant-4.png",
              ]}
            />
            <p className="font-body text-white/40" style={{ fontSize: "0.75rem" }}>
              270+ participants hosted
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
