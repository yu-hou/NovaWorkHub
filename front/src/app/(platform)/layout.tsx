import type { Metadata } from "next";

import "../home.css";
import "../workbench.css";

export const metadata: Metadata = {
  title: "Nova 工作台",
  description:
    "Nova 工作台：课程舱、路径轨、案例库、活动台与权益仓，集中推进 AI 实战学习。",
};

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
