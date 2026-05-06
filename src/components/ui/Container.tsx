import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidths = {
  sm:   "max-w-2xl",
  md:   "max-w-4xl",
  lg:   "max-w-5xl",
  xl:   "max-w-7xl",
  full: "max-w-full",
} as const;

export function Container({ size = "xl", className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6 md:px-10 xl:px-16",
        maxWidths[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
