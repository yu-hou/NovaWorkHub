"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError, apiFetch } from "@/lib/api";

const FEISHU_SDK_SRC =
  "https://sf1-scmcdn-cn.feishucdn.com/obj/feishu-static/docComponentSdk/lib/1.0.13.js";

export type FeishuSignature = {
  appId: string;
  signature: string;
  nonceStr: string;
  timestamp: number;
  url: string;
  jsApiList: string[];
  locale: string;
  embed_src?: string | null;
};

type DocComponentInstance = {
  start: () => Promise<unknown>;
  destroy: () => void;
};

type DocComponentSdkConstructor = new (options: {
  src: string;
  mount: HTMLElement;
  config?: {
    header?: { enable?: boolean };
  };
  theme?: "light" | "dark";
  size?: { width?: string | number; height?: string | number };
  auth: {
    signature: string;
    appId: string;
    timestamp: number;
    nonceStr: string;
    url: string;
    jsApiList: string[];
    locale?: string;
  };
  onError?: (error: unknown) => void;
  onAuthError?: (error: unknown) => void;
  onMountTimeout?: () => void;
}) => DocComponentInstance;

declare global {
  interface Window {
    DocComponentSdk?: DocComponentSdkConstructor;
  }
}

type FeishuDocsViewerProps = {
  courseId: number;
  src: string;
  title: string;
  fullScreen?: boolean;
  initialAuth?: FeishuSignature;
};

// 保持斜向阅读轨迹，同时避免形成整齐的横竖网格。
const watermarkPositions = [
  [2, 8], [29, 1], [58, 10], [87, 4],
  [13, 25], [43, 19], [72, 29], [101, 23],
  [-5, 44], [25, 37], [55, 47], [84, 41],
  [8, 62], [38, 56], [67, 66], [96, 59],
  [-2, 81], [27, 75], [57, 85], [87, 79],
] as const;

function FeishuFallbackCard({
  url,
  title,
  reason,
  fullScreen = false,
}: {
  url: string;
  title: string;
  reason?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={`feishu-open-card${fullScreen ? " feishu-open-card-fullscreen" : ""}`}
    >
      <div className="feishu-open-card-body">
        <h3>在飞书中阅读本文</h3>
        <p>
          {reason
            ? reason
            : "当前无法在站内嵌入文档，请点击下方按钮在飞书中打开。"}
        </p>
        <p className="sub">
          若打开后仍要扫码：请文档所有者把分享权限改为「获得链接的人可阅读」，并把开放平台应用加为文档协作者（只读）。
        </p>
        <div className="feishu-open-actions">
          <a
            className="feishu-open-primary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            打开飞书文档
          </a>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              void navigator.clipboard?.writeText(url);
            }}
          >
            复制链接
          </button>
        </div>
        <p className="sub feishu-open-url">
          {title ? `${title} · ` : ""}
          {url}
        </p>
      </div>
    </div>
  );
}

let sdkLoader: Promise<DocComponentSdkConstructor> | null = null;

function loadFeishuSdk() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("仅浏览器可加载飞书组件"));
  }
  if (window.DocComponentSdk) {
    return Promise.resolve(window.DocComponentSdk);
  }
  if (sdkLoader) return sdkLoader;

  sdkLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-feishu-doc-sdk="1"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.DocComponentSdk) resolve(window.DocComponentSdk);
        else reject(new Error("飞书文档 SDK 加载失败"));
      });
      existing.addEventListener("error", () =>
        reject(new Error("飞书文档 SDK 脚本加载失败")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = FEISHU_SDK_SRC;
    script.async = true;
    script.dataset.feishuDocSdk = "1";
    script.onload = () => {
      if (window.DocComponentSdk) resolve(window.DocComponentSdk);
      else reject(new Error("飞书文档 SDK 未就绪"));
    };
    script.onerror = () => reject(new Error("飞书文档 SDK 脚本加载失败"));
    document.head.appendChild(script);
  });

  sdkLoader = sdkLoader.catch((error) => {
    sdkLoader = null;
    throw error;
  });
  return sdkLoader;
}

export function preloadFeishuDocsSdk() {
  return loadFeishuSdk();
}

function signaturePageUrl() {
  // 必须与飞书校验的当前页 URL 一致：含 query，不含 hash
  return window.location.href.split("#")[0];
}

function formatAuthError(error: unknown) {
  if (error == null) return "飞书文档鉴权失败";
  if (typeof error === "string") return `飞书文档鉴权失败：${error}`;
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const code = record.errorCode ?? record.code ?? record.errno;
    const message =
      record.errorMessage ?? record.message ?? record.msg ?? record.error;
    const parts = [
      code != null ? `code=${String(code)}` : "",
      message != null ? String(message) : "",
    ].filter(Boolean);
    if (parts.length) return `飞书文档鉴权失败（${parts.join("，")}）`;
  }
  return "飞书文档鉴权失败";
}

