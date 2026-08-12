import type { Metadata } from "next";

import { CatalogPreviewPage } from "@/components/home/CatalogPreviewPage";
import { EVENTS_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 共学活动｜Nova",
  description: "Nova AI 共学活动，包括训练营、实战比赛、线下组局和主题分享。",
};

export default function EventsPage() {
  return (
    <CatalogPreviewPage
      eyebrow="COMMUNITY EVENTS"
      title="活动"
      description="社群活动、主题分享与实战共创，按最新内容整理。"
      pageId="pageEvents"
      content={EVENTS_PAGE}
      filterLabel="筛选活动"
    />
  );
}
