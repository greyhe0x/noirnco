"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChipStepProps {
  options: readonly string[];
  onPick: (value: string) => void;
  columns?: 2 | 3;
}

export function ChipStep({ options, onPick, columns = 3 }: ChipStepProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2.5",
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      )}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onPick(opt)}
          className={cn(
            "px-4 py-3.5 rounded-xl border text-left font-body font-medium",
            "transition-all duration-150 cursor-pointer",
            "border-gray-200 text-secondary",
            "hover:border-primary hover:bg-primary/[0.04] hover:text-primary"
          )}
          style={{ fontSize: "0.875rem" }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
