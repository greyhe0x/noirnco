import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-body font-semibold text-caption px-3 py-1",
  {
    variants: {
      variant: {
        primary:  "bg-primary/10 text-primary-dark",
        success:  "bg-success-light text-success",
        warning:  "bg-warning-light text-warning",
        error:    "bg-error-light text-error",
        neutral:  "bg-gray-100 text-gray-700",
        dark:     "bg-secondary text-white",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
