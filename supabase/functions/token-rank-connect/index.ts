import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

function error(detail: string, status = 400) { return Response.json({ detail }, { status }); }
async function sha256(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return Array.from(new Uint8Array(digest), (item) => item.toString(16).padStart(2, "0")).join(""); }
function deviceKey() { const bytes = crypto.getRandomValues(new Uint8Array(32)); return `nwh_tr_${btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")}`; }

export default { fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
  if (req.method !== "POST") return error("只支持 POST", 405);
  const payload = await req.json().catch(() => ({})) as { token?: string; label?: string };
  const token = String(payload.token ?? "").trim();
  if (!token.startsWith("nwh_setup_")) return error("安装令牌无效或已过期", 401);
  const now = new Date().toISOString();
  const { data: claimed, error: claimError } = await ctx.supabaseAdmin.from("token_rank_install_tokens").update({ claimed_at: now }).eq("token_hash", await sha256(token)).gt("expires_at", now).is("claimed_at", null).select("id,user_id").maybeSingle();
  if (claimError || !claimed) return error("安装令牌无效、已使用或已过期", 401);
  const key = deviceKey();
  const { data: device, error: deviceError } = await ctx.supabaseAdmin.from("token_rank_devices").insert({ user_id: claimed.user_id, token_hash: await sha256(key), label: String(payload.label ?? "本机客户端").trim().slice(0, 80) || "本机客户端" }).select("id").single();
  if (deviceError || !device) return error("创建本机连接失败", 500);
  await ctx.supabaseAdmin.from("token_rank_install_tokens").update({ device_id: device.id }).eq("id", claimed.id);
  return Response.json({ device_key: key, upload_url: "https://aqelzocuukilmfakzgdv.supabase.co/functions/v1/token-rank-upload" });
}) };
