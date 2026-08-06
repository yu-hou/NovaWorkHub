import type { Metadata } from "next";

import { UnavailableView } from "@/components/home/UnavailableView";

export const metadata: Metadata = {
  title: "AI 学习路径｜Nova",
  description: "Nova AI 学习路径，按顺序学习 AI 工具、自动化工作流和实战项目。",
};

export default function LearningPathsPage() {
  return <UnavailableView title="学习路径暂未开放" />;
}
