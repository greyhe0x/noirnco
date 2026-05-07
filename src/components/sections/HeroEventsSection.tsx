"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import Link from "next/link";

// Commented out  hero panel hidden for now
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ChevronLeft, MapPin, Calendar } from "lucide-react";
// import { Container } from "@/components/ui";
// import { HeroContent } from "./hero/HeroContent";
// import { HeroVisual } from "./hero/HeroVisual";

/* ─── Data ────────────────────────────────────────────────────────────────── */
/*
 * Each photo slot lists an image path.
 * Existing images: corporate.png · talks.png · selfie-smile.png
 * Placeholder names (add matching files to /public/images/):
 *   halcyon-1..3.jpg · adonai-1..3.jpg · forum-1..3.jpg · startup-1..3.jpg
 */
interface EventPhoto { image: string }
interface EventData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  location: string;
  photos: EventPhoto[];
}

const EVENTS: EventData[] = [
  {
    id: 1,
    title: "Halcyon 2025 Fellowship",
    subtitle: "Connecting Africa's next generation of leaders",
    description:
      "A flagship leadership fellowship bringing together high-potential entrepreneurs and executives from across the diaspora for immersive sessions, curated networking, and deep Ghana market exposure.",
    date: "2025",
    location: "Accra, Ghana",
    photos: [
      { image: "/images/halycon-1.png" },
      { image: "/images/halycon-2.png" },
      { image: "/images/selfie-smile.png" },
    ],
  },
  {
    id: 2,
    title: "Adonai Partners Market Entry",
    subtitle: "Structured access for serious investors",
    description:
      "A bespoke market entry program for Adonai Partners  coordinating investor meetings, site visits, regulatory briefings, and curated dinners with Ghana's leading business figures.",
    date: "2024",
    location: "Accra & Kumasi, Ghana",
    photos: [
      { image: "/images/adonai-1.png" },
      { image: "/images/adonai-2.png" },
      { image: "/images/adonai-3.png" },
    ],
  },
  {
    id: 3,
    title: "Ghana Investor Forum Series",
    subtitle: "Where capital meets opportunity",
    description:
      "A recurring forum series designed to facilitate deal-making and knowledge exchange between international capital holders and Ghana's most promising investment opportunities.",
    date: "Ongoing",
    location: "Kempinski Hotel, Accra",
    photos: [
      { image: "/images/corporate.png" },
      { image: "/images/talks.png" },
      { image: "/images/about-hospitality.png" },
    ],
  },
  {
    id: 4,
    title: "Startup Ecosystem Events",
    subtitle: "Fuelling Ghana's innovation agenda",
    description:
      "From pitch nights to ecosystem summits  we produce high-impact gatherings that connect local startups with the mentors, investors, and networks they need to scale.",
    date: "Year-round",
    location: "KIC, Accra",
    photos: [
      { image: "/images/startup-1.png" },
      { image: "/images/startup-2.png" },
      { image: "/images/startup-3.png" },
    ],
  },
];

const N = EVENTS.length;

/* ─── Events Carousel ─────────────────────────────────────────────────────── */
/*
 * Full-screen photo slideshow as the hero background.
 * Photos crossfade automatically; the brand headline + description sits on top.
 * (Event names are no longer displayed  hero copy is always-on.)
 */
