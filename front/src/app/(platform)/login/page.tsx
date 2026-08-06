import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "登录｜Nova",
  description: "登录 Nova 学习平台，继续课程与实战进度。",
};

export default function LoginPage() {
  return <AuthPage action="login" />;
}
