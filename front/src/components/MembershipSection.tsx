import { CrownIcon } from "@/components/icons";
import { BENEFIT_ROWS } from "@/lib/landing-content";

export function MembershipSection() {
  return (
    <section className="l-section reveal" id="membership-benefits">
      <div className="l-section-head">
        <span className="eyebrow">MEMBERSHIP</span>
        <h2>会员权益对比</h2>
        <p className="l-section-sub">公开学习免费开放，年度会员解锁更多权益</p>
      </div>
      <div className="l-membership-layout">
        <div className="l-benefit-table-wrap">
          <table className="l-benefit-table">
            <thead>
              <tr>
                <th>权益</th>
                <th>免费会员</th>
                <th>
                  <span className="benefit-plan-label is-annual">
                    <CrownIcon />
                    年度会员
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {BENEFIT_ROWS.map((row) =>
                row.kind === "group" ? (
                  <tr className="benefit-group-row" key={`g-${row.label}`}>
                    <th scope="row">{row.label}</th>
                    <td aria-hidden="true" />
                    <td aria-hidden="true" />
                  </tr>
                ) : (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>
                      <span className="benefit-note">{row.free}</span>
                    </td>
                    <td>
                      <span className="benefit-note">{row.annual}</span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <aside className="l-membership-qr">
          <span className="eyebrow">ANNUAL PASS</span>
          <h3>扫码购买年度通票</h3>
          <div className="membership-poster-frame">
            <img
              className="membership-poster-image"
              src="/images/zhenganhuo/annual-pass-poster.jpg"
              alt="Agent 实战社群年度通票海报"
            />
          </div>
          <p>
            付款后联系社群管理员开通会员权限。也可以先进入学习平台浏览公开内容。
          </p>
        </aside>
      </div>
    </section>
  );
}
