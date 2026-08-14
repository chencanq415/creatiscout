import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
  {
    variants: {
      tone: {
        pink: "bg-soft-pink text-brand-strong",
        teal: "bg-soft-teal text-teal-text",
        olive: "bg-soft-olive text-olive-text",
        amber: "bg-soft-amber text-amber-text",
        blue: "bg-soft-blue text-blue-text",
        lavender: "bg-soft-lavender text-lavender-text",
        gray: "bg-[#F2F1EE] text-slate",
      },
    },
    defaultVariants: { tone: "gray" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
