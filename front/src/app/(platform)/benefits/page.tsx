import type { Metadata } from "next";

import { BenefitsView } from "@/components/sites/front-design-local-78b686af/shared/CatalogViews";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "Nova 会员福利",
  description: "Nova 会员资源与福利。",
};

export default function BenefitsPage() {
  return (
    <FrontDesignShell page="benefits">
      <BenefitsView />
    </FrontDesignShell>
  );
}
