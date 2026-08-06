import type { Metadata } from "next";

import { UnavailableView } from "@/components/home/UnavailableView";

export const metadata: Metadata = {
  title: "关于 Nova｜AI Agent 实战学习社群",
  description: "了解 Nova AI 实战学习社群。",
};

export default function AboutPage() {
  return <UnavailableView title="关于页暂未开放" />;
}
