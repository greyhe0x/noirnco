import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-primary",
  "bg-primary-dark",
  "bg-secondary",
  "bg-secondary-light",
  "bg-[#E8A87C]",
];

interface AvatarGroupProps {
  count?: number;
  size?: "sm" | "md";
  /** Optional real photo URLs — falls back to coloured initials when absent */
  images?: string[];
  className?: string;
}

export function AvatarGroup({ count = 5, size = "md", images, className }: AvatarGroupProps) {
  const dim    = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  const initials = ["AK", "BM", "CL", "DN", "EO"];

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => {
        const src = images?.[i];
        return src ? (
          /* ── Real photo ── */
          <div
            key={i}
            className={cn(
              dim,
              "rounded-full border-2 border-surface overflow-hidden relative flex-shrink-0",
              i > 0 && "-ml-2"
            )}
          >
            <Image
              src={src}
              alt={initials[i]}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          /* ── Coloured initials fallback ── */
          <div
            key={i}
            className={cn(
              dim,
              "rounded-full border-2 border-surface flex items-center justify-center font-heading font-semibold text-white flex-shrink-0",
              AVATAR_COLORS[i % AVATAR_COLORS.length],
              i > 0 && "-ml-2"
            )}
          >
            {initials[i]}
          </div>
        );
      })}
    </div>
  );
}
