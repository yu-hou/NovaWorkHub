"use client";

import { useEffect, type ReactNode } from "react";

import { ContentGateProvider } from "@/components/auth/ContentGate";
import { AppSidebar } from "@/components/home/AppSidebar";
import { MobileBottomNav } from "@/components/home/MobileBottomNav";

type PlatformShellProps = {
  children: ReactNode;
};

export function PlatformShell({ children }: PlatformShellProps) {
  useEffect(() => {
    document.body.classList.add("home-app");
    return () => {
      document.body.classList.remove("home-app");
    };
  }, []);

  return (
    <ContentGateProvider>
      <div className="bg-cosmos" aria-hidden="true" />
      <div className="app-shell">
        <AppSidebar />
        <main className="main-panel">{children}</main>
        <MobileBottomNav />
      </div>
    </ContentGateProvider>
  );
}
