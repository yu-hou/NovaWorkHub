import { PARTNERS } from "@/lib/landing-content";

export function PartnersSection() {
  return (
    <section
      className="l-section l-partner-strip reveal"
      id="partners"
      aria-label="合作伙伴"
    >
      <div className="l-section-head">
        <span className="eyebrow">PARTNERS</span>
        <h2>合作伙伴</h2>
        <p className="l-section-sub">感谢合作伙伴对社群的支持</p>
      </div>
      <div className="l-partner-wall" aria-label="合作伙伴 logo 墙">
        {PARTNERS.map((partner) => (
          <span className="l-partner-logo-placeholder" key={partner.name}>
            <img src={partner.logo} alt={partner.name} />
          </span>
        ))}
      </div>
    </section>
  );
}
