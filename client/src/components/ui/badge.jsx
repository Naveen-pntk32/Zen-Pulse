import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[3px] border px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-greptile-green",
  {
    variants: {
      variant: {
        default:
          "border-greptile-green/40 bg-greptile-green/10 text-greptile-green",
        secondary:
          "border-border bg-surface-raised text-foreground/80",
        destructive:
          "border-bloom/40 bg-bloom/10 text-bloom",
        outline:
          "border-border text-foreground/70",
        neon:
          "border-neon/40 bg-neon/10 text-neon",
        sky:
          "border-sky/40 bg-sky/10 text-sky",
        coral:
          "border-coral/40 bg-coral/10 text-coral",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