function EventsCarousel() {
  const currentEventRef = useRef(0);
  const currentPhotoRef = useRef(0);
  const isAnimRef       = useRef(false);

  const photoRefs = useRef<(HTMLDivElement | null)[][]>(EVENTS.map(() => []));

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goRef    = useRef<(ei: number, pi: number) => void>(() => {});
  const armRef   = useRef<() => void>(() => {});

  useEffect(() => {
    /* Initialise: first photo visible, rest hidden */
    EVENTS.forEach((ev, ei) => {
      ev.photos.forEach((_, pi) => {
        const el = photoRefs.current[ei]?.[pi];
        if (el) gsap.set(el, { opacity: ei === 0 && pi === 0 ? 1 : 0 });
      });
    });

    /* go: crossfade to a specific event + photo */
    goRef.current = (nextEi: number, nextPi: number) => {
      if (isAnimRef.current) return;
      const prevEi = currentEventRef.current;
      const prevPi = currentPhotoRef.current;
      if (nextEi === prevEi && nextPi === prevPi) return;

      isAnimRef.current = true;

      const prevEl = photoRefs.current[prevEi]?.[prevPi];
      const nextEl = photoRefs.current[nextEi]?.[nextPi];
      if (!prevEl || !nextEl) { isAnimRef.current = false; return; }

      const tl = gsap.timeline({
        onComplete() {
          currentEventRef.current = nextEi;
          currentPhotoRef.current = nextPi;
          isAnimRef.current = false;
          armRef.current();
        },
      });

      tl.to(prevEl, { opacity: 0, duration: 0.9, ease: "power1.inOut" }, 0);
      tl.to(nextEl, { opacity: 1, duration: 0.9, ease: "power1.inOut" }, 0);
    };

    /* arm: schedule the next auto-advance */
    armRef.current = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const ei = currentEventRef.current;
        const pi = currentPhotoRef.current;
        const photosInEvent = EVENTS[ei].photos.length;

        if (pi + 1 < photosInEvent) {
          goRef.current(ei, pi + 1);
        } else {
          goRef.current((ei + 1) % N, 0);
        }
      }, 3800);
    };

    armRef.current();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Photo layers (all events × all photos, stacked) ─────────────── */}
      {EVENTS.map((event, ei) =>
        event.photos.map((photo, pi) => (
          <div
            key={`${ei}-${pi}`}
            ref={el => { photoRefs.current[ei][pi] = el; }}
            className="absolute inset-0"
          >
            <Image
              src={photo.image}
              alt={`${event.title} – photo ${pi + 1}`}
              fill
              priority={ei === 0 && pi === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Subtle per-photo dark scrim */}
            <div className="absolute inset-0 bg-[#050812]/10" />
          </div>
        ))
      )}

      {/* ── Text-legibility gradients ────────────────────────────────────── */}
      {/* Left-heavy veil so copy on the left stays fully readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, rgba(5,8,18,0.78) 0%, rgba(5,8,18,0.48) 45%, rgba(5,8,18,0.05) 100%)",
        }}
      />
      {/* Bottom vignette for scroll hint */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(5,8,18,0.7) 0%, transparent 100%)" }}
      />

      {/* ── Brand / hero content ─────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end sm:justify-center px-5 sm:px-10 md:px-16 xl:px-24 pt-20 pb-10 sm:pb-12">
        <div className="max-w-2xl flex flex-col gap-5">

          {/* Headline */}
          <h1
            className="font-heading font-bold text-white"
            style={{
              fontSize:   "clamp(2.75rem, 3vw, 2.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              /* Shadow on the white "Ghana," portion */
              textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 8px 48px rgba(0,0,0,0.35)",
            }}
          >

              <strong className="text-white text-[1.8rem]">Curated Access to</strong>
            {" "}<br/>
            <span
              style={{
                backgroundImage:      "url('/images/gh-patterns.png')",
                backgroundClip:       "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundSize:       "320px auto",
                backgroundPosition:   "center",
                filter:               "drop-shadow(0 0 2px rgba(255,255,255,0.95)) drop-shadow(0 0 8px rgba(255,255,255,0.80)) drop-shadow(0 0 22px rgba(255,255,255,0.55))",
                fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              }}
            >
              Ghana's
            </span>
            {" "}<br/>Opportunities, Culture <br/>and Connections
            {/* Image-filled text: gh-patterns.png clipped to the letterforms */}
            {/* Layered dark halos lift the text off the photo background */}
          </h1>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <AvatarGroup
              count={5}
              size="md"
              images={[
                "/images/participant-1.png",
                "/images/participant-2.png",
                "/images/participant-3.png",
                "/images/participant-4.png",
                "/images/participant-5.png",
              ]}
            />
            <div>
              <p
                className="font-heading font-bold text-white leading-none"
                style={{ fontSize: "0.9375rem" }}
              >
                270+ Participants
              </p>
              <p
                className="font-body text-white/55"
                style={{ fontSize: "0.71875rem" }}
              >
                hosted across 8+ global markets
              </p>
            </div>
          </div>

          {/* Body */}
          <p
            className="font-body text-white/70 max-w-lg"
            style={{ fontSize: "clamp(0.875rem, 1.4vw, 1rem)", lineHeight: 1.8 }}
          >
            A program management and hospitality company specialising in structured,
            insight-driven experiences in Ghana for investors, businesses, and the diaspora.
          </p>

          {/* CTA */}
          <div>
            <Button asChild variant="primary" size="lg" className="group">
              <Link href="/consultation">
                Plan Your Experience
                <ChevronRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </div>

        </div>
      </div>

      {/* ── Scroll hint ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none max-md:hidden"
        style={{ opacity: 0.35 }}
      >
        <span
          className="font-body text-white"
          style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
        >
          Scroll to explore
        </span>
        <ChevronDown size={14} className="text-white animate-bounce" />
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
 * HeroEventsSection
 * ─────────────────────────────────────────────────────────────────────────
 * The two-panel scrubbed hero ↔ events transition is commented out.
 * Currently: full-screen photo carousel as the sole hero.
 * To restore: uncomment the wrapper + GSAP scroll blocks below.
 * ════════════════════════════════════════════════════════════════════════════ */
export function HeroEventsSection() {
  return (
    <section id="home" className="relative h-screen overflow-hidden bg-[#050812]">
      <EventsCarousel />
    </section>
  );
}

/* ── COMMENTED OUT  two-panel hero + events scroll transition ──────────────
export function HeroEventsSection_TwoPanel() {
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const trackRef        = useRef<HTMLDivElement>(null);
  const heroPanelRef    = useRef<HTMLDivElement>(null);
  const eventsPanelRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrapper     = wrapperRef.current;
    const track       = trackRef.current;
    const heroPanel   = heroPanelRef.current;
    const eventsPanel = eventsPanelRef.current;
    if (!wrapper || !track || !heroPanel || !eventsPanel) return;

    const st = {
      trigger: wrapper,
      start: "top top",
      end: () => `+=${window.innerHeight}`,
      scrub: true,
      invalidateOnRefresh: true,
      snap: { snapTo: 1, duration: { min: 0.4, max: 0.7 }, ease: "none", delay: 0.3 },
    };

    gsap.to(track,       { x: () => -window.innerWidth, ease: "none", scrollTrigger: st });
    gsap.to(heroPanel,   { opacity: 0, ease: "power1.in", scrollTrigger: { ...st, snap: undefined, end: () => `+=${window.innerHeight * 0.7}` } });
    gsap.fromTo(eventsPanel, { opacity: 0 }, { opacity: 1, ease: "power1.out",
      scrollTrigger: { ...st, snap: undefined,
        start: () => { const wTop = wrapper.getBoundingClientRect().top + window.scrollY; return `${wTop + window.innerHeight * 0.3}px top`; },
        end: () => `+=${window.innerHeight * 0.7}`,
      },
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(resizeTimer); };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050812]">
        <div ref={trackRef} className="flex h-full" style={{ width: "200vw", willChange: "transform" }}>
          <div ref={heroPanelRef} id="home" className="relative flex-shrink-0 bg-background h-full" style={{ width: "100vw" }}>
            <Container className="relative z-10 w-full h-full flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 items-center w-full pt-16 pb-6 lg:py-20">
                <div className="order-first lg:order-last"><HeroVisual /></div>
                <div className="order-last lg:order-first"><HeroContent /></div>
              </div>
            </Container>
          </div>
          <div ref={eventsPanelRef} className="relative flex-shrink-0 h-full" style={{ width: "100vw", opacity: 0, mixBlendMode: "screen" }}>
            <EventsCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
── END COMMENTED OUT ── */
