"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container, HeadingOnLight, TextOnLight } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

/* ─── Star icon ───────────────────────────────────────────────────────────── */
function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.44l-3.71 2.11L5 8.42 2 5.5l4.15-.75L8 1z" />
    </svg>
  );
}

/* ─── Testimonial data ────────────────────────────────────────────────────── */
/*
 * Photo placeholders  add matching files to /public/images/:
 *   avatar-safesip.png · avatar-cherotich.png · avatar-dan-barker.png
 *   avatar-marcelo.png · avatar-mercy.png     · avatar-maya.png
 *   avatar-edward.png  · avatar-millicent.png · avatar-tsia.png
 *   avatar-isaac.png   · avatar-joseph.png
 */
const TESTIMONIALS = [
  {
    initials: "SS",
    photo:    "/images/avatar-safesip.png",
    name:     "SafeSip Team",
    role:     "",
    org:      "SafeSip",
    bg:       "bg-primary",
    quote:    "Noir & Co made navigating a new country feel effortless. Every detail was anticipated.",
    stars:    5,
  },
  {
    initials: "CR",
    photo:    "/images/avatar-cherotich.png",
    name:     "Cherotich Rutto",
    role:     "",
    org:      "TAWI",
    bg:       "bg-[#9B3E6E]",
    quote:    "I appreciated how comfortable and well-hosted we were. It made it easier to fully focus on the program.",
    stars:    5,
  },
  {
    initials: "DB",
    photo:    "/images/avatar-dan-barker.png",
    name:     "Dan Barker",
    role:     "CEO",
    org:      "Halcyon",
    bg:       "bg-secondary",
    quote:    "We really had a good time and I can see the fellows enjoyed their time here so we come back next year.",
    stars:    5,
  },
  {
    initials: "MH",
    photo:    "/images/avatar-marcelo.png",
    name:     "Marcelo Homrich",
    role:     "Vice President",
    org:      "Halcyon",
    bg:       "bg-[#2596be]",
    quote:    "Thank you guys so much for everything, you've been very helpful, I loved the food and the event was a success, let's keep in touch.",
    stars:    5,
  },
  {
    initials: "ME",
    photo:    "/images/avatar-mercy.png",
    name:     "Mercy Erhiawarien",
    role:     "Senior Manager, Accelerator Program",
    org:      "Halcyon",
    bg:       "bg-success",
    quote:    "My experience with Noir & Co was truly exceptional. The team handled everything so seamlessly, allowing me to be fully present throughout the program. The Cape Coast tour was especially meaningful  it wasn't just a visit, it was a deeply intentional experience.",
    stars:    5,
  },
  {
    initials: "MC",
    photo:    "/images/avatar-maya.png",
    name:     "Maya Carpenter",
    role:     "Senior Coordinator, Accelerator Program",
    org:      "Halcyon",
    bg:       "bg-primary",
    quote:    "I truly just loved the whole experience and will love to come back.",
    stars:    5,
  },
  {
    initials: "E",
    photo:    "/images/avatar-edward.png",
    name:     "Edward",
    role:     "",
    org:      "SafeSip",
    bg:       "bg-[#9B3E6E]",
    quote:    "To Sandra, Jessica and Ronald  you have been amazing team players. You coordinated everything in a timely manner and we will love to stay longer. Thank you very much for having us.",
    stars:    5,
  },
  {
    initials: "MO",
    photo:    "/images/avatar-millicent.png",
    name:     "Millicent Okumu",
    role:     "",
    org:      "Agriflex",
    bg:       "bg-secondary",
    quote:    "I had such a comfortable stay with Noir & Co. Even with my dietary preferences, the team was incredibly thoughtful and made sure I always had meals I could enjoy. I truly felt cared for throughout my time in Accra.",
    stars:    5,
  },
  {
    initials: "TB",
    photo:    "/images/avatar-tsia.png",
    name:     "Tsia Blacksher",
    role:     "Program Coordinator",
    org:      "Halcyon",
    bg:       "bg-[#2596be]",
    quote:    "I loved the Cape Coast tour, it was an experience I'm not forgetting anytime soon.",
    stars:    5,
  },
  {
    initials: "IS",
    photo:    "/images/avatar-isaac.png",
    name:     "Isaac Sesi",
    role:     "",
    org:      "SESI Technologies",
    bg:       "bg-success",
    quote:    "Being back home felt incredible, and Noir & Co made it even more special. Everything was seamless, warm, and thoughtfully done. I truly felt reconnected to Ghana in the best way.",
    stars:    5,
  },
  {
    initials: "JS",
    photo:    "/images/avatar-joseph.png",
    name:     "Joseph Simukoko",
    role:     "",
    org:      "greengiraffe",
    bg:       "bg-primary",
    quote:    "I loved the ambience of the locations especially the one for the Investor Dinner and networking. I felt important.",
    stars:    5,
  },
] as const;

