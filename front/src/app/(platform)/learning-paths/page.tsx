import type { Metadata } from "next";

import { LearningPathsView } from "@/components/sites/front-design-local-78b686af/learning-paths-html-c7677f58/LearningPathsView";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "AI 学习路径｜Nova",
  description: "Nova AI 学习路径，按顺序学习 AI 工具、自动化工作流和实战项目。",
};

export default function LearningPathsPage() {
  return (
    <FrontDesignShell page="paths">
      <LearningPathsView />
    </FrontDesignShell>
  );
}
