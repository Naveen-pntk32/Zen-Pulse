import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-mono uppercase tracking-wider font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-greptile-green disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-greptile-green text-black border border-greptile-green hover:bg-[#3ef2ab] hover:border-[#3ef2ab] shadow-[0_0_16px_rgba(40,233,159,0.25)] hover:shadow-[0_0_24px_rgba(40,233,159,0.4)]",
        destructive:
          "bg-bloom/15 border border-bloom/40 text-bloom hover:bg-bloom/25 hover:border-bloom",
        outline:
          "border border-slate-700 bg-surface text-foreground hover:bg-greptile-green/10 hover:border-greptile-green/60 hover:text-greptile-green",
        secondary:
          "bg-surface-elevated text-foreground border border-border hover:bg-surface-hover hover:border-border-strong",
        ghost:
          "text-foreground/80 hover:bg-surface-hover hover:text-greptile-green",
        link:
          "text-greptile-green underline-offset-4 hover:underline lowercase font-sans",
        notch:
          "bg-greptile-green text-black btn-notch hover:bg-[#3ef2ab] shadow-[0_0_16px_rgba(40,233,159,0.25)]",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-[4px]",
        sm: "h-8 px-3 text-[11px] rounded-[3px]",
        lg: "h-11 px-6 text-sm rounded-[6px]",
        icon: "h-9 w-9 rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
