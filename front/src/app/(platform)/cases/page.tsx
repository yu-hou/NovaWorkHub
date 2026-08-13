import type { Metadata } from "next";

import { CasesView } from "@/components/sites/front-design-local-78b686af/shared/CatalogViews";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "AI 自动化实战案例｜Nova",
  description: "Nova AI 自动化实战案例库，收录项目拆解、成员作品和真实场景复盘。",
};

export default function CasesPage() {
  return (
    <FrontDesignShell page="cases">
      <CasesView />
    </FrontDesignShell>
  );
}
