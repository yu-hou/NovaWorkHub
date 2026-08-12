import type { Metadata } from "next";

import { CatalogPreviewPage } from "@/components/home/CatalogPreviewPage";
import { REPLAYS_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 直播共学回放｜Nova",
  description: "Nova AI 直播共学回放与复盘资料。",
};

export default function ReplaysPage() {
  return (
    <CatalogPreviewPage
      eyebrow="LIVE & REPLAY"
      title="直播"
      description="直播预告、共学回放与复盘资料将在这里统一发布。"
      pageId="pageReplays"
      content={REPLAYS_PAGE}
      filterLabel="筛选直播"
    />
  );
}
