import type { Metadata } from "next";

import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { CASES_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 自动化实战案例｜AgentWork",
  description:
    "AgentWork AI 自动化实战案例库，收录项目拆解、成员作品和真实场景复盘。",
};

export default function CasesPage() {
  return (
    <PlatformShell>
      <ContentListView
        pageId="pageCases"
        content={CASES_PAGE}
        filterLabel="筛选案例"
      />
    </PlatformShell>
  );
}
