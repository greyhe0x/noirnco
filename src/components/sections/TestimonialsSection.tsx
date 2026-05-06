"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

/* ─── Star icon ───────────────────────────────────────────────────────────── */
function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.44l-3.71 2.11L5 8.42 2 5.5l4.15-.75L8 1z" />
    </svg>
  );
}

/* ─── Quote mark SVG ──────────────────────────────────────────────────────── */
function QuoteMark() {
  return (
    <svg width="32" height="24" viewBox="0 0 36 28" fill="none" aria-hidden="true">
      <path
        d="M0 28V16.8C0 7.46667 4.4 2.13333 13.2 0.8L14.8 3.6C10.5333 4.8 8.26667 7.73333 8 12.4H14.4V28H0ZM21.6 28V16.8C21.6 7.46667 26 2.13333 34.8 0.8L36.4 3.6C32.1333 4.8 29.8667 7.73333 29.6 12.4H36V28H21.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ─── Testimonial data ────────────────────────────────────────────────────── */
/*
 * photo placeholders — add matching files to /public/images/:
 *   avatar-kweku.jpg · avatar-sarah.jpg · avatar-tunde.jpg · avatar-akosua.jpg
 */
const TESTIMONIALS = [
  {
    initials: "KO",
    photo: "/images/avatar-kweku.png",
    name: "Kweku Oppong",
    role: "Investment Director, KIC",
    bg: "bg-primary",
    quote:
      "Noir & Co gave our delegation exactly what we needed — curated access, honest context, and flawless logistics. Our investors left Ghana ready to commit capital.",
    stars: 5,
  },
  {
    initials: "SA",
    photo: "/images/avatar-sarah.png",
    name: "Sarah Asante",
    role: "Managing Partner, Adonai Partners",
    bg: "bg-secondary",
    quote:
      "They understood our brief better than we did. Every meeting was the right meeting. Every venue reflected our brand. This is what world-class looks like in Ghana.",
    stars: 5,
  },
  {
    initials: "TM",
    photo: "/images/avatar-tunde.png",
    name: "Tunde Martins",
    role: "Diaspora Entrepreneur, UK",
    bg: "bg-[#9B3E6E]",
    quote:
      "I'd tried navigating Ghana alone before. The difference with Noir & Co was night and day — they removed every friction point and connected me to the right people instantly.",
    stars: 5,
  },
  {
    initials: "AB",
    photo: "/images/avatar-akosua.png",
    name: "Akosua Bempong",
    role: "Programme Lead, Halcyon Fellowship",
    bg: "bg-success",
    quote:
      "Our fellows consistently rate the Ghana program as the most impactful week of the Fellowship. That's entirely down to how thoughtfully Noir & Co designs the experience.",
    stars: 5,
  },
] as const;

/* ─── Card ────────────────────────────────────────────────────────────────── */
function TestimonialCard({
  initials, photo, name, role, bg, quote, stars,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="testimonial-card flex flex-col items-center text-center bg-surface rounded-2xl p-6 border border-gray-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300 gap-4 relative">
      {photo ? (
        <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 border-4 border-surface shadow-sm">
          <Image src={photo} alt={name} fill sizes="64px" className="object-cover object-top" />
        </div>
      ) : (
        <div className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center flex-shrink-0 border-4 border-surface shadow-sm`}>
          <span className="font-heading font-bold text-white text-base">{initials}</span>
        </div>
      )}
      <div>
        <p className="font-heading font-bold text-secondary" style={{ fontSize: "1rem" }}>{name}</p>
        <p className="font-body text-gray-400" style={{ fontSize: "0.78rem" }}>{role}</p>
      </div>
      <div className="flex items-center gap-0.5 text-[#F5BF3D]">
        {Array.from({ length: stars }).map((_, i) => <Star key={i} />)}
      </div>
      <p className="font-body text-gray-600 flex-1" style={{ fontSize: "0.875rem", lineHeight: 1.75 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="text-gray-100 mt-auto pt-2">
        <QuoteMark />
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function TestimonialsSection() {
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
      tl.fromTo(".testimonials-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 });
      tl.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12 },
        "-=0.3"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="testimonials" className="section-padding bg-background">
      <Container>
        {/* ── Header ── */}
        <div className="testimonials-header mb-14" style={{ opacity: 0 }}>
          <h2
            className="font-heading font-bold text-secondary text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.12, letterSpacing: "-0.02em" }}
          >
            What Our{" "}<br/>
            Clients Say
          </h2>
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </Container>
    </section>
  );
}
