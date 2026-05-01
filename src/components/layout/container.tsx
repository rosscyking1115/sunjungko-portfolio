import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the max width. Default 6xl matches the editorial body width. */
  size?: "default" | "narrow" | "wide";
}

const sizeClass = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
} as const;

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6 md:px-8", sizeClass[size], className)}
      {...props}
    />
  );
}
