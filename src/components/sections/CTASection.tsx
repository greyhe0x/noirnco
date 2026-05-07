"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container, HeadingOnDark, TextOnDark } from "@/components/ui";
import { useGsapReveal } from "@/hooks/useGsapFadeIn";

export function CTASection() {
  const ref = useGsapReveal<HTMLDivElement>({ y: 40 });

  return (
    <section id="contact" className="section-padding bg-background">
      <Container>
        <div
          ref={ref}
          className="relative rounded-3xl overflow-hidden bg-secondary px-8 py-16 md:px-16 md:py-20 text-center"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(252,136,62,0.25)_0%,_transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(252,136,62,0.15)_0%,_transparent_60%)] pointer-events-none" />

          <div className="relative z-10 mx-auto">
            <HeadingOnDark
              as="h2"
              className="mb-5"
              style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
            >
              Ready to Enter Ghana<br />with Confidence?
            </HeadingOnDark>


            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2.5 bg-primary text-white font-heading font-semibold rounded-full px-8 py-4 hover:bg-golden-dark transition-all duration-200 shadow-[var(--shadow-primary)] hover:shadow-[0_8px_32px_rgba(252,136,62,0.45)] active:scale-[0.98] group"
                style={{ fontSize: "1rem" }}
              >
                Tell us your goals.
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <TextOnDark
              as="p"
              emphasis="muted"
              className="mt-10 italic text-white/35"
              style={{ fontSize: "0.875rem" }}
            >
              We’ll craft the experience around them together.
            </TextOnDark>
          </div>
        </div>
      </Container>
    </section>
  );
}
