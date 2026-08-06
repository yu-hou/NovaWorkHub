import type { Metadata } from "next";

import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { LEARNING_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 课程与学习内容｜AgentWork",
  description:
    "AgentWork AI 课程与学习资料，覆盖 AI 工具、提示词、自动化工作流和项目交付。",
};

export default function LearningPage() {
  return (
    <PlatformShell>
      <ContentListView
        pageId="pageLearning"
        content={LEARNING_PAGE}
        variant="course"
        filterLabel="筛选课程"
      />
    </PlatformShell>
  );
}
