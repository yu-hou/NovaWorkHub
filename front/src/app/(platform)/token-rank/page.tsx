import type { Metadata } from "next";

import { PlatformShell } from "@/components/home/PlatformShell";
import { TokenRankView } from "@/components/home/TokenRankView";

export const metadata: Metadata = {
  title: "Token Rank｜Agent 消耗排行榜",
  description: "Agent 消耗排行榜",
};

export default function TokenRankPage() {
  return (
    <PlatformShell>
      <TokenRankView />
    </PlatformShell>
  );
}
