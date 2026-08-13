import type { Metadata } from "next";

import { EventsView } from "@/components/sites/front-design-local-78b686af/shared/CatalogViews";
import FrontDesignShell from "@/components/sites/front-design-local-78b686af/shared/FrontDesignShell";

export const metadata: Metadata = {
  title: "AI 共学活动｜Nova",
  description: "Nova AI 共学活动，包括训练营、实战比赛、线下组局和主题分享。",
};

export default function EventsPage() {
  return (
    <FrontDesignShell page="events">
      <EventsView />
    </FrontDesignShell>
  );
}
