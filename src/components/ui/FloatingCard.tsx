import React from "react";
import { cn } from "@/lib/utils";
import { AvatarGroup } from "./AvatarGroup";

interface FloatingCardProps {
  stat: string;
  label: string;
  subLabel?: string;
  showAvatars?: boolean;
  avatarImages?: string[];
  className?: string;
}

export function FloatingCard({
  stat,
  label,
  subLabel,
  showAvatars = false,
  avatarImages,
  className,
}: FloatingCardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-2xl p-4 shadow-[var(--shadow-card-hover)] border border-gray-100",
        "flex flex-col gap-2 min-w-[160px]",
        className
      )}
    >
      <p
        className="font-heading font-bold text-secondary leading-none"
        style={{ fontSize: "1.75rem" }}
      >
        {stat}
      </p>
      <p className="font-body font-semibold text-secondary" style={{ fontSize: "0.8125rem" }}>
        {label}
      </p>
      {subLabel && (
        <p className="font-body text-gray-500" style={{ fontSize: "0.75rem" }}>
          {subLabel}
        </p>
      )}
      {showAvatars && <AvatarGroup count={4} size="sm" images={avatarImages} />}
    </div>
  );
}
