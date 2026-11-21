import React from "react";

interface StatsSkeletonProps {
  count?: number;
  className?: string;
}

export const StatsSkeleton: React.FC<StatsSkeletonProps> = ({
  count = 4,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-slate-200 rounded w-24" />
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
          </div>
          <div className="h-8 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-100 rounded w-32" />
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;
