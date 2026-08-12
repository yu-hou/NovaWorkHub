import type { Metadata } from "next";

import { CatalogPreviewPage } from "@/components/home/CatalogPreviewPage";
import { CASES_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AI 自动化实战案例｜Nova",
  description: "Nova AI 自动化实战案例库，收录项目拆解、成员作品和真实场景复盘。",
};

export default function CasesPage() {
  return (
    <CatalogPreviewPage
      eyebrow="MEMBER STORIES"
      title="案例"
      description="真实成员案例与项目拆解，看看 AI 如何在具体业务里产生结果。"
      pageId="pageCases"
      content={CASES_PAGE}
      filterLabel="筛选案例"
    />
  );
}
