import { ArrowRightIcon } from "@/components/icons";
import { FOUNDERS, LEARNING_PLATFORM_HREF } from "@/lib/landing-content";

export function CommunitySection() {
  return (
    <section className="l-section l-host reveal" id="community">
      <div className="l-section-head">
        <span className="eyebrow">TEAM & METHOD</span>
        <h2>主理人</h2>
        <p className="l-section-sub">连接 AI 产品资源、技术能力和真实业务场景</p>
      </div>
      <div className="l-host-card">
        <div className="l-host-founders" aria-label="社群主理人">
          {FOUNDERS.map((founder) => (
            <article
              className={`l-founder-profile is-${founder.tone}`}
              key={founder.name}
            >
              <img
                className="l-founder-photo"
                src={founder.photo}
                alt={founder.photoAlt}
              />
              <div className="l-founder-copy">
                <h3>{founder.name}</h3>
                <ul>
                  {founder.roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="l-host-body">
          <span className="eyebrow">HOW WE RUN</span>
          <h3>让 AI 真正干活</h3>
          <p className="l-host-lines">
            <span>嫁接技术、需求与场景。</span>
            <span>发现真需求、解决真问题以及真的解决问题。</span>
          </p>
          <div className="l-host-methods" aria-label="社群组织方式">
            <span>
              <strong>筛选</strong>可试用资源
            </span>
            <span>
              <strong>共学</strong>真实任务
            </span>
            <span>
              <strong>沉淀</strong>流程案例
            </span>
          </div>
        </div>
      </div>
      <div className="l-host-cta">
        <h3>加入 AgentWork，和一群人一起把 AI 用起来</h3>
        <p>
          进入学习平台后，可浏览公开课、了解会员权益，并按自己的节奏参与课程、活动和资源兑换。
        </p>
        <div className="lhero-cta">
          <a className="button-link" href={LEARNING_PLATFORM_HREF}>
            <span>进入学习平台</span>
            <ArrowRightIcon className="button-link-icon" />
          </a>
          <a className="button-link secondary" href="#membership-benefits">
            查看会员权益
          </a>
        </div>
      </div>
    </section>
  );
}
