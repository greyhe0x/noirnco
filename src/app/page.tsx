import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroEventsSection } from "@/components/sections/HeroEventsSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroEventsSection />
        <StatsSection />
        <ServicesSection />
        <QuoteSection />
        <TestimonialsSection />
        <AboutSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
