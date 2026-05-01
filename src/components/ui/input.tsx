import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "border-input bg-background text-foreground placeholder:text-muted-foreground flex h-11 w-full rounded-sm border px-3 py-2 text-sm transition-colors",
      "focus-visible:border-foreground focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-[invalid=true]:border-destructive",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
