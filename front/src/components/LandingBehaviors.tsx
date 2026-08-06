"use client";

import { useEffect } from "react";

export function LandingBehaviors() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      revealEls.forEach((el) => io?.observe(el));
    }

    const wrap = document.querySelector(".ticker-mini");
    const track = document.querySelector(".ticker-mini-track");
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuildTicker, 160);
    };

    function rebuildTicker() {
      if (!(wrap instanceof HTMLElement) || !(track instanceof HTMLElement)) return;
      const seed = track.querySelector(".ticker-group");
      if (!(seed instanceof HTMLElement)) return;
      const baseText = seed.textContent || "";
      if (!baseText.trim()) return;

      const sequence = document.createElement("span");
      sequence.className = "ticker-group";
      sequence.textContent = baseText;
      track.innerHTML = "";
      track.appendChild(sequence);

      const targetWidth = wrap.clientWidth + 120;
      let guard = 0;
      while (sequence.scrollWidth < targetWidth && guard < 24) {
        sequence.textContent += baseText;
        guard += 1;
      }

      const clone = sequence.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
      track.style.setProperty("--ticker-start", `-${sequence.scrollWidth}px`);
      track.style.animation = "none";
      void track.offsetWidth;
      track.style.animation = "";
    }

    rebuildTicker();
    if (document.fonts?.ready) {
      document.fonts.ready.then(rebuildTicker).catch(() => undefined);
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      io?.disconnect();
    };
  }, []);

  return null;
}
