"use client";

import { useEffect, useRef } from "react";

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PaymentModal({ open, onClose }: PaymentModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("modal-open", open);
    if (open) {
      panelRef.current?.focus();
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="payment-modal"
      id="paymentModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paymentModalTitle"
      aria-describedby="paymentModalSub"
      style={{
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="payment-modal-panel" tabIndex={-1} ref={panelRef}>
        <div className="payment-modal-head">
          <div>
            <span className="eyebrow">ANNUAL PASS PAYMENT</span>
            <h3 id="paymentModalTitle">购买年度通票</h3>
            <p id="paymentModalSub">扫码完成付款后，请联系社群管理员开通会员权限</p>
          </div>
          <button
            className="payment-modal-close"
            type="button"
            aria-label="关闭弹窗"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="payment-qr-image-wrap">
          <img
            className="payment-qr-image"
            src="/images/nova/placeholder.svg"
            alt="年度通票付款二维码占位"
          />
        </div>
      </div>
    </div>
  );
}
