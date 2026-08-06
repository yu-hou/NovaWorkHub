import type { Metadata } from "next";

import { UnavailableView } from "@/components/home/UnavailableView";

export const metadata: Metadata = {
  title: "Nova 会员福利",
  description: "Nova 会员资源与福利。",
};

export default function BenefitsPage() {
  return <UnavailableView title="会员福利暂未开放" />;
}
