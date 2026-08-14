"use client";

import { Copy, KeyRound, LoaderCircle, MonitorCog, RotateCcw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";

type Range = "today" | "week" | "month";
type InstallOs = "mac" | "windows";

type RankRow = {
  rank: number;
  user_id: string;
  handle: string;
  city: string;
  total_tokens: number;
  fresh_tokens: number;
  by_tool: Record<string, number> | null;
};

type Overview = {
  range: Range;
  member: { handle: string; city: string; join_board: boolean; is_public: boolean } | null;
  devices: { id: string; label: string; created_at: string; last_seen_at: string | null; revoked_at: string | null }[];
  leaderboard: RankRow[];
  summary: { participants: number; total_tokens: number; own_tokens: number; own_rank: number | null };
  suggested_handle: string;
};

type InstallCredential = { install_token: string; expires_at: string };

function formatTokens(value: number) {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(value >= 1_000_000_000 ? 1 : 2)}亿`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(value >= 1_000_000 ? 1 : 2)}万`;
  return new Intl.NumberFormat("zh-CN").format(Math.round(value));
}

function formatTime(value: string | null) {
  if (!value) return "尚未同步";
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatExpiry(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function rankBadge(rank: number) {
  return rank <= 3 ? `top-${rank}` : "";
}

async function tokenRankCall<T>(body: Record<string, unknown>) {
  const supabase = getSupabase();
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) throw new Error("请先登录后使用 Token Rank");
  const { data, error } = await supabase.functions.invoke("token-rank", {
    body,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (error) {
    const context = "context" in error ? error.context : null;
    if (context instanceof Response) {
      const response = await context.json().catch(() => null) as { detail?: string } | null;
      throw new Error(response?.detail || error.message);
    }
    throw new Error(error.message || "Token Rank 请求失败");
  }
  return data as T;
}

export default function TokenRankView() {
  const { loading: authLoading, isLoggedIn } = useAuth();
  const [range, setRange] = useState<Range>("week");
  const [toolFilter, setToolFilter] = useState("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [city, setCity] = useState("");
  const [joining, setJoining] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credential, setCredential] = useState<InstallCredential | null>(null);
  const [installOs, setInstallOs] = useState<InstallOs>("mac");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (nextRange = range) => {
    if (!isLoggedIn) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const next = await tokenRankCall<Overview>({ action: "overview", range: nextRange });
      setData(next);
      setHandle(next.member?.handle || next.suggested_handle || "");
      setCity(next.member?.city || "");
      setJoining(next.member?.join_board ?? true);
      setIsPublic(next.member?.is_public ?? true);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "排行榜加载失败");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, range]);

  useEffect(() => {
    if (authLoading) return;
    void load(range);
  }, [authLoading, load, range]);

  const tools = useMemo(() => {
    const totals = new Map<string, number>();
    for (const entry of data?.leaderboard ?? []) {
      for (const [tool, value] of Object.entries(entry.by_tool ?? {})) {
        totals.set(tool, (totals.get(tool) ?? 0) + Number(value));
      }
    }
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [data?.leaderboard]);

  const visibleLeaderboard = useMemo(() => (data?.leaderboard ?? []).map((entry) => {
    const byTool = entry.by_tool ?? {};
    const total = toolFilter === "all" ? entry.total_tokens : Number(byTool[toolFilter] ?? 0);
    return { ...entry, total_tokens: total, by_tool: toolFilter === "all" ? byTool : { [toolFilter]: total } };
  }).filter((entry) => entry.total_tokens > 0 && (!onlyMine || entry.handle === data?.member?.handle)), [data, onlyMine, toolFilter]);

  const filteredTokens = useMemo(() => visibleLeaderboard.reduce((sum, entry) => sum + entry.total_tokens, 0), [visibleLeaderboard]);

  const installCommand = credential
    ? installOs === "mac"
      ? `curl -fsSL https://nova-academy-8fk.pages.dev/install.sh | sh -s -- '${credential.install_token}'`
      : `$env:NWH_TOKEN_RANK_INSTALL_TOKEN='${credential.install_token}'; irm https://nova-academy-8fk.pages.dev/install.ps1 | iex`
    : "";

  const aiPrompt = credential
    ? `帮我在当前电脑执行上面的命令。命令会自动下载 Token Rank、绑定当前网站账号并同步近 30 天数据，不需要额外授权操作。\n请持续观察终端输出；看到 Token Rank setup complete、Cloud sync ok、Background sync installed 和 Done 后，告诉我已经完成关联，数据也已经推送。\n完成后提醒我打开 https://nova-academy-8fk.pages.dev/token-rank/ 查看自己的 Token 消耗，并建议收藏这个网址。后续每 30 分钟会自动同步一次。\n这条安装令牌有效期到：${credential.expires_at}\n\n${installCommand}`
    : "";

  const saveSettings = async () => {
    setSaving(true);
    try {
      await tokenRankCall({ action: "save-settings", handle, city, join_board: joining, is_public: isPublic });
      setSettingsOpen(false);
      await createDevice();
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const createDevice = async () => {
    setSaving(true);
    try {
      const next = await tokenRankCall<InstallCredential>({ action: "issue-install-token" });
      if (!next?.install_token || !next?.expires_at) {
        throw new Error("接入服务正在更新，请稍后重试");
      }
      setCredential(next);
      setNotice("");
      await load();
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "生成接入凭证失败");
    } finally {
      setSaving(false);
    }
  };

  const revokeDevice = async (deviceId: string) => {
    if (!window.confirm("撤销后，这台设备将无法继续上传用量。确定撤销吗？")) return;
    try {
      await tokenRankCall({ action: "revoke-device", device_id: deviceId });
      setNotice("设备密钥已撤销");
      await load();
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "撤销设备失败");
    }
  };

  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(message);
    } catch {
      setNotice("复制失败，请手动复制");
    }
  };

  if (authLoading || loading) {
    return <section className="view nwh-token-rank-view"><div className="token-rank-state"><LoaderCircle aria-hidden="true" />正在加载 Token Rank…</div></section>;
  }

  if (!isLoggedIn) {
    return (
      <section className="view nwh-token-rank-view">
        <div className="token-rank-hero-card token-rank-login-card">
          <span className="token-rank-eyebrow">TOKEN RANK</span>
          <h1>把本机 AI 用量变成可见的进度</h1>
          <p>登录后可查看社群排行、接入自己的电脑，并选择是否公开参与排名。</p>
          <a className="btn-primary" href="/login?next=%2Ftoken-rank">登录后接入</a>
        </div>
      </section>
    );
  }

  return (
    <section className="view nwh-token-rank-view">
      <div className="token-rank-control-card">
        <div className="token-rank-control-title"><span className="token-rank-eyebrow">TOKEN RANK</span><strong>查看本机 AI 使用进度</strong><small>只展示按日期、工具和模型汇总的 Token 数字。</small></div>
        <div className="token-rank-control-group"><span>统计周期</span><div className="token-rank-range" aria-label="统计周期">
          {([ ["today", "今天"], ["week", "近 7 天"], ["month", "近 30 天"] ] as const).map(([value, label]) => (
            <button key={value} type="button" className={range === value ? "active" : ""} onClick={() => setRange(value)}>{label}</button>
          ))}
        </div></div>
        <div className="token-rank-control-group token-rank-tool-filter"><span>工具筛选</span><div className="token-rank-filter-buttons"><button type="button" className={toolFilter === "all" ? "active" : ""} onClick={() => setToolFilter("all")}>全部</button>{tools.map(([tool]) => <button key={tool} type="button" className={toolFilter === tool ? "active" : ""} onClick={() => setToolFilter(tool)}>{tool}</button>)}</div></div>
        <div className="token-rank-hero-actions">
          <button className={`btn-outline token-rank-mine-toggle${onlyMine ? " active" : ""}`} type="button" onClick={() => setOnlyMine((value) => !value)}>仅看我的数据</button>
          <button className="btn-outline" type="button" onClick={() => setSettingsOpen(true)}>排行榜设置</button>
          <button className="btn-primary" type="button" onClick={() => { if (data?.member) void createDevice(); else setSettingsOpen(true); }}>
            <MonitorCog aria-hidden="true" />生成当前接入命令
          </button>
        </div>
      </div>

      {notice ? <div className="token-rank-notice" role="status">{notice}</div> : null}
      {error ? <div className="token-rank-notice is-error" role="alert">{error}<button type="button" onClick={() => void load()}><RotateCcw aria-hidden="true" />重试</button></div> : null}

      <div className="token-rank-metric-grid">
        <article><span>{toolFilter === "all" ? "社群累计" : `${toolFilter} 累计`}</span><strong>{formatTokens(filteredTokens)}</strong><small>{range === "today" ? "今天" : range === "month" ? "近 30 天" : "近 7 天"}筛选结果</small></article>
        <article><span>参与人数</span><strong>{visibleLeaderboard.length}</strong><small>{onlyMine ? "当前仅查看自己" : "已公开并参与排行"}</small></article>
        <article><span>我的用量</span><strong>{formatTokens(data?.summary.own_tokens ?? 0)}</strong><small>{data?.summary.own_rank ? `当前第 ${data.summary.own_rank} 名` : "接入后自动统计"}</small></article>
      </div>

      <div className="token-rank-layout">
        <section className="token-rank-board-card">
          <div className="token-rank-section-heading">
            <div><h2>排行榜</h2><p>总量 = 输入 + 输出 + 缓存读取 + 缓存写入</p></div>
            <span className="token-rank-filter-caption">{toolFilter === "all" ? "全部工具" : toolFilter}{onlyMine ? " · 仅看我" : ""}</span>
          </div>
          <div className="token-rank-list" aria-live="polite">
            {visibleLeaderboard.map((entry, index) => (
              <article className="token-rank-entry" key={entry.user_id}>
                <span className={`token-rank-place ${rankBadge(index + 1)}`}>{index + 1}</span>
                <span className="token-rank-avatar">{entry.handle.slice(0, 1).toUpperCase()}</span>
                <div className="token-rank-entry-user"><strong>{entry.handle}</strong><small>{entry.city || "Nova 社群成员"}</small></div>
                <div className="token-rank-entry-tools">{Object.entries(entry.by_tool ?? {}).slice(0, 2).map(([tool, value]) => <span key={tool}>{tool} {formatTokens(Number(value))}</span>)}</div>
                <strong className="token-rank-entry-score">{formatTokens(entry.total_tokens)}</strong>
              </article>
            ))}
            {!visibleLeaderboard.length ? <div className="token-rank-empty"><KeyRound aria-hidden="true" /><strong>{data?.leaderboard.length ? "当前筛选没有结果" : "排行榜等待第一位参与者"}</strong><p>{data?.leaderboard.length ? "换一个工具或关闭“仅看我的数据”试试。" : "保存昵称并接入电脑后，首次同步即可上榜。"}</p></div> : null}
          </div>
        </section>

        <aside className="token-rank-side-card">
          <div className="token-rank-section-heading"><div><h2>接入状态</h2><p>你的设备与同步情况</p></div></div>
          {data?.devices.length ? data.devices.filter((device) => !device.revoked_at).map((device) => (
            <div className="token-rank-device" key={device.id}><MonitorCog aria-hidden="true" /><div><strong>{device.label}</strong><small>最近同步：{formatTime(device.last_seen_at)}</small></div><button type="button" onClick={() => void revokeDevice(device.id)}>撤销</button></div>
          )) : <div className="token-rank-device-empty">尚未接入设备</div>}
          <div className="token-rank-tool-summary"><span>当前活跃工具</span>{tools.length ? tools.map(([tool, count]) => <div key={tool}><b>{tool}</b><small>{formatTokens(count)}</small></div>) : <p>接入并同步后显示工具分布。</p>}</div>
          <div className="token-rank-privacy"><ShieldCheck aria-hidden="true" /><p>客户端只上传汇总 Token 数字；可随时关闭公开参与或撤销设备密钥。</p></div>
        </aside>
      </div>

      {settingsOpen ? <div className="token-rank-dialog-backdrop" role="presentation"><section className="token-rank-dialog" role="dialog" aria-modal="true" aria-labelledby="tokenRankSettingsTitle">
        <div className="token-rank-dialog-head"><div><h2 id="tokenRankSettingsTitle">接入 Token Rank</h2><p>先确认公开昵称和参与方式，再生成本机接入凭证。</p></div><button type="button" className="token-rank-close" onClick={() => setSettingsOpen(false)} aria-label="关闭">×</button></div>
        <label>排行榜昵称<input value={handle} maxLength={40} onChange={(event) => setHandle(event.target.value)} placeholder="例如：Nova 小王" /></label>
        <label>所在城市（可选）<input value={city} maxLength={80} onChange={(event) => setCity(event.target.value)} placeholder="例如：上海" /></label>
        <label className="token-rank-check"><input type="checkbox" checked={joining} onChange={(event) => setJoining(event.target.checked)} />参与公开排行榜</label>
        <label className="token-rank-check"><input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} />公开显示昵称与累计用量</label>
        <div className="token-rank-dialog-actions"><button className="btn-outline" type="button" onClick={() => setSettingsOpen(false)}>取消</button><button className="btn-primary" type="button" disabled={saving} onClick={() => void saveSettings()}>{saving ? "保存中…" : "保存并继续"}</button></div>
      </section></div> : null}

      {credential ? <div className="token-rank-dialog-backdrop" role="presentation"><section className="token-rank-dialog token-rank-credential-dialog" role="dialog" aria-modal="true" aria-labelledby="tokenRankCredentialTitle">
        <div className="token-rank-dialog-head"><div><h2 id="tokenRankCredentialTitle">把这台电脑接入排行榜</h2><p>只需选择系统，复制一条命令运行；首次扫描历史记录可能需要几分钟。</p><p className="token-rank-install-expiry">本条接入命令有效至：{formatExpiry(credential.expires_at)}</p></div><button type="button" className="token-rank-close" onClick={() => setCredential(null)} aria-label="关闭">×</button></div>
        <div className="token-rank-connect-step"><span>① 选择你的电脑</span><div className="token-rank-os-tabs"><button type="button" className={installOs === "mac" ? "active" : ""} onClick={() => setInstallOs("mac")}>macOS / Linux</button><button type="button" className={installOs === "windows" ? "active" : ""} onClick={() => setInstallOs("windows")}>Windows</button></div></div>
        <div className="token-rank-command token-rank-one-step"><span>② 复制命令并粘贴到{installOs === "mac" ? "「终端」" : " PowerShell"}运行</span><code>{installCommand}</code><button type="button" className="btn-primary" onClick={() => void copy(installCommand, "接入命令已复制") }><Copy aria-hidden="true" />复制接入命令</button></div>
        <div className="token-rank-command token-rank-ai-help"><span>不想自己操作？复制后直接发给 Codex 或 Claude Code</span><code>{aiPrompt}</code><button type="button" className="btn-outline" onClick={() => void copy(aiPrompt, "AI 接入提示已复制")}><Copy aria-hidden="true" />复制给 AI</button></div>
        <p className="token-rank-credential-note">接入完成后会自动完成首次同步；之后会每 30 分钟自动更新一次数据。</p>
        <div className="token-rank-dialog-actions"><button className="btn-primary" type="button" onClick={() => setCredential(null)}>完成</button></div>
      </section></div> : null}
    </section>
  );
}