export function FeishuDocsViewer({
  courseId,
  src,
  title,
  fullScreen = false,
  initialAuth,
}: FeishuDocsViewerProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const mountRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<DocComponentInstance | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  const [fallbackReason, setFallbackReason] = useState("");

  useEffect(() => {
    let cancelled = false;
    let mountTimer: number | null = null;

    const failToFallback = (reason: string) => {
      if (cancelled) return;
      setFallbackReason(reason);
      setStatus("fallback");
      try {
        componentRef.current?.destroy();
      } catch {
        /* ignore */
      }
      componentRef.current = null;
    };

    async function mountDoc() {
      setStatus("loading");
      setFallbackReason("");

      if (!src.trim()) {
        failToFallback("课程未配置飞书文档链接。");
        return;
      }

      try {
        const authRequest = initialAuth
          ? Promise.resolve(initialAuth)
          : apiFetch<FeishuSignature>(
            "/api/feishu/doc-signature",
            {
              method: "POST",
              body: {
                page_url: signaturePageUrl(),
                course_id: courseId,
              },
            },
          );
        const [auth, DocSdk] = await Promise.all([
          authRequest,
          loadFeishuSdk(),
        ]);
        if (cancelled) return;

        const embedSrc = (auth.embed_src || src).trim();
        if (!embedSrc) {
          failToFallback("未能解析可嵌入的飞书文档地址。");
          return;
        }

        const mountNode = mountRef.current;
        if (!mountNode) {
          failToFallback("文档容器未就绪，请刷新后重试。");
          return;
        }

        try {
          componentRef.current?.destroy();
        } catch {
          /* ignore */
        }
        mountNode.innerHTML = "";

        const instance = new DocSdk({
          src: embedSrc,
          mount: mountNode,
          config: {
            // 使用飞书组件的官方配置隐藏内部 Header，而非用 CSS 遮挡跨域内容。
            header: { enable: false },
          },
          theme: theme === "dark" ? "dark" : "light",
          size: {
            width: "100%",
            height: fullScreen ? "100dvh" : "72vh",
          },
          auth: {
            appId: auth.appId,
            signature: auth.signature,
            timestamp: auth.timestamp,
            nonceStr: auth.nonceStr,
            url: auth.url,
            jsApiList: auth.jsApiList,
            locale: auth.locale || "zh-CN",
          },
          onAuthError: (error) => {
            const detail = formatAuthError(error);
            const hint = /public_key|key_meta|Scope denied|code\s*=?\s*9/i.test(
              detail,
            )
              ? "多为应用缺少「查看、评论、编辑和管理云空间中所有文件」(drive:drive) 应用身份权限；开通并发布版本后重试。文档协作者可仍为只读。"
              : "请确认开放平台已配置当前站点为「H5 可信域名」。";
            failToFallback(`${detail}。${hint} 已切换为外链打开。`);
          },
          onError: (error) => {
            failToFallback(
              `${formatAuthError(error).replace("鉴权失败", "加载出错")}。已切换为外链打开。`,
            );
          },
          onMountTimeout: () => {
            failToFallback("飞书文档加载超时，已切换为外链打开。");
          },
        });

        componentRef.current = instance;
        await instance.start();
        if (cancelled) {
          instance.destroy();
          return;
        }
        setStatus("ready");

        // 若长时间仍无内容，兜底外链（组件偶发静默失败）
        mountTimer = window.setTimeout(() => {
          if (cancelled) return;
          const hasChild = Boolean(mountRef.current?.childElementCount);
          if (!hasChild) {
            failToFallback("飞书文档未能完成渲染，已切换为外链打开。");
          }
        }, 12000);
      } catch (error) {
        const detail =
          error instanceof ApiError
            ? error.detail
            : error instanceof Error
              ? error.message
              : "飞书文档嵌入失败";
        failToFallback(`${detail}。已切换为外链打开。`);
      }
    }

    void mountDoc();

    return () => {
      cancelled = true;
      if (mountTimer) window.clearTimeout(mountTimer);
      try {
        componentRef.current?.destroy();
      } catch {
        /* ignore */
      }
      componentRef.current = null;
    };
  }, [courseId, fullScreen, initialAuth, src, theme]);

  if (status === "fallback") {
    return (
      <FeishuFallbackCard
        url={src}
        title={title}
        reason={fallbackReason}
        fullScreen={fullScreen}
      />
    );
  }

  return (
    <div
      className={`feishu-content${fullScreen ? " feishu-content-fullscreen" : ""}`}
    >
      <div className="feishu-doc-frame">
        <div className="feishu-watermark-layer" aria-hidden="true">
          {watermarkPositions.map(([left, top], index) => (
            <span
              key={index}
              style={{ "--watermark-left": `${left}%`, "--watermark-top": `${top}%` } as CSSProperties}
            >
              {index % 2 === 0 ? "NovaWorkHub" : user?.email || "课程阅读"}
            </span>
          ))}
        </div>
        {!fullScreen ? (
          <div className="feishu-doc-toolbar">
            <span>
              {status === "loading" ? "正在加载飞书文档…" : "阅读飞书文档"}
            </span>
            <a href={src} target="_blank" rel="noopener noreferrer">
              在飞书中打开
            </a>
          </div>
        ) : null}
        <div ref={mountRef} className="feishu-doc-mount" />
        {fullScreen && status === "loading" ? (
          <div className="course-reader-loading" role="status">
            <span className="course-reader-spinner" aria-hidden="true" />
            <span>正在加载飞书文档…</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
