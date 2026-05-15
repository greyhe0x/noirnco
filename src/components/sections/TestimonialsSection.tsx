"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button, Container, HeadingOnLight, TextOnLight } from "@/components/ui";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* ─── Star icon ───────────────────────────────────────────────────────────── */
function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.44l-3.71 2.11L5 8.42 2 5.5l4.15-.75L8 1z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
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
type TItem = {
  initials: string;
  photo?: string;
  name: string;
  role: string;
  org: string;
  bg: string;
  quote: string;
  stars: number;
};

const TESTIMONIALS: TItem[] = [
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
];

function AvatarBlock({ t, size }: { t: TItem; size: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-16 h-16 border-[3px]" : size === "md" ? "w-14 h-14 border-2" : "w-11 h-11 border-2";
  const fontCls = size === "lg" ? "text-lg" : size === "md" ? "text-base" : "text-sm";
  const sizesPx = size === "lg" ? "64px" : size === "md" ? "56px" : "44px";

  return photoAvatar(t, dims, fontCls, sizesPx);
}

function photoAvatar(t: TItem, dims: string, fontCls: string, sizesPx: string) {
  return t.photo ? (
    <div className={cn("rounded-full overflow-hidden relative flex-shrink-0 border-surface shadow-sm", dims)} aria-hidden>
      <Image src={t.photo} alt="" fill sizes={sizesPx} className="object-cover object-top" />
    </div>
  ) : (
    <div className={cn(`${t.bg} flex items-center justify-center flex-shrink-0 rounded-full border-surface shadow-sm`, dims)}>
      <span className={cn("font-heading font-bold text-white", fontCls)}>{t.initials}</span>
    </div>
  );
}

/* ─── Main spotlight slide ────────────────────────────────────────────────── */
function MainSlide({ t }: { t: TItem }) {
  const subtitle = t.role ? `${t.role} · ${t.org}` : t.org;

  return (
    <article
      className={cn(
        "flex h-full min-h-0 flex-col justify-between gap-6 rounded-3xl border border-gray-100 bg-surface p-8 shadow-[var(--shadow-card)] lg:p-10",
        "animate-fade-in"
      )}
      aria-labelledby={`testimonial-${slug(t.name)}-heading`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <AvatarBlock t={t} size="lg" />
          <div className="min-w-0 flex-1">
            <TextOnLight as="p" weight="semibold" className="text-xl lg:text-2xl text-black" id={`testimonial-${slug(t.name)}-heading`}>
              {t.name}
            </TextOnLight>
            {subtitle ? (
              <TextOnLight as="p" emphasis="muted" className="mt-1 text-sm lg:text-base">
                {subtitle}
              </TextOnLight>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-[#F5BF3D]" aria-label={`${t.stars} out of 5 stars`}>
          {Array.from({ length: t.stars }).map((_, i) => (
            <Star key={i} />
          ))}
        </div>

        <blockquote>
          <p
            className="font-body text-gray-700 leading-relaxed lg:leading-[1.85]"
            style={{ fontSize: "clamp(1.05rem, 0.35vw + 0.98rem, 1.35rem)" }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
        </blockquote>
      </div>
    </article>
  );
}

function slug(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
}

/* ─── Side peek (previous / next) ──────────────────────────────────────────── */
function SidePeek({
  t,
  label,
  onActivate,
  desktopOrigin,
}: {
  t: TItem;
  label: string;
  onActivate: () => void;
  desktopOrigin: "left" | "right";
}) {
  const subtitle = t.role ? `${t.role} · ${t.org}` : t.org;

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={label}
      className={cn(
        "flex h-full min-h-[260px] flex-col gap-3 rounded-2xl border border-gray-100 bg-surface/95 p-5 text-left shadow-sm backdrop-blur-sm transition-all duration-300 lg:min-h-[320px] lg:rounded-3xl lg:p-6",
        "hover:border-primary/25 hover:shadow-[var(--shadow-card)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        desktopOrigin === "left" ? "origin-right lg:scale-[0.94]" : "origin-left lg:scale-[0.94]",
        "opacity-[0.92] hover:opacity-100 lg:hover:scale-[0.97]",
        "active:scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-3">
        <AvatarBlock t={t} size="sm" />
        <div className="min-w-0">
          <TextOnLight as="p" weight="semibold" className="truncate text-sm lg:text-base text-black">
            {t.name}
          </TextOnLight>
          {subtitle ? (
            <TextOnLight as="p" emphasis="muted" className="truncate text-xs lg:text-sm">
              {subtitle}
            </TextOnLight>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-0.5 text-[#F5BF3D]" aria-hidden>
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} />
        ))}
      </div>
      <p className="font-body text-gray-600 line-clamp-5 text-xs leading-relaxed lg:text-sm lg:leading-relaxed">
        &ldquo;{t.quote}&rdquo;
      </p>
      <span className="mt-auto pt-2 font-body text-xs font-semibold text-primary lg:text-sm">
        {desktopOrigin === "left" ? "← Previous" : "Next →"}
      </span>
    </button>
  );
}

/* ─── Carousel ─────────────────────────────────────────────────────────────── */
function TestimonialSlideshow() {
  const n = TESTIMONIALS.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [respectReducedMotion, setRespectReducedMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setRespectReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const prevIdx = (index - 1 + n) % n;
  const nextIdx = (index + 1) % n;

  const goPrev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  useEffect(() => {
    if (paused || respectReducedMotion || n <= 1) return;
    const id = window.setInterval(goNext, 7200);
    return () => window.clearInterval(id);
  }, [paused, respectReducedMotion, goNext, n]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement) && document.activeElement !== el) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const current = TESTIMONIALS[index];
  const prev = TESTIMONIALS[prevIdx];
  const next = TESTIMONIALS[nextIdx];

  return (
    <div
      ref={carouselRef}
      className="mx-auto max-w-6xl outline-none"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {/* Desktop / tablet: main + side peeks */}
      <div className="hidden gap-5 md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)_minmax(0,0.95fr)] md:items-stretch lg:gap-8">
        <SidePeek t={prev} label={`Previous testimonial: ${prev.name}`} onActivate={goPrev} desktopOrigin="left" />
        <div key={index} className="min-h-0 min-w-0">
          <MainSlide t={current} />
        </div>
        <SidePeek t={next} label={`Next testimonial: ${next.name}`} onActivate={goNext} desktopOrigin="right" />
      </div>

      {/* Mobile: spotlight only */}
      <div className="md:hidden">
        <div key={index}>
          <MainSlide t={current} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SidePeek
            t={prev}
            label={`Previous testimonial: ${prev.name}`}
            onActivate={goPrev}
            desktopOrigin="left"
          />
          <SidePeek
            t={next}
            label={`Next testimonial: ${next.name}`}
            onActivate={goNext}
            desktopOrigin="right"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button type="button" variant="ghost" size="icon" aria-label="Previous testimonial" onClick={goPrev}>
          <ChevronLeftIcon />
        </Button>
        <div className="flex max-w-[min(100%,280px)] flex-wrap justify-center gap-2 px-2" role="tablist" aria-label="Choose testimonial">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to testimonial ${i + 1} of ${n}`}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-300 ease-out",
                i === index ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Next testimonial" onClick={goNext}>
          <ChevronRightIcon />
        </Button>
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
    <section ref={sectionRef} id="testimonials" className="section-padding bg-background relative">

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

        <TestimonialSlideshow />
      </Container>

    </section>
  );
}
