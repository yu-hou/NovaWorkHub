"use client";

import { useState } from "react";

import { CommunitySection } from "@/components/CommunitySection";
import { FeedbackSection } from "@/components/FeedbackSection";
import { HeroSection } from "@/components/HeroSection";
import { LandingBehaviors } from "@/components/LandingBehaviors";
import { LandingFooter } from "@/components/LandingFooter";
import { LandingNav } from "@/components/LandingNav";
import { MembershipSection } from "@/components/MembershipSection";
import { PartnersSection } from "@/components/PartnersSection";
import { PaymentModal } from "@/components/PaymentModal";
import { ServicesSection } from "@/components/ServicesSection";

export function LandingPage() {
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="landing-body min-h-full">
      <div className="bg-cosmos" aria-hidden="true" />
      <LandingNav />
      <main className="landing">
        <HeroSection onOpenPayment={() => setPaymentOpen(true)} />
        <ServicesSection />
        <FeedbackSection />
        <MembershipSection />
        <PartnersSection />
        <CommunitySection />
      </main>
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <LandingFooter />
      <LandingBehaviors />
    </div>
  );
}
