import { ArrowRightIcon } from "@/components/icons";
import { LEARNING_PLATFORM_HREF, TICKER_TEXT } from "@/lib/landing-content";

type HeroSectionProps = {
  onOpenPayment: () => void;
};

export function HeroSection({ onOpenPayment }: HeroSectionProps) {
  return (
    <section className="lhero">
      <div className="lhero-glow" aria-hidden="true" />
      <div className="lhero-inner">
        <span className="eyebrow">Nova AI Agent 实战学习社群</span>
        <h1 className="lhero-title">
          跨过 AI 学习门槛，
          <br />
          用 Agent 真正<span className="prism-text">做出结果</span>。
        </h1>
        <p className="lhero-sub">
          系统课程、案例拆解、直播共学、实战项目与会员资源，陪你从学习走向真实应用。
        </p>
        <div className="lhero-cta">
          <a className="button-link" href={LEARNING_PLATFORM_HREF}>
            <span>免费学习公开课</span>
            <ArrowRightIcon className="button-link-icon" />
          </a>
          <a className="button-link secondary" href="#membership-benefits">
            查看会员权益
          </a>
        </div>
      </div>

      <div className="lhero-marquee" aria-hidden="true">
        <div className="lhero-marquee-track">
          <span className="marquee-sequence">
            NOVA<span className="marquee-sep">·</span>NOVA
            <span className="marquee-sep">·</span>
          </span>
          <span className="marquee-sequence">
            NOVA<span className="marquee-sep">·</span>NOVA
            <span className="marquee-sep">·</span>
          </span>
        </div>
      </div>
      <div className="ticker-mini" aria-hidden="true">
        <div className="ticker-mini-track">
          <span className="ticker-group">{TICKER_TEXT}</span>
          <span className="ticker-group">{TICKER_TEXT}</span>
        </div>
      </div>

      <div className="lhero-media" id="membership">
        <img
          className="membership-card-art"
          src="/images/nova/placeholder.svg"
          alt=""
          aria-hidden="true"
        />
        <div className="lhero-media-copy">
          <span className="eyebrow">ANNUAL ALL-ACCESS PASS</span>
          <h2>解锁 0-1 全套 AI 学习课程与场景落地案例库、会员专享福利</h2>
          <p>权益说明及解释权归 Nova 所有</p>
          <div className="landing-pass-actions">
            <button
              className="button-link landing-pay-button"
              type="button"
              onClick={onOpenPayment}
            >
              购买年度通票
            </button>
            <a
              className="button-link secondary landing-pass-secondary"
              href="#membership-benefits"
            >
              查看权益对比
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
