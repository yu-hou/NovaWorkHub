"use client";

import { useMemo, useState, type CSSProperties } from "react";

import { TOKEN_RANK } from "@/lib/platform-content";

const TOOL_FILTERS = [
  { value: "all", label: "总榜" },
  { value: "codex", label: "Codex" },
  { value: "claude", label: "Claude Code" },
  { value: "workbuddy", label: "WorkBuddy" },
  { value: "zcode", label: "Z Code", extra: true },
  { value: "hermes", label: "Hermes", extra: true },
  { value: "cursor", label: "Cursor", extra: true },
] as const;

const TIME_FILTERS = [
  { value: "today", label: "今天" },
  { value: "yesterday", label: "昨天" },
  { value: "before_yesterday", label: "前天" },
  { value: "3d", label: "近 3 天" },
  { value: "7d", label: "近 7 天" },
  { value: "30d", label: "近 30 天" },
] as const;

const TASK_FILTERS = [
  { value: "all", label: "全部" },
  { value: "personal_interactive", label: "即时协作" },
  { value: "guided_agent", label: "指令执行" },
  { value: "long_running_agent", label: "长程任务" },
  { value: "scheduled_automation", label: "自动任务" },
] as const;

export function TokenRankView() {
  const [tool, setTool] = useState("all");
  const [time, setTime] = useState("today");
  const [task, setTask] = useState("all");
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  const toolLabel =
    TOOL_FILTERS.find((f) => f.value === tool)?.label ?? "总榜";
  const timeLabel =
    TIME_FILTERS.find((f) => f.value === time)?.label ?? "今天";
  const taskLabel =
    TASK_FILTERS.find((f) => f.value === task)?.label ?? "全部";

  const summaryLabel = useMemo(() => {
    return `今天全员累计消耗 · ${tool === "all" ? "全部" : toolLabel}`;
  }, [tool, toolLabel]);

  const rows = TOKEN_RANK.rows;

  return (
    <section
      className="token-rank-page"
      id="tokenRankPage"
      data-token-rank-page="board"
    >
      <div className="token-rank-hero">
        <h1 className="token-rank-title">
          <img src="/images/zhenganhuo/logo1.png" alt="" aria-hidden="true" />
          <span>Token 排行榜</span>
        </h1>
        <div className="token-rank-actions">
          <button
            id="tokenRankHowBtn"
            className="secondary"
            type="button"
            onClick={() => setHowOpen(true)}
          >
            Token监控接入
          </button>
          <a
            className="button-link"
            href="https://www.zhenganhuo.com/token-rank/me"
            target="_blank"
            rel="noopener noreferrer"
          >
            我的消耗
          </a>
        </div>
        <p className="sub">
          监控日常 Agent 算力消耗，每 30 分钟更新一次。当数据同步出现问题时，重新生成接入指令并安装即可。
        </p>
      </div>

      <div className="token-rank-mobile-filter-bar" aria-label="移动端排行榜筛选">
        <button
          type="button"
          aria-expanded={filterOpen}
          aria-controls="tokenRankBoardFilters"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <span>
            {timeLabel} · {toolLabel} · {taskLabel}
          </span>
          <strong>筛选</strong>
        </button>
      </div>

      <div className="token-rank-layout token-rank-board-layout">
        <section className="token-rank-board" id="tokenRankBoard">
          <div
            className={`token-rank-filter-panel${filterOpen ? " is-open" : ""}`}
            id="tokenRankBoardFilters"
            aria-label="排行榜筛选"
          >
            <div className="token-rank-filter-group token-rank-filter-group-tools">
              <span>工具</span>
              <nav
                className={`token-rank-chips token-rank-tool-chips${
                  toolsExpanded ? " is-expanded" : ""
                }`}
                aria-label="工具筛选"
              >
                {TOOL_FILTERS.filter((f) => !("extra" in f && f.extra)).map(
                  (f) => (
                    <button
                      key={f.value}
                      className={`token-rank-chip${tool === f.value ? " active" : ""}`}
                      type="button"
                      onClick={() => setTool(f.value)}
                    >
                      {f.label}
                    </button>
                  ),
                )}
                <button
                  className="token-rank-chip token-rank-tool-more-toggle"
                  type="button"
                  aria-expanded={toolsExpanded}
                  title="展开更多工具"
                  onClick={() => setToolsExpanded((v) => !v)}
                >
                  ...
                </button>
                {TOOL_FILTERS.filter((f) => "extra" in f && f.extra).map((f) => (
                  <button
                    key={f.value}
                    className={`token-rank-chip token-rank-tool-extra${
                      tool === f.value ? " active" : ""
                    }`}
                    type="button"
                    onClick={() => setTool(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="token-rank-filter-group token-rank-filter-group-time">
              <span>时间</span>
              <nav className="token-rank-chips" aria-label="时间筛选">
                {TIME_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    className={`token-rank-chip${time === f.value ? " active" : ""}`}
                    type="button"
                    onClick={() => setTime(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="token-rank-filter-group token-rank-filter-group-wide">
              <span className="token-rank-filter-label">任务</span>
              <nav className="token-rank-chips" aria-label="任务筛选">
                {TASK_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    className={`token-rank-chip${task === f.value ? " active" : ""}`}
                    type="button"
                    onClick={() => setTask(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="token-rank-summary">
            <span id="tokenRankSummaryLabel">{summaryLabel}</span>
            <strong id="tokenRankSummaryTokens">{TOKEN_RANK.totalTokens}</strong>
            <span className="sub">tokens</span>
            <span
              className="token-rank-summary-users"
              id="tokenRankSummaryUsers"
            >
              {TOKEN_RANK.participants}
            </span>
          </div>

          <div className="token-rank-list" id="tokenRankList">
            {rows.map((row) => (
              <article className="token-rank-row" key={row.rank + row.name}>
                <div className="token-rank-rank">
                  <span className="token-rank-medal">{row.rank}</span>
                </div>
                <button
                  className="token-rank-avatar"
                  type="button"
                  aria-label={`查看 ${row.name} 的消耗`}
                  onClick={() => {
                    window.alert(`演示环境：${row.name} 的消耗详情需登录后查看。`);
                  }}
                >
                  <span className="token-rank-avatar-media">
                    {row.avatar ? (
                      <img src={row.avatar} alt="" />
                    ) : (
                      <span className="token-rank-avatar-initial">
                        {row.avatarInitial ?? row.name.slice(0, 1)}
                      </span>
                    )}
                  </span>
                  {row.isMember ? (
                    <span
                      className="token-rank-avatar-member-badge"
                      title="有效会员"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="m3.5 7.5 4.7 4.2L12 5l3.8 6.7 4.7-4.2-1.8 11H5.3z" />
                        <path d="M5.8 18.5h12.4" />
                      </svg>
                    </span>
                  ) : null}
                </button>
                <div className="token-rank-user">
                  <strong>{row.name}</strong>
                  <div className="token-rank-user-meta">
                    <span
                      className="token-rank-breakdown-badges"
                      aria-label="工具消耗明细"
                    >
                      {row.tools.map((t) => (
                        <span
                          key={t.tool}
                          className="token-rank-breakdown-badge"
                          style={
                            {
                              ["--token-rank-client-color"]: t.color,
                            } as CSSProperties
                          }
                          title={`${t.tool}：${t.tokens} tokens`}
                        >
                          <span
                            className="token-rank-breakdown-dot"
                            aria-hidden="true"
                          />
                          <span className="token-rank-breakdown-name">
                            {t.tool}
                          </span>
                          <strong>{t.tokens}</strong>
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
                <div className="token-rank-score">
                  <strong>{row.tokens}</strong>
                  <span>tokens</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {howOpen ? (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setHowOpen(false);
          }}
        >
          <div className="modal-box">
            <div className="section-title">
              <div>
                <h3>Token 监控接入</h3>
              </div>
              <button
                className="modal-close-icon"
                type="button"
                aria-label="关闭弹窗"
                onClick={() => setHowOpen(false)}
              >
                <svg
                  className="modal-close-svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div>
              <p>
                演示环境不提供真实接入指令。请前往原站登录后生成安装提示词。
              </p>
              <a
                className="button-link"
                href="https://www.zhenganhuo.com/token-rank"
                target="_blank"
                rel="noopener noreferrer"
              >
                打开原站 Token Rank
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
