import type { Metadata } from "next";

import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { REPLAYS_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 直播共学回放｜AgentWork",
  description:
    "AgentWork AI 直播共学回放与复盘资料，围绕热点工具、实操案例和成员问题持续更新。",
};

export default function ReplaysPage() {
  return (
    <PlatformShell>
      <ContentListView
        pageId="pageReplays"
        content={REPLAYS_PAGE}
        filterLabel="筛选回放"
      />
    </PlatformShell>
  );
}
