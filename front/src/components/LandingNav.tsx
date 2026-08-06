"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { LEARNING_PLATFORM_HREF } from "@/lib/landing-content";

const NAV_LINKS = [
  { href: "#services", label: "社群内容" },
  { href: "#feedback", label: "用户反馈" },
  { href: "#membership-benefits", label: "会员权益" },
  { href: "#partners", label: "合作伙伴" },
  { href: "#community", label: "主理人" },
] as const;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", () => setTimeout(onScroll, 0));
    const onAnchorClick = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      if (link.getAttribute("href") !== "#") setScrolled(true);
    };
    const anchors = [...document.querySelectorAll('a[href^="#"]')];
    anchors.forEach((link) => link.addEventListener("click", onAnchorClick));
    return () => {
      window.removeEventListener("scroll", onScroll);
      anchors.forEach((link) =>
        link.removeEventListener("click", onAnchorClick),
      );
    };
  }, []);

  return (
    <header
      className={`landing-nav${scrolled ? " scrolled" : ""}`}
      id="landingNav"
      style={
        scrolled
          ? {
              WebkitBackdropFilter: "saturate(160%) blur(18px)",
              backdropFilter: "saturate(160%) blur(18px)",
            }
          : undefined
      }
    >
      <div className="landing-nav-inner">
        <Link className="landing-logo" href="/">
          <span className="brand-mark" aria-hidden="true">
            <img src="/images/nova/logo-mark.svg" alt="" />
          </span>
          <span className="brand-wordmark-text">Nova</span>
        </Link>
        <nav className="landing-links" aria-label="官网导航">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="landing-nav-cta">
          <ThemeToggle />
          <a className="button-link" href={LEARNING_PLATFORM_HREF}>
            进入学习平台
          </a>
        </div>
      </div>
    </header>
  );
}
