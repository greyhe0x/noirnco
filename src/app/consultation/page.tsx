import type { Metadata } from "next";
import { ConsultationPage } from "@/components/consultation/ConsultationPage";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Tell us about your event or travel plans and we'll get back to you within 24 hours. Ghana's premier event and travel agency.",
};

export default function Consultation() {
  return <ConsultationPage />;
}
