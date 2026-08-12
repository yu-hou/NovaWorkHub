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
    document.body.classList.add("home-app", "workbench-app");
    return () => {
      document.body.classList.remove("home-app", "workbench-app");
    };
  }, []);

  return (
    <ContentGateProvider>
      <div className="app-shell wb-app-shell nova-workspace">
        <AppSidebar />
        <main className="main-panel wb-main-panel">{children}</main>
        <MobileBottomNav />
      </div>
    </ContentGateProvider>
  );
}
