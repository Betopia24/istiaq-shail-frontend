import React from "react";

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  count = 6,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
        >
          {/* Card Media Header */}
          <div className="h-44 bg-slate-200 w-full relative">
            <div className="absolute top-3 left-3 h-5 w-20 bg-slate-300 rounded-md" />
            <div className="absolute top-3 right-3 h-7 w-7 bg-slate-300 rounded-lg" />
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3 bg-slate-100 rounded w-20" />
              <div className="h-8 bg-slate-200 rounded-lg w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridSkeleton;
