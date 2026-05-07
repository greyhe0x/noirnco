"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container, HeadingOnLight, TextOnLight } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

/* ─── Sub-section data ────────────────────────────────────────────────────── */
/*
 * Image placeholders  add matching files to /public/images/:
 *   about-programs.jpg   →  team / program session / curated meeting
 *   about-hospitality.jpg →  premium venue / concierge / logistics moment
 */
const SECTIONS = [
  {
    id: "about-1",
    image: "/images/about-programs.png",
    imageAlt: "Noir & Co program management team at work",
    badge: "15+ Countries",
    badgeSub: "Global reach, local expertise",
    title: "Ghana's Premier\nProgram Management Team",
    titleAccent: "Program Management Team",
    description:
      "Noir & Co was built to solve a real problem: investors and businesses arriving in Ghana without the context, connections, or infrastructure to move effectively. We fill that gap  designing structured, insight-driven programs that give our clients the clarity to act with confidence.",
    cta: "Our Story",
    ctaHref: "#",
    imageRight: false,
  },
  {
    id: "about-2",
    image: "/images/about-hospitality.png",
    imageAlt: "Premium hospitality and logistics in Ghana",
    badge: "1201+",
    badgeSub: "Participants hosted",
    title: "Bespoke program management, \nPrecision Logistics.",
    titleAccent: "Elevated Hospitality.",
    description:
      "From premium accommodation and private transportation to curated dinners and on-ground concierge support  every operational detail is handled by our dedicated team. You focus on your goals; we make Ghana seamless.",
    cta: "Book a Consultation",
    ctaHref: "/consultation",
    imageRight: true,
  },
] as const;

/* ─── Sub-section component ───────────────────────────────────────────────── */
function AboutSubSection({
  id, image, imageAlt, badge, badgeSub,
  title, titleAccent, description, cta, ctaHref, imageRight,
}: (typeof SECTIONS)[number]) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const imgEl  = ref.current?.querySelector(".about-img");
      const textEl = ref.current?.querySelector(".about-text");

      if (!imgEl || !textEl) return;

      gsap.fromTo(
        imgEl,
        { opacity: 0, x: imageRight ? 40 : -40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        textEl,
        { opacity: 0, x: imageRight ? -40 : 40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    },
    { scope: ref }
  );

  /* Build title with accent on last word group */
  const titleLines = title.split("\n");

  const ImageBlock = (
    <div className="about-img relative" style={{ opacity: 0 }}>
      <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
        {/* Subtle bottom fade for visual polish */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }}
        />
        {/* Badge chip bottom-left */}
        <div className="absolute bottom-5 left-5 flex items-baseline gap-2 bg-secondary/80 backdrop-blur-sm rounded-xl px-4 py-2.5">
          <p className="font-heading font-black text-white" style={{ fontSize: "1.375rem", lineHeight: 1 }}>{badge}</p>
          <p className="font-body text-white/70" style={{ fontSize: "0.72rem" }}>{badgeSub}</p>
        </div>
      </div>
    </div>
  );

  const TextBlock = (
    <div
      className="about-text flex flex-col gap-6 justify-center"
      style={{ opacity: 0 }}
    >
      <HeadingOnLight
        as="h2"
        weight="bold"
        className="text-secondary-dark"
        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.12, letterSpacing: "-0.02em" }}
      >
        {titleLines.map((line, i) => {
          const isAccentLine = line.includes(titleAccent);
          return (
            <React.Fragment key={i}>
              {isAccentLine ? (
                <span className="">{line}</span>
              ) : (
                line
              )}
              {i < titleLines.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </HeadingOnLight>

      <TextOnLight
        as="p"
        emphasis="muted"
        className="leading-relaxed"
        style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", lineHeight: 1.85 }}
      >
        {description}
      </TextOnLight>

      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 bg-secondary text-white font-heading font-semibold rounded-full px-7 py-3.5 hover:bg-secondary/85 transition-all duration-200 group w-fit"
        style={{ fontSize: "0.9375rem" }}
      >
        {cta}
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
      {imageRight ? (
        <>
          {TextBlock}
          {ImageBlock}
        </>
      ) : (
        <>
          {ImageBlock}
          {TextBlock}
        </>
      )}
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function AboutSection() {
  return (
    <section id="about" className="bg-surface-muted">
      <Container>
        <div className="flex flex-col gap-24 py-24 md:py-32">
          {SECTIONS.map((s) => (
            <AboutSubSection key={s.id} {...s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
