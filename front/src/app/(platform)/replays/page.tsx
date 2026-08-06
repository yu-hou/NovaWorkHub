import type { Metadata } from "next";

import { UnavailableView } from "@/components/home/UnavailableView";

export const metadata: Metadata = {
  title: "AI 直播共学回放｜Nova",
  description: "Nova AI 直播共学回放与复盘资料。",
};

export default function ReplaysPage() {
  return <UnavailableView title="直播回放暂未开放" />;
}
