export function HomeDashboard() {
  return (
    <section className="view" id="pageHome">
      <div className="home-hero">
        <div className="home-carousel" id="homeCarousel">
          <div className="home-banner-stage" id="bannerStage"></div>
          <div className="home-banner-rail" id="bannerRail"></div>
        </div>
        <div className="system-panel">
          <div className="system-panel-head">
            <div className="system-panel-title-line">
              <div>
                <h4>本周动态</h4>
                <p>按热度排序的社群活跃信号</p>
              </div>
              <span className="system-panel-total">
                03 <small>条</small>
              </span>
            </div>
          </div>
          <div className="system-rows" id="statusFeed"></div>
          <div className="system-panel-foot">
            <a className="link-arrow" href="#">
              查看全部动态
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="section-row">
        <div className="section-title">
          <div>
            <h3>最新学习内容</h3>
            <span className="sub">课程、案例与直播的统一时间线</span>
          </div>
          <a className="link-arrow" href="/benefits">
            查看全部
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6"></path>
            </svg>
          </a>
        </div>
        <div className="content-layout">
          <div id="featuredSlot"></div>
          <div className="row-list" id="rowList"></div>
        </div>
      </div>

      <div className="section-row">
        <div className="section-title">
          <div>
            <h3>会员福利</h3>
            <span className="sub">登录后领取，票券式核销</span>
          </div>
          <a className="link-arrow" href="#">
            查看全部
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6"></path>
            </svg>
          </a>
        </div>
        <div className="voucher-grid" id="voucherList"></div>
      </div>
    </section>
  );
}
