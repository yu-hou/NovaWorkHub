"use client";

import { HomeBannerCarousel } from "@/components/home/HomeBannerCarousel";
import { HomeBenefitsGrid } from "@/components/home/HomeBenefitsGrid";
import { HomeLearningGrid } from "@/components/home/HomeLearningGrid";
import { PlatformShell } from "@/components/home/PlatformShell";

export function HomePlatform() {
  return (
    <PlatformShell>
      <section className="view" id="pageHome">
        <HomeBannerCarousel />
        <HomeLearningGrid />
        <HomeBenefitsGrid />
      </section>
    </PlatformShell>
  );
}
