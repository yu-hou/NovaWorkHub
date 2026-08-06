import { FEEDBACK_ITEMS } from "@/lib/landing-content";

export function FeedbackSection() {
  return (
    <section className="l-section reveal" id="feedback">
      <div className="l-section-head">
        <span className="eyebrow">MEMBER FEEDBACK</span>
        <h2>用户反馈</h2>
        <p className="l-section-sub">真实使用后的变化</p>
      </div>
      <div className="l-feedback-panel">
        <div className="l-feedback-grid">
          {FEEDBACK_ITEMS.map((item) => (
            <article className="l-feedback-shot" key={item.author}>
              <div className="feedback-window-head">
                <span />
                <span />
                <span />
              </div>
              <div className="feedback-chat">
                <p>{item.quote}</p>
                <small>{item.author}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
