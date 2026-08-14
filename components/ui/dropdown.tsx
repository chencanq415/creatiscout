"use client";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;
export const DropdownMenuGroup = DropdownPrimitive.Group;
export const DropdownMenuPortal = DropdownPrimitive.Portal;

export const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Separator>) => (
  <DropdownPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />
);

export const DropdownMenuContent = ({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Content>) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        // Container
        "z-50 min-w-[200px] origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-hidden rounded-[10px] border border-border bg-surface p-1 shadow-floating",
        // Open / close animation with directional slide
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-1",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-1",
        className,
      )}
      {...props}
    />
  </DropdownPrimitive.Portal>
);

export const DropdownMenuItem = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownPrimitive.Item>) => (
  <DropdownPrimitive.Item
    className={cn(
      // Base
      "group/dd relative flex cursor-pointer select-none items-center gap-2 rounded-[8px] px-3 py-2 text-[13px] text-ink outline-none",
      // Mulerun-like: smooth color + slight translate-x on hover/keyboard focus
      "transition-[background-color,color,transform] duration-150 ease-out",
      "hover:bg-surface-warm hover:translate-x-[1px]",
      "data-[highlighted]:bg-surface-warm data-[highlighted]:translate-x-[1px]",
      "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      className,
    )}
    {...props}
  />
);
