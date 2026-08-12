"use client";

import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import type { ListPageContent } from "@/lib/platform-content";

type CatalogPreviewPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  pageId: string;
  content: ListPageContent;
  variant?: "content" | "benefit";
  filterLabel: string;
};

export function CatalogPreviewPage({
  eyebrow,
  title,
  description,
  pageId,
  content,
  variant = "content",
  filterLabel,
}: CatalogPreviewPageProps) {
  return (
    <PlatformShell>
      <header className="nova-page-head">
        <div>
          <p className="nova-page-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className="nova-preview-badge">内容预览 · 暂未开放</span>
      </header>
      <ContentListView
        pageId={pageId}
        content={content}
        variant={variant}
        filterLabel={filterLabel}
      />
    </PlatformShell>
  );
}
