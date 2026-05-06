import React from "react";
import { Container } from "@/components/ui";
import { HeroContent } from "./HeroContent";
import { HeroVisual } from "./HeroVisual";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-background overflow-hidden flex items-center"
    >
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-screen lg:min-h-0 lg:py-16">
          <HeroContent />
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
