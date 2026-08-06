import type { Metadata } from "next";

import { UnavailableView } from "@/components/home/UnavailableView";

export const metadata: Metadata = {
  title: "AI 共学活动｜Nova",
  description: "Nova AI 共学活动，包括训练营、实战比赛、线下组局和主题分享。",
};

export default function EventsPage() {
  return <UnavailableView title="活动暂未开放" />;
}
