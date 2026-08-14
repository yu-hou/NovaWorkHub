import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type Member = {
  user_id: string;
  handle: string;
  city: string;
  join_board: boolean;
  is_public: boolean;
};

type Device = {
  id: string;
  label: string;
  created_at: string;
  last_seen_at: string | null;
  revoked_at: string | null;
};

function jsonError(detail: string, status = 400) {
  return Response.json({ detail }, { status });
}

function cleanText(value: unknown, max: number) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function cleanHandle(value: unknown) {
  const handle = cleanText(value, 40);
  if (handle.length < 2) throw new Error("昵称请填写 2–40 个字符");
  return handle;
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function createDeviceKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `nwh_tr_${btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")}`;
}

function createInstallToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `nwh_setup_${btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")}`;
}

function uploadUrl(request: Request) {
  const url = new URL(request.url);
  url.protocol = "https:";
  url.pathname = "/functions/v1/token-rank-upload";
  url.search = "";
  url.hash = "";
  return url.toString();
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (item) => item.toString(16).padStart(2, "0")).join("");
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const userId = ctx.userClaims?.id;
    if (!userId) return jsonError("请先登录", 401);

    const payload = await req.json().catch(() => ({})) as {
      action?: "overview" | "save-settings" | "issue-device" | "issue-install-token" | "revoke-device";
      handle?: string;
      city?: string;
      join_board?: boolean;
      is_public?: boolean;
      label?: string;
      device_id?: string;
      range?: "today" | "week" | "month";
    };

    const action = payload.action || "overview";
    const { data: profile } = await ctx.supabaseAdmin
      .from("profiles")
      .select("display_name,is_active")
      .eq("id", userId)
      .maybeSingle();
    if (!profile?.is_active) return jsonError("账号不可用", 403);

    if (action === "save-settings") {
      let handle: string;
      try {
        handle = cleanHandle(payload.handle);
      } catch (error) {
        return jsonError(error instanceof Error ? error.message : "昵称无效");
      }
      const { data, error } = await ctx.supabaseAdmin
        .from("token_rank_members")
        .upsert({
          user_id: userId,
          handle,
          city: cleanText(payload.city, 80),
          join_board: payload.join_board !== false,
          is_public: payload.is_public !== false,
        })
        .select("user_id,handle,city,join_board,is_public")
        .single();
      if (error) {
        return jsonError(error.code === "23505" ? "这个昵称已被使用，请换一个" : error.message);
      }
      return Response.json({ member: data });
    }

    if (action === "issue-device") {
      const { data: member } = await ctx.supabaseAdmin
        .from("token_rank_members")
        .select("user_id,handle")
        .eq("user_id", userId)
        .maybeSingle();
      if (!member) return jsonError("请先保存排行榜昵称，再生成接入命令");
      const key = createDeviceKey();
      const { data: device, error } = await ctx.supabaseAdmin
        .from("token_rank_devices")
        .insert({ user_id: userId, token_hash: await sha256(key), label: cleanText(payload.label, 80) || "本机客户端" })
        .select("id,label,created_at,last_seen_at,revoked_at")
        .single();
      if (error) return jsonError(error.message);
      return Response.json({
        device,
        device_key: key,
        upload_url: uploadUrl(req),
        handle: member.handle,
        instructions: "请妥善保存设备密钥；关闭弹窗后将无法再次查看。",
      });
    }

    if (action === "issue-install-token") {
      const { data: member } = await ctx.supabaseAdmin.from("token_rank_members").select("user_id").eq("user_id", userId).maybeSingle();
      if (!member) return jsonError("请先保存排行榜昵称，再生成接入命令");
      const token = createInstallToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const { error } = await ctx.supabaseAdmin.from("token_rank_install_tokens").insert({ user_id: userId, token_hash: await sha256(token), expires_at: expiresAt });
      if (error) return jsonError(error.message, 500);
      return Response.json({ install_token: token, expires_at: expiresAt });
    }

    if (action === "revoke-device") {
      const { error } = await ctx.supabaseAdmin
        .from("token_rank_devices")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", cleanText(payload.device_id, 80))
        .eq("user_id", userId)
        .is("revoked_at", null);
      if (error) return jsonError(error.message);
      return Response.json({ ok: true });
    }

    const range = payload.range === "today" ? "today" : payload.range === "month" ? "month" : "week";
    const days = range === "today" ? 1 : range === "month" ? 30 : 7;
    const [{ data: member }, { data: devices }, { data: rows, error: boardError }] = await Promise.all([
      ctx.supabaseAdmin.from("token_rank_members").select("user_id,handle,city,join_board,is_public").eq("user_id", userId).maybeSingle(),
      ctx.supabaseAdmin.from("token_rank_devices").select("id,label,created_at,last_seen_at,revoked_at").eq("user_id", userId).order("created_at", { ascending: false }),
      ctx.supabaseAdmin.rpc("token_rank_leaderboard_internal", { window_days: days }),
    ]);
    if (boardError) return jsonError(boardError.message, 500);
    const leaderboard = rows ?? [];
    const totalTokens = leaderboard.reduce((total, row) => total + Number(row.total_tokens || 0), 0);
    const ownRank = leaderboard.find((row) => row.user_id === userId) ?? null;
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days + 1);

    const { data: ownUsage } = await ctx.supabaseAdmin
      .from("token_rank_usage")
      .select("input_tokens,output_tokens,cache_read_tokens,cache_write_tokens")
      .eq("user_id", userId)
      .gte("usage_date", formatIsoDate(since));
    const ownTotals = (ownUsage ?? []).reduce(
      (total, row) => total + Number(row.input_tokens) + Number(row.output_tokens) + Number(row.cache_read_tokens) + Number(row.cache_write_tokens),
      0,
    );

    return Response.json({
      range,
      member: member as Member | null,
      devices: (devices ?? []) as Device[],
      leaderboard,
      summary: { participants: leaderboard.length, total_tokens: totalTokens, own_tokens: ownTotals, own_rank: ownRank?.rank ?? null },
      suggested_handle: cleanText(profile.display_name, 40) || "Nova 用户",
    });
  }),
};
