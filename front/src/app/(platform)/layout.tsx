import type { Metadata } from "next";

import "../home.css";

export const metadata: Metadata = {
  title: "Nova 学习平台",
  description:
    "Nova 社群成员学习平台，集中访问 AI 课程、实战案例、共学活动和会员福利。",
};

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
