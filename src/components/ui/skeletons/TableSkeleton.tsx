import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse ${className}`}
    >
      {/* Table Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="h-5 w-40 bg-slate-200 rounded-md" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="flex items-center justify-between py-3 px-2 border-b border-slate-50 gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-sm">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/2" />
              </div>
            </div>

            {Array.from({ length: columns - 1 }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-3.5 bg-slate-200 rounded w-20 hidden sm:block"
              />
            ))}

            <div className="h-7 w-16 bg-slate-100 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
