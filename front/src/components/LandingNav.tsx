"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

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

  useEffect(() => {
    if (!menuOpen) return;
    document.body.classList.add("landing-menu-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("landing-menu-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`landing-nav${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}
      id="landingNav"
      style={
        scrolled || menuOpen
          ? {
              WebkitBackdropFilter: "saturate(160%) blur(18px)",
              backdropFilter: "saturate(160%) blur(18px)",
            }
          : undefined
      }
    >
      <div className="landing-nav-inner">
        <Link className="landing-logo" href="/" onClick={() => setMenuOpen(false)}>
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
          <button
            type="button"
            className="landing-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="landing-mobile-menu" id={menuId}>
          <nav aria-label="官网移动导航">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="button-link landing-mobile-cta"
            href={LEARNING_PLATFORM_HREF}
            onClick={() => setMenuOpen(false)}
          >
            进入学习平台
          </a>
        </div>
      ) : null}
    </header>
  );
}
