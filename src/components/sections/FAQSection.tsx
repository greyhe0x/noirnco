"use client";

import React, { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Container, Button, HeadingOnLight, TextOnLight } from "@/components/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ─── FAQ data ────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "What exactly does Noir & Co do?",
    a: "We're a program management and hospitality company based in Accra. We specialise in designing and delivering structured, insight-driven experiences in Ghana  for investors exploring opportunities, businesses entering the market, and diaspora reconnecting with home. Think of us as your dedicated partner on the ground.",
  },
  {
    q: "Who do you typically work with?",
    a: "Our clients include international investors conducting due diligence, corporate delegations on market entry visits, diaspora professionals returning to explore opportunities, and organisations running leadership or fellowship programs in Ghana. If you're serious about Ghana, we're the right partner.",
  },
  {
    q: "What types of programs do you design?",
    a: "We design tailored programs including investor immersions, market entry visits, executive learning journeys, corporate retreats, and curated cultural experiences. Each program is built around your specific goals, whether that’s exploring opportunities, building partnerships, or gaining local insight.",
  },
  {
    q: "Do you offer end-to-end support?",
    a: "Yes. We provide comprehensive, end-to-end support—from program design and planning to on-the-ground logistics, accommodation, private transport, and concierge services. Our role is to ensure a seamless, well-coordinated experience from arrival to departure.",
  },
  {
    q: "Can you support short visits as well as longer stays?",
    a: "Absolutely. We support both short-term visits and extended stays, with services tailored to the depth and duration of your engagement in Ghana.",
  },
  {
    q: "How customized are your services?",
    a: "Every experience we deliver is fully customized. We take the time to understand your objectives and design a program or itinerary that aligns precisely with your goals, preferences, and timeline.",
  },
  {
    q: "What does a 'structured experience' actually include?",
    a: "It depends on your goals  but typically this means curated stakeholder meetings, expert-led briefings, site visits, cultural immersions, premium accommodation, private transportation, and on-ground concierge support throughout. We design the full arc of your time in Ghana around a clear objective.",
  },
  {
    q: "Do you only operate in Accra?",
    a: "Accra is our operational base, but we work nationwide. We've delivered programs in Kumasi, Takoradi, Cape Coast, and across the Volta and Eastern regions. If your itinerary requires it, we go where you need to go.",
  },
  {
    q: "How far in advance should I engage you?",
    a: "For multi-day programs and investor delegations, we recommend at least 8–10 weeks  curated meetings and premium logistics take time to get right. For shorter visits or concierge-only support, 2–4 weeks is usually sufficient. That said, reach out even if you're working to a tight timeline  we'll always do our best.",
  },
  {
    q: "Can you accommodate both small delegations and larger groups?",
    a: "Yes. We've managed intimate two-person investor visits and multi-day programs for 60+ participants. The approach scales; the standard doesn't. Every client receives the same level of attention to detail regardless of group size.",
  },
  {
    q: "Can you facilitate introductions and networking opportunities?",
    a: "Yes. As part of our program design, we can facilitate curated introductions, meetings, and networking opportunities aligned with your objectives, subject to relevance and availability.",
  },
  {
    q: "Do you work with international clients who've never been to Ghana?",
    a: "That's exactly who we're built for. If you're coming to Ghana for the first time  or returning after years away  we remove every friction point: context, connections, logistics, culture, safety, and etiquette. You arrive informed and leave ready to act.",
  },
  {
    q: "What makes Noir & Co different from a travel agency or event planner?",
    a: "We're neither. A travel agency moves you around; an event planner handles logistics. We design programs with a purpose  every element is intentional, every connection is curated, and every experience is built to move you closer to a specific outcome. The hospitality is exceptional, but it's always in service of your goals.",
  },
  {
    q: "Do you have established partners in Ghana?",
    a: "Yes  we've built a trusted network of partners across accommodation, transport, dining, and institutional access. Key partners include KIC (Kosmos Innovation Centre), Pelican Hotel, and several premium institutions and venues across Accra and beyond.",
  },
  {
    q: "What does the process look like once I reach out?",
    a: "We'll schedule a short discovery call to understand your objectives, timeline, and group profile. From there, we design a tailored program proposal  including a clear scope, itinerary outline and budget. Most clients move from first call to confirmed program within two weeks.",
  },
  {
    q: "How do I get started?",
    a: "Click \"Plan Your Experience\" or \"Book a Consultation\" anywhere on this site. You'll be taken through a short intake form so we can understand your needs before we speak. We typically respond within 24 hours.",
  },
  {
    q: "Do you accept all requests?",
    a: "We work on a selective basis to ensure the quality and integrity of each experience. Engagements are confirmed based on alignment, scope, and availability.",
  },
] as const;

