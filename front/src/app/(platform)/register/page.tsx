import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "注册｜Nova",
  description: "注册 Nova 学习平台账号，开始 AI 实战学习。",
};

export default function RegisterPage() {
  return <AuthPage action="register" />;
}
