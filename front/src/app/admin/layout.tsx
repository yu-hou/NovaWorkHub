import type { Metadata } from "next";

import "../home.css";

export const metadata: Metadata = {
  title: "Nova 管理后台",
  description: "用户与课程管理",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
