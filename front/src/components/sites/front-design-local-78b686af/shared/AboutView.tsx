import { ABOUT_CARDS } from "@/lib/platform-content";

export default function AboutView() {
  return (
    <section className="view" id="pageAbout">
      <div className="page-head">
        <h2>关于 AgentWork</h2>
        <p>让 AI 真正干活，也让学习、实践和交付沉淀在同一个工作台。</p>
      </div>
      <div className="front-about-grid">
        {ABOUT_CARDS.map((card, index) => (
          <article className="front-about-card rise-in" key={card.title}>
            <span className="front-about-index">0{index + 1}</span>
            <h3>{card.title.replace("Nova", "AgentWork")}</h3>
            <p>{card.body.replaceAll("Nova", "AgentWork")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
