import type { Metadata } from "next";

import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { BENEFITS_PAGE } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "AgentWork 会员福利",
  description:
    "AgentWork 会员资源与福利，包括 AI 产品优惠、内测资格、激活码和社群活动权益。",
};

export default function BenefitsPage() {
  return (
    <PlatformShell>
      <ContentListView
        pageId="pageBenefits"
        content={BENEFITS_PAGE}
        variant="benefit"
        filterLabel="筛选福利"
      />
    </PlatformShell>
  );
}
