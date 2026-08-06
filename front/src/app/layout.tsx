import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "Nova｜AI Agent 实战学习社群",
  description:
    "跨过 AI 学习门槛，用 Agent 真正做出结果。系统课程、案例拆解、直播共学、实战项目与会员资源。",
  icons: {
    icon: "/seo/favicon.ico",
  },
};

const themeInitScript = `(function(){try{var k='nova-theme';var t=localStorage.getItem(k);var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
