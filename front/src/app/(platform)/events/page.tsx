import type { Metadata } from "next";

import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { EVENTS_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 共学活动｜AgentWork",
  description: "AgentWork AI 共学活动，包括训练营、实战比赛、线下组局和主题分享。",
};

export default function EventsPage() {
  return (
    <PlatformShell>
      <ContentListView
        pageId="pageEvents"
        content={EVENTS_PAGE}
        filterLabel="筛选活动"
      />
    </PlatformShell>
  );
}
