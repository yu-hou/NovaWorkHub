"use client";

import { ABOUT_CARDS } from "@/lib/platform-content";

export function AboutView() {
  return (
    <section className="view" id="pageAbout">
      <div className="about-grid">
        {ABOUT_CARDS.map((card) => (
          <article className="about-card" key={card.title}>
            {card.titleTag === "h1" ? <h1>{card.title}</h1> : <h3>{card.title}</h3>}
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
