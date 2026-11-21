"use client";

import React, { useRef, useEffect } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  isError?: boolean;
  autoFocus?: boolean;
  className?: string;
  onComplete?: (code: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  isError = false,
  autoFocus = true,
  className = "",
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index: number, rawChar: string) => {
    // Keep only numeric characters
    const digits = rawChar.replace(/\D/g, "");
    if (!digits && rawChar !== "") return;

    const next = [...value];
    // If user typed or pasted a single character
    next[index] = digits.slice(-1);
    onChange(next);

    // Auto-advance
    if (digits && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((c) => c !== "") && next.length === length) {
      onComplete?.(next.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Move to previous box and clear it
        inputRefs.current[index - 1]?.focus();
        const next = [...value];
        next[index - 1] = "";
        onChange(next);
      } else {
        const next = [...value];
        next[index] = "";
        onChange(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasteData) return;

    const next = [...value];
    for (let i = 0; i < length; i++) {
      next[i] = pasteData[i] || "";
    }
    onChange(next);

    const targetFocusIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[targetFocusIndex]?.focus();

    if (next.every((c) => c !== "") && next.length === length) {
      onComplete?.(next.join(""));
    }
  };

  return (
    <div
      role="group"
      aria-label="Verification Code Input"
      className={`flex items-center justify-between gap-2 sm:gap-3 w-full ${className}`}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="one-time-code"
          disabled={disabled}
          value={value[index] || ""}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={isError ? "true" : "false"}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-11 h-13 sm:w-13 sm:h-14 text-center font-heading font-semibold text-xl sm:text-2xl rounded-xl border transition-all duration-150 outline-none select-none ${
            isError
              ? "border-rose-400 bg-rose-50/50 text-rose-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              : "border-slate-200 bg-white text-slate-900 focus:border-[#092167] focus:ring-2 focus:ring-[#092167]/15"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100" : ""}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
