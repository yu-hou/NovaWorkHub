import type { Metadata } from "next";

import { UnavailableView } from "@/components/home/UnavailableView";

export const metadata: Metadata = {
  title: "AI 自动化实战案例｜Nova",
  description: "Nova AI 自动化实战案例库，收录项目拆解、成员作品和真实场景复盘。",
};

export default function CasesPage() {
  return <UnavailableView title="案例暂未开放" />;
}
