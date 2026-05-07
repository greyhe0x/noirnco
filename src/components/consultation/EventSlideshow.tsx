"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";

const SLIDES = [
  {
    label: "Halcyon 2025 Fellowship",
    caption: "Leadership & market immersion  Accra, Ghana",
    tag: "Fellowship",
    image: "/images/corporate.png",
  },
  {
    label: "Investor Forum Series",
    caption: "Curated deal-flow sessions  Kempinski, Accra",
    tag: "Investor",
    image: "/images/talks.png",
  },
  {
    label: "Adonai Partners Market Entry",
    caption: "Bespoke delegation program  Accra & Kumasi",
    tag: "Market Entry",
    image: "/images/selfie-smile.png",
  },
] as const;

export function EventSlideshow() {
  /*
   * Keep active in BOTH a ref and state:
   *   - ref  → always current inside callbacks (no stale-closure glitch)
   *   - state → triggers re-render for the caption text
   */
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* goTo has NO dependency on active state  uses activeRef instead */
  const goTo = useCallback((next: number) => {
    if (isAnimating.current || next === activeRef.current) return;
    isAnimating.current = true;

    const prev = activeRef.current;
    const current = slideRefs.current[prev];
    const incoming = slideRefs.current[next];
    if (!current || !incoming) {
      isAnimating.current = false;
      return;
    }

    gsap.set(incoming, { opacity: 0, zIndex: 2, scale: 1.06 });
    gsap.set(current, { zIndex: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(current, { zIndex: 0, opacity: 1, scale: 1 });
        isAnimating.current = false;
        activeRef.current = next;
        setActive(next);
      },
    });

    if (captionRef.current) {
      tl.to(captionRef.current, { opacity: 0, y: -8, duration: 0.22, ease: "power2.in" }, 0);
    }
    tl.to(incoming, { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" }, 0.1);
    tl.to(current, { opacity: 0, duration: 0.55, ease: "power2.in" }, 0.1);
    if (captionRef.current) {
      tl.to(captionRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.55);
    }
  }, []);

  /* Start auto-advance on mount; clean up on unmount */
  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0, scale: 1 });
    });

    intervalRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % SLIDES.length;
      goTo(next);
    }, 4500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goTo]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.label}
            fill
            priority={i === 0}
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#050812]/20" />
        </div>
      ))}

      <div
        className="absolute bottom-0 inset-x-0 h-64 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(5,8,18,0.88) 0%, rgba(5,8,18,0.4) 55%, transparent 100%)",
        }}
      />

      <div className="absolute bottom-0 inset-x-0 z-20 px-10 pb-7">
        <div className="flex items-center gap-1.5 mb-5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width: i === active ? "22px" : "6px",
                height: "6px",
                background: i === active ? "#FC883E" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
        <div ref={captionRef}>
          <h3
            className="font-heading font-bold text-white mb-1"
            style={{ fontSize: "1.3rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}
          >
            {SLIDES[active].label}
          </h3>
          <p className="font-body text-white/50" style={{ fontSize: "0.78rem" }}>
            {SLIDES[active].caption}
          </p>
        </div>
      </div>
    </div>
  );
}

