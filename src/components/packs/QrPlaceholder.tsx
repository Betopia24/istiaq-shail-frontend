import React from "react";
import { QrCode } from "lucide-react";

interface QrPlaceholderProps {
  value?: string;
  size?: number;
  className?: string;
  label?: string;
}

export const QrPlaceholder: React.FC<QrPlaceholderProps> = ({
  value = "https://propertypack.ai/property/demo",
  size = 180,
  className = "",
  label = "Scan for interactive property brochure",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 shadow-xs ${className}`}
      style={{ maxWidth: size + 40 }}
    >
      {/* Visual Placeholder QR pattern */}
      <div
        className="relative bg-slate-50 border-2 border-slate-900 rounded-xl p-2.5 flex flex-col items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* Corner positioning squares */}
        <div className="absolute top-2 left-2 w-7 h-7 border-4 border-slate-900 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-900" />
        </div>
        <div className="absolute top-2 right-2 w-7 h-7 border-4 border-slate-900 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-900" />
        </div>
        <div className="absolute bottom-2 left-2 w-7 h-7 border-4 border-slate-900 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-900" />
        </div>

        {/* Center decorative mock pattern */}
        <div className="flex flex-col items-center justify-center gap-1 text-slate-800">
          <QrCode className="w-12 h-12 stroke-[1.5] text-[#092167]" />
          <span className="text-[9px] font-mono font-bold tracking-tight bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">
            QR PLACEHOLDER
          </span>
        </div>
      </div>

      {label && (
        <p className="text-[11px] font-medium text-slate-500 text-center mt-2.5 leading-tight">
          {label}
        </p>
      )}
      <p className="text-[9px] font-mono text-slate-400 mt-1 truncate max-w-full">
        {value}
      </p>
    </div>
  );
};

export default QrPlaceholder;
