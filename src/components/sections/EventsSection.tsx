"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ────────────────────────────────────────────────────────────────── */
const EVENTS = [
  {
    id: 1,
    category: "Corporate",
    title: "Ghana CEO Tech Summit",
    subtitle: "Where Ghana's business elite converge",
    description:
      "A landmark gathering of 400+ technology and business leaders. From branded stage builds to precision catering — every touchpoint designed to inspire.",
    date: "November 2024",
    location: "Kempinski Hotel, Accra",
    tagClass: "bg-primary/20 text-primary",
    gradientStyle: {
      background:
        "radial-gradient(ellipse at 65% 35%, rgba(252,136,62,0.4) 0%, transparent 55%), linear-gradient(150deg, #0E1118 0%, #1B1F2A 55%, #0E1118 100%)",
    },
  },
  {
    id: 2,
    category: "Wedding",
    title: "Asantewaa Royal Wedding",
    subtitle: "Tradition, elegance and 300 smiling guests",
    description:
      "A breathtaking fusion of Ghanaian tradition and modern luxury. Custom florals, live Highlife band, and a reception that ran perfectly to the second.",
    date: "September 2024",
    location: "Labadi Beach Hotel, Accra",
    tagClass: "bg-[#9B3E6E]/20 text-[#c06090]",
    gradientStyle: {
      background:
        "radial-gradient(ellipse at 60% 40%, rgba(253,166,102,0.55) 0%, transparent 55%), linear-gradient(150deg, #4A1942 0%, #9B3E6E 55%, #4A1942 100%)",
    },
  },
  {
    id: 3,
    category: "Cultural",
    title: "Accra Fashion Week Gala",
    subtitle: "West Africa's most anticipated closing night",
    description:
      "The sold-out closing gala for Accra Fashion Week, produced end-to-end by our creative team — runway, lighting, artist bookings, and VIP hospitality.",
    date: "July 2024",
    location: "National Theatre, Accra",
    tagClass: "bg-warning/20 text-warning",
    gradientStyle: {
      background:
        "radial-gradient(ellipse at 70% 30%, rgba(252,136,62,0.65) 0%, transparent 50%), linear-gradient(150deg, #1A0A00 0%, #3D1F00 55%, #1A0A00 100%)",
    },
  },
  {
    id: 4,
    category: "Awards Gala",
    title: "Cocoa Board Annual Awards",
    subtitle: "Honouring Ghana's agricultural heroes",
    description:
      "A night of prestige for 250 distinguished guests. Custom décor, award production, curated menu, and a live performance — all flawlessly executed.",
    date: "March 2024",
    location: "Movenpick Ambassador, Accra",
    tagClass: "bg-success/15 text-success",
    gradientStyle: {
      background:
        "radial-gradient(ellipse at 60% 35%, rgba(0,172,86,0.45) 0%, transparent 55%), linear-gradient(150deg, #051A0D 0%, #0B3320 55%, #051A0D 100%)",
    },
  },
] as const;

