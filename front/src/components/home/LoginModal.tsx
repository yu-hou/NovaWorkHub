"use client";

import { useEffect } from "react";

import { LoginForm } from "@/components/home/LoginForm";

type LoginModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
};

export function LoginModal({
  open,
  title = "邮箱登录",
  onClose,
}: LoginModalProps) {
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
      aria-labelledby="loginModalTitle"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <div className="section-title">
          <div>
            <h3 id="loginModalTitle">{title}</h3>
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
        <div>
          <div className="login-modal-mount">
            <LoginForm
              title="邮箱登录"
              onSuccess={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
