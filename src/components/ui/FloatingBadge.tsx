import React from "react";
import { cn } from "@/lib/utils";

interface FloatingBadgeProps {
  icon?: React.ReactNode;
  label: string;
  className?: string;
}

export function FloatingBadge({ icon, label, className }: FloatingBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-surface rounded-full px-4 py-2 shadow-[var(--shadow-card-hover)]",
        "border border-gray-100",
        className
      )}
    >
      {/* {icon && (
        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </span>
      )} */}
      <span className="font-body font-medium text-secondary whitespace-nowrap" style={{ fontSize: "0.8125rem" }}>
        {label}
      </span>
    </div>
  );
}
