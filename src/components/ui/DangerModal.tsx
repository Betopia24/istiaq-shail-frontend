"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export interface DangerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "trash" | "warning";
  isLoading?: boolean;
}

export function DangerModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmText = "Delete Permanently",
  cancelText = "Cancel",
  icon = "trash",
  isLoading = false,
}: DangerModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="danger-modal-title"
            aria-describedby="danger-modal-desc"
            className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 p-5 sm:p-7 overflow-hidden z-10"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Content */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Danger Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                {icon === "trash" ? (
                  <Trash2 className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  id="danger-modal-title"
                  className="font-heading font-semibold text-lg text-slate-900 tracking-tight"
                >
                  {title}
                </h3>
                <p
                  id="danger-modal-desc"
                  className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed"
                >
                  {description}
                </p>
              </div>
            </div>

            {/* Optional Highlight Box showing item name */}
            {itemName && (
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 truncate font-mono">
                  {itemName}
                </span>
              </div>
            )}

            {/* Warning Note */}
            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-rose-600 bg-rose-50/70 border border-rose-100 px-3 py-2 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Warning: This destructive action cannot be undone.</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 stroke-[2]" />
                )}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
