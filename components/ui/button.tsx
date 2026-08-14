"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white shadow-cta hover:bg-brand-hover",
        soft: "bg-soft-pink text-brand hover:bg-[#FFD5E2]",
        outline: "border border-border bg-surface text-ink hover:bg-surface-warm",
        ghost: "text-slate hover:bg-surface-warm hover:text-ink",
        teal: "bg-teal text-white hover:bg-[#4AB0A9]",
        olive: "bg-teal text-white hover:bg-[#4AB0A9]",
        danger: "bg-amber text-white hover:bg-[#D88708]",
      },
      size: {
        sm: "h-7 px-3 text-[12px]",
        md: "h-9 px-4",
        lg: "h-11 px-5 text-[14px]",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
