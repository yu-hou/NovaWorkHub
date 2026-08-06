"use client";

import { HOME_BENEFITS } from "@/lib/home-content";

export function HomeBenefitsGrid() {
  return (
    <div className="section-row">
      <div className="section-title">
        <h3>会员福利</h3>
        <a className="text-button" href="/benefits">
          查看全部
        </a>
      </div>
      <div className="card-grid compact-grid" id="homeBenefitList">
        {HOME_BENEFITS.map((card) => (
          <article className="benefit-card" key={card.title}>
            <div className="card-cover">
              <img
                src={
                  card.title.includes("Mole")
                    ? "/images/zhenganhuo/home/benefit-2.png"
                    : card.title.includes("flomo")
                      ? "/images/zhenganhuo/home/benefit-3.jpg"
                      : "/images/zhenganhuo/home/benefit-1.png"
                }
                alt=""
              />
            </div>
            <div className="card-body">
              <div className="item-title benefit-title-row">
                <h3>{card.title}</h3>
                {card.category ? (
                  <div className="category-badges benefit-category-badges">
                    <span
                      className={`category-badge category-${card.categoryTone ?? "rose"} small`}
                    >
                      {card.category}
                    </span>
                  </div>
                ) : null}
              </div>
              <p className="summary benefit-summary">{card.summary}</p>
              <div className="benefit-commerce">
                <div className="benefit-buy-line">
                  <span className={`benefit-price${card.free ? " is-free" : ""}`}>
                    <strong>{card.priceLabel}</strong>
                    {card.priceUnit ? <small>{card.priceUnit}</small> : null}
                  </span>
                  <span className="benefit-stock">{card.stock}</span>
                </div>
              </div>
              <div className="actions benefit-actions">
                <span className="sub benefit-claim-note" />
                <div className="benefit-button-group">
                  <a
                    className="benefit-instructions-link"
                    href={card.instructionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    兑换说明
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      window.alert("演示环境：领取福利需登录。");
                    }}
                  >
                    登录后领取
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
