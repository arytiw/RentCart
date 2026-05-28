"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";
import { cn } from "@/app/lib/cn";

import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  isAuthModal?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  isAuthModal = false,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => setShowModal(isOpen), [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disabled) handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, disabled]);

  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(() => onClose(), 280);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;
    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) return null;

  // ===== AUTH split-screen layout (premium) =====
  if (isAuthModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-ink/60 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
        data-testid="auth-modal-overlay"
      >
        <div
          className={cn(
            "relative w-full max-w-5xl max-h-[94vh] flex bg-white rounded-3xl shadow-lift overflow-hidden",
            "transition-all duration-300 ease-out",
            showModal ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-[0.98]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Brand panel */}
          <aside className="hidden lg:flex lg:w-[44%] relative bg-ink text-white p-10 flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-radial-brand" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
            <div className="absolute top-1/3 -left-12 h-44 w-44 rounded-full bg-brand/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
                    <path d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.55h8.2a2 2 0 0 0 1.96-1.6L21 8H6"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                    <circle cx="17" cy="20" r="1.4" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-display font-bold text-xl tracking-tighter2">
                  Rent<span className="text-brand">Cart</span>
                </span>
              </div>

              <h2 className="relative mt-16 font-display font-semibold text-4xl tracking-tighter2 leading-[1.1]">
                Rent <span className="text-brand">anything.</span>
                <br /> Anytime.
              </h2>
              <p className="relative mt-4 text-sm text-ink-300 leading-relaxed max-w-sm">
                Join thousands of users who trust RentCart for quality items,
                verified owners and instant booking.
              </p>

              <ul className="relative mt-8 space-y-3.5 text-sm">
                <li className="flex items-center gap-3 text-ink-200">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                    <FaShieldAlt size={12} className="text-brand" />
                  </span>
                  100% verified items & secure payments
                </li>
                <li className="flex items-center gap-3 text-ink-200">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                    <FaClock size={12} className="text-brand" />
                  </span>
                  24/7 instant booking
                </li>
                <li className="flex items-center gap-3 text-ink-200">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                    <FaUsers size={12} className="text-brand" />
                  </span>
                  Trusted community of renters
                </li>
              </ul>
            </div>

            <div className="relative grid grid-cols-3 gap-4 pt-6 border-t border-white/10 mt-8">
              <Stat label="Happy users" value="10K+" />
              <Stat label="Items rented" value="50K+" />
              <Stat label="Satisfaction" value="99%" />
            </div>
          </aside>

          {/* Right: Form panel */}
          <div className="w-full lg:w-[56%] relative flex flex-col p-6 sm:p-10 overflow-y-auto max-h-[94vh]">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-200 hover:bg-ink hover:text-white text-ink-500 transition-all duration-200"
              aria-label="Close modal"
              data-testid="modal-close"
            >
              <IoMdClose size={20} />
            </button>

            <div className="lg:hidden flex items-center gap-2 mb-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.55h8.2a2 2 0 0 0 1.96-1.6L21 8H6"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-display font-bold text-lg text-ink">
                Rent<span className="text-brand">Cart</span>
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center min-h-0 mt-4">
              {title && (
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-2">
                    Account
                  </p>
                  <h2 className="font-display font-semibold text-3xl tracking-tighter2 text-ink">
                    {title}
                  </h2>
                </div>
              )}

              <div>{body}</div>

              <div className="mt-6">
                {actionLabel && actionLabel.trim() !== "" && (
                  <div className="flex items-center gap-3 mb-4">
                    {secondaryAction && secondaryActionLabel && (
                      <Button
                        disabled={disabled}
                        label={secondaryActionLabel}
                        onClick={handleSecondaryAction}
                        outline
                      />
                    )}
                    <Button disabled={disabled} label={actionLabel} onClick={handleSubmit} />
                  </div>
                )}
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Regular modal (premium) =====
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/60 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
      data-testid="modal-overlay"
    >
      <div
        className={cn(
          "relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-lift overflow-hidden",
          "transition-all duration-300 ease-out",
          showModal ? "translate-y-0 opacity-100 scale-100" : "translate-y-6 opacity-0 scale-[0.98]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-ink-100">
          <button
            onClick={handleClose}
            className="absolute left-3 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200 text-ink-500 transition-colors"
            aria-label="Close modal"
            data-testid="modal-close"
          >
            <IoMdClose size={18} />
          </button>
          <h3 className="font-display font-semibold text-base text-ink truncate">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{body}</div>

        {/* Footer */}
        {(actionLabel?.trim() || footer) && (
          <div className="px-6 py-4 border-t border-ink-100 bg-cream-100/40">
            {actionLabel && actionLabel.trim() !== "" && (
              <div className="flex items-center gap-3">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                    outline
                  />
                )}
                <Button disabled={disabled} label={actionLabel} onClick={handleSubmit} />
              </div>
            )}
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="font-display font-bold text-2xl text-white">{value}</div>
    <div className="text-[11px] uppercase tracking-wider text-ink-400 mt-0.5">
      {label}
    </div>
  </div>
);

export default Modal;
