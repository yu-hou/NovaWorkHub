"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type GateContextValue = {
  openLogin: (title?: string) => void;
  openMemberGate: () => void;
};

const GateContext = createContext<GateContextValue | null>(null);

function MemberGateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal login-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="memberGateTitle"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <div className="section-title">
          <div>
            <h3 id="memberGateTitle">会员专享内容</h3>
          </div>
          <button
            className="modal-close-icon"
            type="button"
            aria-label="关闭弹窗"
            onClick={onClose}
          >
            <svg
              className="modal-close-svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <section className="login-card">
          <h2>需要开通会员</h2>
          <p className="sub">
            该课程为会员专享。请前往官网会员区联系管理员开通，或请管理员在后台将你标记为会员。
          </p>
          <div className="form-grid mt-12">
            <Link href="/home">进入工作台开通席位</Link>
            <button type="button" onClick={onClose}>
              我知道了
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ContentGateProvider({ children }: { children: ReactNode }) {
  const [memberOpen, setMemberOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const openLogin = useCallback(() => {
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);

  const openMemberGate = useCallback(() => {
    setMemberOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openLogin, openMemberGate }),
    [openLogin, openMemberGate],
  );

  return (
    <GateContext.Provider value={value}>
      {children}
      <MemberGateModal open={memberOpen} onClose={() => setMemberOpen(false)} />
    </GateContext.Provider>
  );
}

export function useContentGate() {
  const ctx = useContext(GateContext);
  if (!ctx) {
    throw new Error("useContentGate must be used within ContentGateProvider");
  }
  return ctx;
}