/* Split into two rows for the marquee */
const ROW_ONE = TESTIMONIALS.slice(0, 6);  // scrolls left
const ROW_TWO = TESTIMONIALS.slice(6);     // scrolls right

/* ─── Card ────────────────────────────────────────────────────────────────── */
function TestimonialCard({
  initials, photo, name, role, org, bg, quote, stars,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[330px] flex flex-col bg-surface rounded-2xl p-5 border border-gray-100 shadow-[var(--shadow-card)] gap-3 mx-2">
      {/* Top: avatar + name */}
      <div className="flex items-center gap-3">
        {photo ? (
          <div className="w-11 h-11 rounded-full overflow-hidden relative flex-shrink-0 border-2 border-surface shadow-sm">
            <Image src={photo} alt={name} fill sizes="44px" className="object-cover object-top" />
          </div>
        ) : (
          <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center flex-shrink-0 border-2 border-surface shadow-sm`}>
            <span className="font-heading font-bold text-white text-sm">{initials}</span>
          </div>
        )}
        <div className="min-w-0">
          <TextOnLight
            as="p"
            weight="semibold"
            className="truncate"
            style={{ fontSize: "0.875rem" }}
          >
            {name}
          </TextOnLight>
          <TextOnLight
            as="p"
            emphasis="muted"
            className="truncate"
            style={{ fontSize: "0.72rem" }}
          >
            {role ? `${role} · ${org}` : org}
          </TextOnLight>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 text-[#F5BF3D]">
        {Array.from({ length: stars }).map((_, i) => <Star key={i} />)}
      </div>

      {/* Quote */}
      <p
        className="font-body text-gray-600 line-clamp-4"
        style={{ fontSize: "0.8125rem", lineHeight: 1.75 }}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

/* ─── Marquee row ─────────────────────────────────────────────────────────── */
function MarqueeRow({
  items,
  direction,
}: {
  items: typeof ROW_ONE | typeof ROW_TWO;
  direction: "left" | "right";
}) {
  /* Duplicate for seamless infinite loop */
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div className={direction === "left" ? "marquee-track-left flex" : "marquee-track-right flex"}>
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".testimonials-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="testimonials" className="section-padding bg-background relative overflow-hidden">

      {/* ── Header ── */}
      <Container>
        <div className="testimonials-header mb-12 text-center" style={{ opacity: 0 }}>
          <HeadingOnLight
            as="h2"
            weight="bold"
            className="text-secondary-light"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.12, letterSpacing: "-0.02em" }}
          >
            What Our Clients Say
          </HeadingOnLight>
          <TextOnLight
            as="p"
            emphasis="muted"
            className="mt-3 max-w-md mx-auto"
            style={{ fontSize: "0.9rem" }}
          >
            Real words from investors, fellows, and executives we&apos;ve hosted across Ghana.
          </TextOnLight>
        </div>
      </Container>

      {/* ── Marquee rows ── */}
      <div className="flex flex-col gap-4">
        <MarqueeRow items={ROW_ONE} direction="left"  />
        <MarqueeRow items={ROW_TWO} direction="right" />
      </div>

      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

    </section>
  );
}
