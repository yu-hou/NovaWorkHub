import type { Metadata } from "next";

import { LearningPathsView } from "@/components/home/LearningPathsView";
import { PlatformShell } from "@/components/home/PlatformShell";

export const metadata: Metadata = {
  title: "AI 学习路径｜AgentWork",
  description:
    "AgentWork AI 学习路径，按顺序学习 AI 工具、自动化工作流和实战项目。",
};

export default function LearningPathsPage() {
  return (
    <PlatformShell>
      <LearningPathsView />
    </PlatformShell>
  );
}
