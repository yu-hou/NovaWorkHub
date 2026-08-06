import {
  ChatIcon,
  CourseIcon,
  FolderIcon,
  LiveIcon,
  PinIcon,
  TrophyIcon,
} from "@/components/icons";
import { LOOP_STEPS, SUPPORT_ITEMS } from "@/lib/landing-content";

const loopIcons = {
  course: CourseIcon,
  live: LiveIcon,
  trophy: TrophyIcon,
} as const;

const supportIcons = {
  chat: ChatIcon,
  folder: FolderIcon,
  pin: PinIcon,
} as const;

export function ServicesSection() {
  return (
    <section className="l-section reveal" id="services">
      <div className="l-section-head">
        <span className="eyebrow">COMMUNITY CONTENT</span>
        <h2>社群主要内容</h2>
        <p className="l-section-sub">课程、共学、活动与资源</p>
      </div>
      <div className="l-community-showcase">
        <article className="l-community-path">
          <span className="l-community-kicker">LEARNING LOOP</span>
          <h3>从课程到作品，一条能持续推进的 AI 实战路径</h3>
          <p>
            把系统课程、直播共学和实战比赛串成主线：先补方法，再看拆解，最后交付可展示成果。
          </p>
          <div className="l-community-loop" aria-label="社群学习路径">
            {LOOP_STEPS.map((step) => {
              const Icon = loopIcons[step.icon];
              return (
                <article className="l-loop-step" key={step.index}>
                  <div className="l-loop-step-head">
                    <span className="l-step-index">{step.index}</span>
                    <span className="l-step-icon" aria-hidden="true">
                      <Icon />
                    </span>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </article>
        <div className="l-community-support" aria-label="社群支持权益">
          {SUPPORT_ITEMS.map((item) => {
            const Icon = supportIcons[item.icon];
            return (
              <article
                className={`l-support-item${item.featured ? " is-featured" : ""}`}
                key={item.title}
              >
                <span className="l-support-icon" aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <span className="l-support-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