/* ─── Single accordion item ───────────────────────────────────────────────── */
function FAQItem({
  q, a, isOpen, onToggle, index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: (i: number) => void;
  index: number;
}) {
  const bodyRef    = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const prevOpen   = useRef(false);

  /* Animate whenever isOpen changes */
  useGSAP(() => {
    const body    = bodyRef.current;
    const chevron = chevronRef.current;
    if (!body || !chevron) return;

    if (isOpen && !prevOpen.current) {
      /* Open: measure natural height then animate 0 → height */
      gsap.set(body, { height: "auto", opacity: 1 });
      const h = body.offsetHeight;
      gsap.fromTo(
        body,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.42, ease: "power2.out" }
      );
      gsap.to(chevron, { rotation: 180, duration: 0.3, ease: "power2.out" });
    } else if (!isOpen && prevOpen.current) {
      /* Close: animate height → 0 */
      gsap.to(body,    { height: 0, opacity: 0, duration: 0.32, ease: "power2.in" });
      gsap.to(chevron, { rotation: 0,   duration: 0.3, ease: "power2.in"  });
    }

    prevOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div
      className={cn(
        "faq-item border rounded-2xl overflow-hidden transition-colors duration-200",
        isOpen
          ? "border-primary/30 bg-surface shadow-[var(--shadow-card)]"
          : "border-gray-200 bg-surface hover:border-gray-300"
      )}
    >
      {/* Question row */}
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "font-heading font-semibold transition-colors duration-200",
            isOpen ? "text-primary" : "text-secondary group-hover:text-primary"
          )}
          style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)" }}
        >
          {q}
        </span>
        <ChevronDown
          ref={chevronRef}
          size={20}
          className={cn(
            "flex-shrink-0 transition-colors duration-200",
            isOpen ? "text-primary" : "text-gray-400 group-hover:text-primary"
          )}
        />
      </button>

      {/* Answer  GSAP controls height */}
      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p
          className="font-body text-gray-600 px-6 pb-6 pt-0 border-t border-gray-100"
          style={{ fontSize: "clamp(0.875rem, 1.3vw, 0.9375rem)", lineHeight: 1.8 }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default

  const toggle = useCallback((i: number) => {
    setOpenIndex((cur) => (cur === i ? null : i));
  }, []);

  /* Entrance animation */
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
      tl.fromTo(".faq-left",  { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.75 });
      tl.fromTo(".faq-item",  { opacity: 0, y: 24  }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, "-=0.4");
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="faq" className="section-padding bg-surface-muted">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[38fr_62fr] gap-14 lg:gap-20">

          {/* ═══ LEFT  sticky header ══════════════════════════════════════ */}
          <div
            className="faq-left flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start"
            style={{ opacity: 0 }}
          >
            <HeadingOnLight
              as="h2"
              weight="bold"
              className="text-secondary-dark"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
              }}
            >
              Frequently Asked{" "}
              Questions
            </HeadingOnLight>

            <TextOnLight
              as="p"
              emphasis="muted"
              style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)", lineHeight: 1.8 }}
            >
              Can&apos;t find what you&apos;re looking for? Our team is always happy
              to help  just send us a message and we&apos;ll get back to you within
              24 hours.
            </TextOnLight>

            <Button asChild variant="primary" size="md" className="w-fit gap-2">
              <Link href="/consultation">
                <MessageCircle size={16} />
                Speak to Our Team
              </Link>
            </Button>
          </div>

          {/* ═══ RIGHT  accordion list ════════════════════════════════════ */}
          <div className="flex flex-col gap-3">
            {FAQS.map((item, i) => (
              <FAQItem
                key={i}
                index={i}
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={toggle}
              />
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
