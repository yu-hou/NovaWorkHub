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

function normalizePageUrl(raw: string, requestOrigin: string | null) {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("无效的页面地址");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("页面地址必须是 http/https");
  }
  if (
    parsed.pathname !== "/learning/course" &&
    parsed.pathname !== "/learning/course/"
  ) {
    throw new Error("仅允许为本站课程阅读页生成飞书签名");
  }
  if (!requestOrigin) {
    throw new Error("无法确认课程阅读页来源");
  }
  let origin: URL;
  try {
    origin = new URL(requestOrigin);
  } catch {
    throw new Error("无效的请求来源");
  }
  if (parsed.origin !== origin.origin) {
    throw new Error("课程阅读页与请求来源不一致");
  }
  // 飞书签名：保留 ?query，去掉 #hash（与 location.href.split('#')[0] 一致）
  parsed.hash = "";
  return parsed.toString();
}

function objTypeToPath(objType: string) {
  switch (objType) {
    case "doc":
      return "docs";
    case "docx":
      return "docx";
    case "sheet":
      return "sheets";
    case "bitable":
      return "base";
    case "mindnote":
      return "mindnotes";
    case "slides":
      return "slides";
    default:
      return null;
  }
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

/** 将 wiki 链接解析为云文档组件可打开的 docx/docs 等地址 */
async function resolveEmbedSrc(docUrl: string, appAccessToken: string) {
  let parsed: URL;
  try {
    parsed = new URL(docUrl);
  } catch {
    throw new Error("飞书文档链接无效");
  }

  const wikiMatch = parsed.pathname.match(/\/wiki\/([^/?#]+)/);
  if (!wikiMatch) {
    // 已是 docx/docs/sheets 等，直接去掉查询参数后返回
    return `${parsed.origin}${parsed.pathname}`;
  }

  const wikiToken = wikiMatch[1];
  const res = await fetch(
    `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(wikiToken)}`,
    {
      headers: {
        Authorization: `Bearer ${appAccessToken}`,
      },
    },
  );
  const payload = (await res.json()) as {
    code?: number;
    msg?: string;
    data?: {
      node?: {
        obj_type?: string;
        obj_token?: string;
        title?: string;
      };
    };
  };

  if (payload.code === 99991672) {
    throw new Error(
      "应用缺少 wiki 权限。请在开放平台为应用开通 wiki:wiki:readonly 或 wiki:node:read，并发布生效后重试",
    );
  }
  if (!res.ok || payload.code !== 0 || !payload.data?.node?.obj_token) {
    throw new Error(payload.msg || "无法解析知识库节点，请确认应用已是该页面协作者");
  }

  const { obj_type: objType, obj_token: objToken } = payload.data.node;
  const path = objType ? objTypeToPath(objType) : null;
  if (!path || !objToken) {
    throw new Error(
      `该知识库节点类型暂不支持站内嵌入（${objType ?? "unknown"}），请改用云文档 docx 链接或外链打开`,
    );
  }

  return `${parsed.origin}/${path}/${objToken}`;
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

    const body = (await req.json().catch(() => ({}))) as {
      page_url?: string;
      course_id?: number;
    };
    if (!body.page_url?.trim()) {
      return jsonError("缺少 page_url", 400);
    }

    const courseId = Number(body.course_id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return jsonError("无效课程", 400);
    }

    let pageUrl = "";
    try {
      pageUrl = normalizePageUrl(
        body.page_url.trim(),
        req.headers.get("origin"),
      );
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : "无效的页面地址",
        400,
      );
    }

    const { data: content, error: contentError } = await ctx.supabase
      .from("course_contents")
      .select("feishu_doc_url")
      .eq("course_id", courseId)
      .maybeSingle();
    if (contentError) {
      return jsonError(contentError.message, 400);
    }
    if (!content?.feishu_doc_url?.trim()) {
      return jsonError("无权访问该课程文档", 403);
    }

    try {
      const appAccessToken = await getAppAccessToken(appId, appSecret);
      const embedSrc = await resolveEmbedSrc(
        content.feishu_doc_url.trim(),
        appAccessToken,
      );

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
        embed_src: embedSrc,
      });
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : "飞书签名生成失败",
        502,
      );
    }
  }),
};
