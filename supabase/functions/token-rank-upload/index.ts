import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type UsageEntry = {
  date?: string;
  tool?: string;
  model?: string;
  input?: number;
  output?: number;
  cache_read?: number;
  cache_write?: number;
};

const MAX_ENTRIES = 1000;

function jsonError(detail: string, status = 400) {
  return Response.json({ detail }, { status });
}

function cleanText(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanCount(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || !Number.isSafeInteger(number)) return null;
  return number;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (item) => item.toString(16).padStart(2, "0")).join("");
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method !== "POST") return jsonError("只支持 POST", 405);
    const rawKey = req.headers.get("x-token-rank-device-key") || "";
    if (!rawKey.startsWith("nwh_tr_")) return jsonError("缺少设备密钥", 401);
    const { data: device, error: deviceError } = await ctx.supabaseAdmin
      .from("token_rank_devices")
      .select("id,user_id,revoked_at")
      .eq("token_hash", await sha256(rawKey))
      .maybeSingle();
    if (deviceError || !device || device.revoked_at) return jsonError("设备密钥无效或已撤销", 401);

    const payload = await req.json().catch(() => null) as unknown;
    const entries = Array.isArray(payload)
      ? payload as UsageEntry[]
      : (payload as { entries?: UsageEntry[] } | null)?.entries;
    if (!Array.isArray(entries) || entries.length > MAX_ENTRIES) return jsonError("上传数据格式错误或数量过多");

    const rows: Record<string, unknown>[] = [];
    for (const entry of entries) {
      const usageDate = cleanText(entry.date, 10);
      const tool = cleanText(entry.tool, 48).toLowerCase();
      const model = cleanText(entry.model, 160) || "unknown";
      const input = cleanCount(entry.input);
      const output = cleanCount(entry.output);
      const cacheRead = cleanCount(entry.cache_read);
      const cacheWrite = cleanCount(entry.cache_write);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(usageDate) || !tool || input === null || output === null || cacheRead === null || cacheWrite === null) {
        return jsonError("包含无效的日期、工具或 Token 数量");
      }
      rows.push({
        device_id: device.id,
        user_id: device.user_id,
        usage_date: usageDate,
        tool,
        model,
        input_tokens: input,
        output_tokens: output,
        cache_read_tokens: cacheRead,
        cache_write_tokens: cacheWrite,
        updated_at: new Date().toISOString(),
      });
    }

    if (rows.length) {
      const { error } = await ctx.supabaseAdmin
        .from("token_rank_usage")
        .upsert(rows, { onConflict: "device_id,usage_date,tool,model" });
      if (error) return jsonError(error.message, 400);
    }
    await ctx.supabaseAdmin
      .from("token_rank_devices")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", device.id);
    return Response.json({ uploaded: rows.length });
  }),
};
