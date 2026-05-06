"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Play } from "lucide-react";
import { Button, Container, Eyebrow } from "@/components/ui";

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const actionsRef  = useRef<HTMLDivElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(overlayRef.current, { opacity: 0.7 }, { opacity: 0.55, duration: 1.5 })
      .fromTo(badgeRef.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3)
      .fromTo(headlineRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5)
      .fromTo(subRef.current,      { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.75)
      .fromTo(actionsRef.current,  { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.95)
      .fromTo(scrollRef.current,   { opacity: 0 },        { opacity: 1, duration: 0.5 }, 1.4);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary"
    >
      {/* Background image — replace with actual photo */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat" />

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90"
      />

      {/* Decorative glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Content — navbar is ~72px, so pt-24 clears it and centers visually */}
      <Container className="relative z-10 pt-24 pb-16 text-center">
        {/* Eyebrow */}
        <div ref={badgeRef} className="inline-block mb-6">
          <Eyebrow className="text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/30">
            Ghana&apos;s Premier Event &amp; Travel Agency
          </Eyebrow>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-heading font-semibold text-white mb-6 max-w-4xl mx-auto"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.15 }}
        >
          Your Extreme{" "}
          <span className="text-gradient-primary">Ghanaian Experience</span>
          <br />
          Starts Here.
        </h1>

        {/* Sub-headline */}
        <p
          ref={subRef}
          className="font-body text-gray-300 max-w-2xl mx-auto mb-10"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)", lineHeight: 1.7 }}
        >
          Whether you&apos;re hosting a corporate summit, a dream wedding, or exploring
          Ghana&apos;s hidden gems — Noir &amp; Co handles every detail with elegance and precision.
        </p>

        {/* CTA buttons */}
        <div
          ref={actionsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" variant="primary" className="group">
            Plan Your Event
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-white border border-white/30 hover:bg-white/10 rounded-full"
          >
            <Play size={16} className="fill-white" />
            Watch Our Story
          </Button>
        </div>
      </Container>

      {/* Scroll indicator — direct child of section so absolute bottom-10
          positions relative to the full-height section, not the Container */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce"
      >
        <span className="text-white/50 font-body text-caption uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
