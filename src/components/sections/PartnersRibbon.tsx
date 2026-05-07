"use client";

import React from "react";
import Image from "next/image";
import { Container, TextOnLight } from "@/components/ui";

/* ─── Data ────────────────────────────────────────────────────────────────── */
/*
 * Add matching logo files to /public/images/ when ready:
 *   partner-pelican.png · partner-coco-eat.png · partner-livingroom.png
 *   partner-giftdude.png · partner-805.png
 *   client-ucl.png · client-halcyon.png · client-unicef.png
 */
const PARTNERS = [
  { name: "Pelican Hotel",              logo: "/images/partner-pelican.png"     },
  { name: "Coco Eat",                   logo: "/images/partner-coco-eat.png"    },
  { name: "Livingroom Restaurant",      logo: "/images/partner-livingroom.png"  },
  { name: "The GiftDude",              logo: "/images/partner-giftdude.png"    },
  { name: "805 Restaurant",             logo: "/images/partner-805.png"         },
] as const;

const CLIENTS = [
  { name: "University College London",  logo: "/images/client-ucl.png"         },
  { name: "Halcyon",                    logo: "/images/client-halcyon.png"      },
  { name: "UNICEF",                     logo: "/images/client-unicef.png"       },
] as const;

/* ─── Single logo chip ────────────────────────────────────────────────────── */
function LogoChip({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center mx-6 sm:mx-8 h-10 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-default select-none">
      {/* When the image exists it shows; next/image with unoptimized+onError fallback to text */}
      <LogoImage name={name} logo={logo} />
    </div>
  );
}

/* ─── Image with graceful text fallback ───────────────────────────────────── */
function LogoImage({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <span
        className="font-heading font-semibold text-secondary whitespace-nowrap"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.9375rem)", letterSpacing: "-0.01em" }}
      >
        {name}
      </span>
    );
  }

  return (
    <Image
      src={logo}
      alt={name}
      width={120}
      height={40}
      className="h-8 w-auto object-contain"
      onError={() => setFailed(true)}
    />
  );
}

/* ─── Marquee strip ───────────────────────────────────────────────────────── */
/*
 * Repeat logic: each copy must be wide enough that half the total track
 * width (the -50% translateX point) exceeds the widest desktop (~2560px).
 * Partners: 5 items × ~200px ≈ 1000px/copy → 6 copies → -50% = -3000px ✓
 * Clients:  3 items × ~200px ≈  600px/copy → 10 copies → -50% = -3000px ✓
 */
function LogoStrip({
  items,
  copies = 6,
  direction = "left",
}: {
  items: readonly { name: string; logo: string }[];
  copies?: number;
  direction?: "left" | "right";
}) {
  const repeated = Array.from({ length: copies }, () => [...items]).flat();
  return (
    <div className="overflow-hidden w-full">
      <div className={`${direction === "left" ? "marquee-track-left" : "marquee-track-right"} flex items-center`}>
        {repeated.map((item, i) => (
          <React.Fragment key={`${item.name}-${i}`}>
            <LogoChip name={item.name} logo={item.logo} />
            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-gray-300 opacity-60" aria-hidden="true" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function PartnersRibbon() {
  return (
    <section className="py-12 md:py-16 bg-surface-muted border-y border-gray-100 relative overflow-hidden">

      <Container>
        {/* Two-column label row */}
        <div className="flex items-center justify-center gap-10 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-px bg-primary/40" />
            <TextOnLight
              as="span"
              emphasis="muted"
              weight="medium"
              className="uppercase tracking-widest"
              style={{ fontSize: "0.6875rem" }}
            >
              Partners
            </TextOnLight>
          </div>
          <div className="w-px h-4 bg-gray-200" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <TextOnLight
              as="span"
              emphasis="muted"
              weight="medium"
              className="uppercase tracking-widest"
              style={{ fontSize: "0.6875rem" }}
            >
              Clients
            </TextOnLight>
            <div className="w-5 h-px bg-primary/40" />
          </div>
        </div>
      </Container>

      {/* Partners strip  6 copies so half-track > 2560px */}
      <div className="mb-5">
        <LogoStrip items={PARTNERS} copies={6} direction="left" />
      </div>

      {/* Clients strip  10 copies (fewer items, need more repeats) */}
      <LogoStrip items={CLIENTS} copies={10} direction="right" />

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-muted to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-muted to-transparent z-10" />

    </section>
  );
}
