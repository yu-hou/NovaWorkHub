import { LEARNING_PLATFORM_HREF } from "@/lib/landing-content";

const FOOTER_LINKS = [
  { href: "#services", label: "社群内容" },
  { href: "#feedback", label: "用户反馈" },
  { href: "#membership-benefits", label: "会员权益" },
  { href: "#partners", label: "合作伙伴" },
  { href: "#community", label: "社群介绍" },
  { href: LEARNING_PLATFORM_HREF, label: "进入学习" },
] as const;

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-foot-brand">
          <span className="brand-mark" aria-hidden="true">
            <img src="/images/nova/logo-mark.svg" alt="" />
          </span>
          <div>
            <strong>
              <span className="brand-wordmark-text">Nova</span>
            </strong>
          </div>
        </div>
        <nav className="landing-foot-links" aria-label="页脚导航">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="landing-copy">© 2026 Nova</p>
    </footer>
  );
}
