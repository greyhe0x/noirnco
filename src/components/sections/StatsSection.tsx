"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    value: 1201,
    suffix: "+",
    label: "Participants Hosted",
    sub: "international business executives, investors & the diaspora",
    featured: true,
  },
  {
    value: 15,
    suffix: "+",
    label: "Countries Served",
    sub: "global reach, local expertise",
    featured: false,
  },
  {
    value: 40,
    suffix: "+",
    label: "Startups Supported",
    sub: "across Ghana and other ecosystems",
    featured: false,
  },
  {
    value: 98,
    suffix: "%",
    label: "Satisfaction Rate",
    sub: "from clients and program participants",
    featured: false,
  },
] as const;

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      /* Card slides up */
      tl.fromTo(
        ".stats-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      /* Each stat item fades in with stagger */
      tl.fromTo(
        ".stat-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        "-=0.4"
      );

      /* Count-up for every number */
      STATS.forEach((stat, i) => {
        const el = numberRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        const isFeatured = stat.featured;

        tl.to(
          obj,
          {
            val: stat.value,
            duration: isFeatured ? 1.8 : 1.2,
            ease: isFeatured ? "power2.out" : "power1.out",
            onUpdate() {
              el.textContent = Math.round(obj.val).toLocaleString();
            },
            onComplete() {
              el.textContent = stat.value.toLocaleString();
            },
          },
          /* featured starts immediately, others staggered */
          isFeatured ? "-=0.2" : `-=${isFeatured ? 0.2 : 0}`
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="stats" className="py-10 md:py-14 bg-background">
      <Container>
        {/* ── Rounded stats card ─────────────────────────────────────────────── */}
        <div
          className="stats-card relative rounded-3xl overflow-hidden bg-secondary px-8 py-12 md:px-12 md:py-14"
          style={{ opacity: 0 }} /* GSAP will animate to 1 */
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Radial glow top-left */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/15 rounded-full blur-[80px]" />
            {/* Radial glow bottom-right */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
            {/* Decorative ring  large, faint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
          </div>

          {/* Stats grid */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-0 divide-y-2 lg:divide-y-0 lg:divide-x divide-white/10">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-item flex flex-col items-center justify-center text-center px-6 py-8 lg:py-0 gap-2"
                style={{ opacity: 0 }}
              >
                {/* Number */}
                <p
                  className="font-heading font-bold text-white leading-none"
                  style={{
                    fontSize: stat.featured
                      ? "clamp(3rem, 6vw, 4.5rem)"
                      : "clamp(2.25rem, 4.5vw, 3.25rem)",
                  }}
                >
                  <span
                    ref={(el) => { numberRefs.current[i] = el; }}
                  >
                    0
                  </span>
                  <span className={stat.featured ? "text-golden" : "text-golden/80"}>
                    {stat.suffix}
                  </span>
                </p>

                {/* Label */}
                <p
                  className="font-heading font-semibold text-white/90"
                  style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
                >
                  {stat.label}
                </p>

                {/* Sub-label */}
                <p
                  className="font-body text-white/40"
                  style={{ fontSize: "0.75rem" }}
                >
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
