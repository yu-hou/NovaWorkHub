import type { Metadata } from "next";

import TokenRankView from "@/components/token-rank/TokenRankView";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "Token Rank｜NovaWorkHub",
  description: "查看社群 AI 用量排行，并接入自己的 Codex、Claude Code 等本机工具。",
};

export default function TokenRankPage() {
  return (
    <FrontDesignShell page="token">
      <TokenRankView />
    </FrontDesignShell>
  );
}
