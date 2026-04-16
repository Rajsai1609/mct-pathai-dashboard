import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-violet-600/30 text-violet-300",
        secondary: "border-transparent bg-white/10 text-slate-300",
        outline: "text-slate-400 border-white/20",
        success: "border-transparent bg-green-500/20 text-green-400",
        warning: "border-transparent bg-amber-500/20 text-amber-400",
        destructive: "border-transparent bg-red-500/20 text-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
