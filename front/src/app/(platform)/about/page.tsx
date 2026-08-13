import type { Metadata } from "next";

import AboutView from "@/components/sites/front-design-local-78b686af/shared/AboutView";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "关于 AgentWork｜AI Agent 实战学习社群",
  description: "了解 AgentWork AI 实战学习社群。",
};

export default function AboutPage() {
  return (
    <FrontDesignShell page="about">
      <AboutView />
    </FrontDesignShell>
  );
}
