"use client";

import { Copy, KeyRound, LoaderCircle, MonitorCog, RotateCcw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";

type Range = "today" | "week" | "month";

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

type DeviceCredential = {
  device: { id: string; label: string };
  device_key: string;
  upload_url: string;
  handle: string;
  instructions: string;
};

function formatTokens(value: number) {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(value >= 1_000_000_000 ? 1 : 2)}亿`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(value >= 1_000_000 ? 1 : 2)}万`;
  return new Intl.NumberFormat("zh-CN").format(Math.round(value));
}

function formatTime(value: string | null) {
  if (!value) return "尚未同步";
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
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
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [city, setCity] = useState("");
  const [joining, setJoining] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credential, setCredential] = useState<DeviceCredential | null>(null);
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

  const syncCommand = credential
    ? `./novatoken preview --json | curl --fail-with-body --silent --show-error -X POST '${credential.upload_url}' -H 'Content-Type: application/json' -H 'X-Token-Rank-Device-Key: ${credential.device_key}' --data-binary @-`
    : "";

  const saveSettings = async () => {
    setSaving(true);
    try {
      await tokenRankCall({ action: "save-settings", handle, city, join_board: joining, is_public: isPublic });
      setNotice("排行榜设置已保存");
      setSettingsOpen(false);
      await load();
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const createDevice = async () => {
    setSaving(true);
    try {
      const next = await tokenRankCall<DeviceCredential>({ action: "issue-device", label: "我的电脑" });
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
      <div className="token-rank-hero-card">
        <div>
          <span className="token-rank-eyebrow">TOKEN RANK</span>
          <h1>社群 AI 用量排行榜</h1>
          <p>仅统计按日期、工具和模型汇总的 Token 数字，不上传对话、代码或文件。</p>
        </div>
        <div className="token-rank-hero-actions">
          <button className="btn-outline" type="button" onClick={() => setSettingsOpen(true)}>排行榜设置</button>
          <button className="btn-primary" type="button" onClick={() => { if (data?.member) void createDevice(); else setSettingsOpen(true); }}>
            <MonitorCog aria-hidden="true" />接入我的电脑
          </button>
        </div>
      </div>

      {notice ? <div className="token-rank-notice" role="status">{notice}</div> : null}
      {error ? <div className="token-rank-notice is-error" role="alert">{error}<button type="button" onClick={() => void load()}><RotateCcw aria-hidden="true" />重试</button></div> : null}

      <div className="token-rank-metric-grid">
        <article><span>社群累计</span><strong>{formatTokens(data?.summary.total_tokens ?? 0)}</strong><small>{range === "today" ? "今天" : range === "month" ? "近 30 天" : "近 7 天"}总 Token</small></article>
        <article><span>参与人数</span><strong>{data?.summary.participants ?? 0}</strong><small>已公开并参与排行</small></article>
        <article><span>我的用量</span><strong>{formatTokens(data?.summary.own_tokens ?? 0)}</strong><small>{data?.summary.own_rank ? `当前第 ${data.summary.own_rank} 名` : "接入后自动统计"}</small></article>
      </div>

      <div className="token-rank-layout">
        <section className="token-rank-board-card">
          <div className="token-rank-section-heading">
            <div><h2>排行榜</h2><p>总量 = 输入 + 输出 + 缓存读取 + 缓存写入</p></div>
            <div className="token-rank-range" aria-label="统计周期">
              {([ ["today", "今天"], ["week", "近 7 天"], ["month", "近 30 天"] ] as const).map(([value, label]) => (
                <button key={value} type="button" className={range === value ? "active" : ""} onClick={() => setRange(value)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="token-rank-list" aria-live="polite">
            {(data?.leaderboard ?? []).map((entry) => (
              <article className="token-rank-entry" key={entry.user_id}>
                <span className={`token-rank-place ${rankBadge(entry.rank)}`}>{entry.rank}</span>
                <span className="token-rank-avatar">{entry.handle.slice(0, 1).toUpperCase()}</span>
                <div className="token-rank-entry-user"><strong>{entry.handle}</strong><small>{entry.city || "Nova 社群成员"}</small></div>
                <div className="token-rank-entry-tools">{Object.entries(entry.by_tool ?? {}).slice(0, 2).map(([tool, value]) => <span key={tool}>{tool} {formatTokens(Number(value))}</span>)}</div>
                <strong className="token-rank-entry-score">{formatTokens(entry.total_tokens)}</strong>
              </article>
            ))}
            {!data?.leaderboard.length ? <div className="token-rank-empty"><KeyRound aria-hidden="true" /><strong>排行榜等待第一位参与者</strong><p>保存昵称并接入电脑后，首次同步即可上榜。</p></div> : null}
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
        <div className="token-rank-dialog-head"><div><h2 id="tokenRankCredentialTitle">设备接入凭证已生成</h2><p>{credential.instructions}</p></div><button type="button" className="token-rank-close" onClick={() => setCredential(null)} aria-label="关闭">×</button></div>
        <div className="token-rank-copy-field"><span>上传地址</span><code>{credential.upload_url}</code><button type="button" onClick={() => void copy(credential.upload_url, "上传地址已复制")} aria-label="复制上传地址"><Copy aria-hidden="true" /></button></div>
        <div className="token-rank-copy-field"><span>设备密钥</span><code>{credential.device_key}</code><button type="button" onClick={() => void copy(credential.device_key, "设备密钥已复制")} aria-label="复制设备密钥"><Copy aria-hidden="true" /></button></div>
        <div className="token-rank-downloads"><span>还没有 NovaToken 扫描器？先下载对应版本</span><div><a href="https://novatoken.novaislandai.workers.dev/dl/novatoken" target="_blank" rel="noreferrer">macOS</a><a href="https://novatoken.novaislandai.workers.dev/dl/novatoken-linux-amd64" target="_blank" rel="noreferrer">Linux x64</a><a href="https://novatoken.novaislandai.workers.dev/dl/novatoken-linux-arm64" target="_blank" rel="noreferrer">Linux ARM</a><a href="https://novatoken.novaislandai.workers.dev/dl/novatoken-windows-amd64.exe" target="_blank" rel="noreferrer">Windows</a></div></div>
        <div className="token-rank-command"><span>首次同步（macOS / Linux，已安装 NovaToken 后执行）</span><code>{syncCommand}</code><button type="button" className="btn-outline" onClick={() => void copy(syncCommand, "首次同步命令已复制")}><Copy aria-hidden="true" />复制同步命令</button></div>
        <p className="token-rank-credential-note">NovaToken 只在本机扫描使用记录并输出汇总数字；这条命令只上传日期、工具、模型及 Token 数量。首次同步成功后，刷新本页即可看到自己的用量与排名。</p>
        <div className="token-rank-dialog-actions"><button className="btn-primary" type="button" onClick={() => setCredential(null)}>我已保存</button></div>
      </section></div> : null}
    </section>
  );
}
