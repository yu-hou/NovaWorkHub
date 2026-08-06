"use client";

import { HomeBannerCarousel } from "@/components/home/HomeBannerCarousel";
import { HomeBenefitsGrid } from "@/components/home/HomeBenefitsGrid";
import { HomeRecommendedCourses } from "@/components/home/HomeRecommendedCourses";
import { PlatformShell } from "@/components/home/PlatformShell";

export function HomePlatform() {
  return (
    <PlatformShell>
      <section className="view" id="pageHome">
        <HomeBannerCarousel />
        <HomeRecommendedCourses />
        <HomeBenefitsGrid />
      </section>
    </PlatformShell>
  );
}
