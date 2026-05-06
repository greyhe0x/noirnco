"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold font-body",
    "rounded-full",
    "transition-all duration-200",
    "cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-white",
          "hover:bg-primary-dark",
          "focus-visible:ring-primary",
          "shadow-[0_4px_24px_0_rgba(252,136,62,0.32)]",
          "hover:shadow-[0_6px_32px_0_rgba(252,136,62,0.45)]",
        ].join(" "),
        secondary: [
          "bg-transparent text-primary border-2 border-primary",
          "hover:bg-primary hover:text-white",
          "focus-visible:ring-primary",
        ].join(" "),
        tertiary: [
          "bg-transparent text-primary",
          "hover:bg-primary/10",
          "focus-visible:ring-primary",
          "underline-offset-4 hover:underline",
        ].join(" "),
        dark: [
          "bg-secondary text-white",
          "hover:bg-secondary-light",
          "focus-visible:ring-secondary",
        ].join(" "),
        ghost: [
          "bg-transparent text-secondary",
          "hover:bg-gray-100",
          "focus-visible:ring-gray-400",
        ].join(" "),
      },
      size: {
        sm:  "h-9  px-4 text-sm",
        md:  "h-11 px-6 text-base",
        lg:  "h-13 px-8 text-lg",
        xl:  "h-15 px-10 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
