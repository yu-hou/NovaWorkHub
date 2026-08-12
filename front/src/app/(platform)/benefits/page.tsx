import type { Metadata } from "next";

import { CatalogPreviewPage } from "@/components/home/CatalogPreviewPage";
import { BENEFITS_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "Nova 会员福利",
  description: "Nova 会员资源与福利。",
};

export default function BenefitsPage() {
  return (
    <CatalogPreviewPage
      eyebrow="MEMBER BENEFITS"
      title="福利"
      description="会员福利、兑换码与工具权益。当前内容仅供预览。"
      pageId="pageBenefits"
      content={BENEFITS_PAGE}
      variant="benefit"
      filterLabel="筛选福利"
    />
  );
}
