import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Heading ─────────────────────────────────────────────────────────────── */
const headingVariants = cva("font-heading tracking-tight", {
  variants: {
    as: {
      h1: "text-h1 leading-[1.15]",
      h2: "text-h2 leading-[1.2]",
      h3: "text-h3 leading-[1.25]",
      h4: "text-h4 leading-[1.3]",
      h5: "text-h5 leading-[1.4]",
      h6: "text-body-lg leading-[1.4]",
    },
    weight: {
      medium:   "font-medium",
      semibold: "font-semibold",
      bold:     "font-bold",
    },
    textColor: {
      default:  "text-secondary",
      primary:  "text-primary",
      white:    "text-white",
      muted:    "text-gray-500",
      gradient: "text-gradient-primary",
    },
  },
  defaultVariants: {
    as:        "h2",
    weight:    "semibold",
    textColor: "default",
  },
});

type HeadingVariantProps = VariantProps<typeof headingVariants>;

interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color"> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  weight?: HeadingVariantProps["weight"];
  color?: HeadingVariantProps["textColor"];
}

export function Heading({ as: Tag = "h2", weight, color, className, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(headingVariants({ as: Tag, weight, textColor: color, className }))}
      {...props}
    />
  );
}

/* ── Body Text ───────────────────────────────────────────────────────────── */
const textVariants = cva("font-body", {
  variants: {
    size: {
      lg:      "text-body-lg leading-relaxed",
      base:    "text-body leading-relaxed",
      sm:      "text-body-sm leading-normal",
      caption: "text-caption leading-normal",
    },
    weight: {
      regular:  "font-normal",
      medium:   "font-medium",
      semibold: "font-semibold",
    },
    textColor: {
      default: "text-secondary-light",
      muted:   "text-gray-500",
      primary: "text-primary",
      white:   "text-white",
    },
  },
  defaultVariants: {
    size:      "base",
    weight:    "regular",
    textColor: "default",
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  as?: "p" | "span" | "div";
  size?: TextVariantProps["size"];
  weight?: TextVariantProps["weight"];
  color?: TextVariantProps["textColor"];
}

export function Text({ as: Tag = "p", size, weight, color, className, ...props }: TextProps) {
  return (
    <Tag
      className={cn(textVariants({ size, weight, textColor: color, className }))}
      {...props}
    />
  );
}

/* ── On-light / on-dark wrappers ─────────────────────────────────────────── */
type Tone = "light" | "dark";
type Emphasis = "default" | "muted";

type HeadingToneProps = Omit<HeadingProps, "color"> & {
  tone?: Tone;
  emphasis?: Emphasis;
};

export function HeadingTone({
  tone = "light",
  emphasis = "default",
  className,
  ...props
}: HeadingToneProps) {
  const color =
    tone === "dark"
      ? "white"
      : emphasis === "muted"
        ? "muted"
        : "default";

  return <Heading {...props} color={color} className={className} />;
}

type TextToneProps = Omit<TextProps, "color"> & {
  tone?: Tone;
  emphasis?: Emphasis;
};

export function TextTone({
  tone = "light",
  emphasis = "default",
  className,
  ...props
}: TextToneProps) {
  if (tone === "dark") {
    // Keep Text API, but allow the common “muted on dark” opacity pattern.
    const darkClass = emphasis === "muted" ? "text-white/60" : "text-white";
    return <Text {...props} color="white" className={cn(darkClass, className)} />;
  }

  const color = emphasis === "muted" ? "muted" : "default";
  return <Text {...props} color={color} className={className} />;
}

export function HeadingOnLight(props: Omit<HeadingToneProps, "tone">) {
  return <HeadingTone {...props} tone="light" />;
}

export function HeadingOnDark(props: Omit<HeadingToneProps, "tone">) {
  return <HeadingTone {...props} tone="dark" />;
}

export function TextOnLight(props: Omit<TextToneProps, "tone">) {
  return <TextTone {...props} tone="light" />;
}

export function TextOnDark(props: Omit<TextToneProps, "tone">) {
  return <TextTone {...props} tone="dark" />;
}

/* ── Label / Eyebrow ─────────────────────────────────────────────────────── */
export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-block text-caption font-semibold font-body uppercase tracking-widest text-primary",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
