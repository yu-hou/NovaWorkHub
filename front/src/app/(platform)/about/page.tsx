import type { Metadata } from "next";

import { AboutView } from "@/components/home/AboutView";
import { PlatformShell } from "@/components/home/PlatformShell";

export const metadata: Metadata = {
  title: "关于 AgentWork｜黄叔、唯庸主理的 AI 实战社群",
  description:
    "了解由黄叔、唯庸共同主理的 AgentWork AI 自动化实战学习社群、学习内容、访问规则与联系方式。",
};

export default function AboutPage() {
  return (
    <PlatformShell>
      <AboutView />
    </PlatformShell>
  );
}
