import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-[4px] border border-input-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-greptile-green focus-visible:ring-1 focus-visible:ring-greptile-green/40 disabled:cursor-not-allowed disabled:opacity-50 font-sans",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