/* ─── Component ───────────────────────────────────────────────────────────── */
export function EventsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef  = useRef<HTMLDivElement>(null);
  const autoRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const [active, setActive] = useState(0);
  const [busy,   setBusy]   = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  /* ── Section entrance ── */
  useGSAP(
    () => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  /* ── Left-to-right slide transition ── */
  const goTo = useCallback(
    (next: number) => {
      if (busy || next === active) return;
      setBusy(true);

      const incoming = slideRefs.current[next];
      const current  = slideRefs.current[active];
      if (!incoming || !current) { setBusy(false); return; }

      // Incoming starts clipped to the left (translateX -100%), fully transparent
      gsap.set(incoming, { opacity: 0, x: "-6%", zIndex: 2 });
      gsap.set(current,  { zIndex: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(current, { zIndex: 0, opacity: 1, x: 0 });
          setActive(next);
          setFadeKey((k) => k + 1);
          setBusy(false);
        },
      });

      // Incoming slides in from left while fading in
      tl.to(incoming, { opacity: 1, x: "0%", duration: 0.75, ease: "power3.out" }, 0);
      // Current fades and nudges right
      tl.to(current,  { opacity: 0, x: "4%", duration: 0.55, ease: "power2.in"  }, 0);
    },
    [active, busy]
  );

  const goPrev = () => goTo((active - 1 + EVENTS.length) % EVENTS.length);
  const goNext = () => goTo((active + 1) % EVENTS.length);

  /* ── Autoplay ── */
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActive((cur) => {
        const next = (cur + 1) % EVENTS.length;
        setTimeout(() => goTo(next), 0);
        return cur;
      });
    }, 5500);
  }, [goTo]);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ev = EVENTS[active];

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative overflow-hidden bg-secondary"
      style={{ minHeight: "620px", opacity: 0 }}
    >
      {/* ══ Full-bleed slides ════════════════════════════════════════════════ */}
      {EVENTS.map((e, i) => (
        <div
          key={e.id}
          ref={(el) => { slideRefs.current[i] = el; }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0, x: 0 } as React.CSSProperties}
        >
          {/* Gradient background (replace with <Image> when photos ready) */}
          <div className="absolute inset-0" style={e.gradientStyle} />

          {/* Subtle noise */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "128px 128px",
            }}
          />

          {/* Watermark category */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <p
              className="font-heading font-black text-white/[0.04] uppercase tracking-[0.18em]"
              style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
            >
              {e.category}
            </p>
          </div>
        </div>
      ))}

      {/* ══ Bottom gradient overlay ════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: "75%",
          background: "linear-gradient(to top, rgba(5,8,18,0.97) 0%, rgba(5,8,18,0.7) 45%, transparent 100%)",
        }}
      />

      {/* ══ Right-side vertical gradient for content legibility ═══════════ */}
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{
          width: "60%",
          background: "linear-gradient(to right, rgba(5,8,18,0.5) 0%, transparent 100%)",
        }}
      />

      {/* ══ Content overlay ════════════════════════════════════════════════ */}
      <div className="relative z-20 flex flex-col justify-end h-full px-8 md:px-14 xl:px-20 pb-14 pt-32 max-w-7xl mx-auto">

        {/* Event details — CSS animated on slide change */}
        <div key={fadeKey} className="animate-fade-in max-w-xl">
          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={cn("font-body font-semibold rounded-full px-3 py-1", ev.tagClass)}
              style={{ fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              {ev.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/45 font-body" style={{ fontSize: "0.78rem" }}>
              <Calendar size={12} className="text-white/35 flex-shrink-0" />
              {ev.date}
            </span>
            <span className="flex items-center gap-1.5 text-white/45 font-body" style={{ fontSize: "0.78rem" }}>
              <MapPin size={12} className="text-white/35 flex-shrink-0" />
              {ev.location}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-heading font-bold text-white mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
          >
            {ev.title}
          </h2>

          {/* Subtitle */}
          <p className="font-body text-white/50 italic mb-5" style={{ fontSize: "clamp(0.875rem, 1.4vw, 1rem)" }}>
            {ev.subtitle}
          </p>

          {/* Description */}
          <p
            className="font-body text-white/70 border-l-2 border-primary/60 pl-4"
            style={{ fontSize: "clamp(0.875rem, 1.3vw, 0.9375rem)", lineHeight: 1.8 }}
          >
            {ev.description}
          </p>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center gap-5 mt-10">
          {/* Arrows */}
          <button
            onClick={() => { goPrev(); startAuto(); }}
            disabled={busy}
            aria-label="Previous event"
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-primary hover:bg-primary/15 transition-all duration-200 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => { goNext(); startAuto(); }}
            disabled={busy}
            aria-label="Next event"
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-all duration-200 shadow-[var(--shadow-primary)] disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>

          {/* Counter */}
          <span className="font-heading font-semibold text-white/40 tabular-nums" style={{ fontSize: "0.875rem" }}>
            <span className="text-white" style={{ fontSize: "1.125rem" }}>
              {String(active + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(EVENTS.length).padStart(2, "0")}
          </span>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 ml-1">
            {EVENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); startAuto(); }}
                aria-label={`Go to event ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "24px" : "8px",
                  height: "8px",
                  background: i === active ? "#FC883E" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex-1 hidden sm:block h-[2px] bg-white/10 rounded-full overflow-hidden ml-2">
            <div
              className="h-full bg-primary/70 rounded-full"
              style={{
                width: `${((active + 1) / EVENTS.length) * 100}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
