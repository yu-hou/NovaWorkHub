import type { Metadata } from "next";

import { CoursesView } from "@/components/sites/front-design-local-78b686af/shared/CatalogViews";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "AgentWork 课程",
  description: "AI 课程与学习资料，覆盖 AI 工具、提示词、自动化工作流和项目交付。",
};

export default function LearningPage() {
  return (
    <FrontDesignShell page="learning">
      <CoursesView />
    </FrontDesignShell>
  );
}
