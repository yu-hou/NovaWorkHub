import type { Metadata } from "next";

import { LiveView } from "@/components/sites/front-design-local-78b686af/shared/CatalogViews";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "AI 直播共学回放｜Nova",
  description: "Nova AI 直播共学回放与复盘资料。",
};

export default function ReplaysPage() {
  return (
    <FrontDesignShell page="replays">
      <LiveView />
    </FrontDesignShell>
  );
}
