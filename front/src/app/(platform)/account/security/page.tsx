import type { Metadata } from "next";

import { AccountSecurityPage } from "@/components/auth/AccountSecurityPage";

export const metadata: Metadata = {
  title: "账户安全｜Nova",
  description: "管理 Nova 学习平台账号密码。",
};

export default function SecurityPage() {
  return <AccountSecurityPage />;
}
