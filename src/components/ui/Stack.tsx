import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StackProps = {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg" | "xl";
};

const gapClasses = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

export function Stack({ children, className, gap = "md" }: StackProps) {
  return <div className={cn("grid", gapClasses[gap], className)}>{children}</div>;
}
