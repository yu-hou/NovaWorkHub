import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type FeishuTokenCache = {
  token: string;
  expireAt: number;
};

type FeishuTicketCache = {
  ticket: string;
  expireAt: number;
};

let tokenCache: FeishuTokenCache | null = null;
let ticketCache: FeishuTicketCache | null = null;

function jsonError(detail: string, status: number) {
  return Response.json({ detail }, { status });
}

function randomNonce(length = 16) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

async function sha1Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizePageUrl(raw: string) {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("无效的页面地址");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("页面地址必须是 http/https");
  }
  // 飞书签名要求：去掉 # 与 ? 后的参数
  return `${parsed.origin}${parsed.pathname}`;
}

async function getAppAccessToken(appId: string, appSecret: string) {
  const now = Date.now();
  if (tokenCache && tokenCache.expireAt > now + 60_000) {
    return tokenCache.token;
  }

  const res = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    },
  );
  const payload = (await res.json()) as {
    code?: number;
    msg?: string;
    app_access_token?: string;
    expire?: number;
  };
  if (!res.ok || payload.code !== 0 || !payload.app_access_token) {
    throw new Error(payload.msg || "获取飞书 app_access_token 失败");
  }

  tokenCache = {
    token: payload.app_access_token,
    expireAt: now + (payload.expire ?? 7200) * 1000,
  };
  return tokenCache.token;
}

async function getJsapiTicket(appAccessToken: string) {
  const now = Date.now();
  if (ticketCache && ticketCache.expireAt > now + 60_000) {
    return ticketCache.ticket;
  }

  const res = await fetch("https://open.feishu.cn/open-apis/jssdk/ticket/get", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${appAccessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  const payload = (await res.json()) as {
    code?: number;
    msg?: string;
    data?: { ticket?: string; expire_in?: number };
  };
  if (!res.ok || payload.code !== 0 || !payload.data?.ticket) {
    throw new Error(payload.msg || "获取飞书 jsapi_ticket 失败");
  }

  ticketCache = {
    ticket: payload.data.ticket,
    expireAt: now + (payload.data.expire_in ?? 7200) * 1000,
  };
  return ticketCache.ticket;
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (!ctx.userClaims?.id) {
      return jsonError("请先登录后再查看课程文档", 401);
    }

    const appId = Deno.env.get("FEISHU_APP_ID")?.trim() ?? "";
    const appSecret = Deno.env.get("FEISHU_APP_SECRET")?.trim() ?? "";
    if (!appId || !appSecret) {
      return jsonError(
        "未配置飞书开放平台凭证（FEISHU_APP_ID / FEISHU_APP_SECRET）",
        503,
      );
    }

    const body = (await req.json().catch(() => ({}))) as { page_url?: string };
    if (!body.page_url?.trim()) {
      return jsonError("缺少 page_url", 400);
    }

    let pageUrl = "";
    try {
      pageUrl = normalizePageUrl(body.page_url.trim());
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : "无效的页面地址",
        400,
      );
    }

    try {
      const appAccessToken = await getAppAccessToken(appId, appSecret);
      const ticket = await getJsapiTicket(appAccessToken);
      const nonceStr = randomNonce(16);
      const timestamp = Date.now();
      const plain =
        `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${pageUrl}`;
      const signature = await sha1Hex(plain);

      return Response.json({
        appId,
        signature,
        nonceStr,
        timestamp,
        url: pageUrl,
        jsApiList: ["DocsComponent"],
        locale: "zh-CN",
      });
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : "飞书签名生成失败",
        502,
      );
    }
  }),
};
