import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";

import "./globals.css";
import "./landing.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AgentWork｜AI Agent 实战学习社群",
  description:
    "跨过 AI 学习门槛，用 Agent 真正做出结果。系统课程、案例拆解、直播共学、实战项目与会员资源。",
  icons: {
    icon: "/seo/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${sora.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
