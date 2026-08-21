"use client";
import { useT } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import {
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  FileText,
  Handshake,
  Palette,
  Rocket,
  Search,
  Smile,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "./account-menu";

const navItems = [
  { href: "/campaigns", labelKey: "nav.campaigns", icon: FileText },
  { href: "/creators", labelKey: "nav.creators", icon: Search },
  { href: "/collaborations", labelKey: "nav.collaborations", icon: Handshake },
  { href: "/insights", labelKey: "nav.insights", icon: ChartNoAxesCombined },
  { href: "/creative", labelKey: "nav.creative", icon: Palette },
  { href: "/ai-tools", labelKey: "nav.aiTools", icon: Sparkles },
  {
    href: "/employees",
    labelKey: "nav.employees",
    icon: Smile,
    employee: true,
  },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const t = useT();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const expanded = !collapsed;

  return (
    <aside
      className={cn(
        "flex h-full flex-shrink-0 flex-col bg-page transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[212px]",
      )}
    >
      {/* Brand — the sidebar control stays secondary to the logo */}
      <div
        className={cn(
          "group/brand relative flex h-16 flex-shrink-0 items-center",
          expanded ? "px-3" : "justify-center px-2",
        )}
      >
        <Link
          href="/campaigns"
          aria-label="CreatiScout"
          className={cn("flex min-w-0 items-center", expanded ? "flex-1 gap-2" : "flex-shrink-0")}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/logo.png`}
            alt="CreatiScout"
            className={cn("flex-shrink-0 object-contain", expanded ? "h-8 w-8" : "h-7 w-7")}
          />
          {expanded && (
            <span className="whitespace-nowrap text-[16px] font-bold tracking-tight text-navy">
              CreatiScout
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "absolute z-20 flex items-center justify-center text-muted transition-all hover:text-ink focus-visible:opacity-100 focus-visible:outline-none",
            expanded
              ? "right-2 h-7 w-6 rounded-[7px] bg-page/80 opacity-0 hover:bg-surface-warm group-hover/brand:opacity-100"
              : "-right-2.5 top-1/2 h-7 w-5 -translate-y-1/2 rounded-full border border-border bg-white opacity-60 shadow-sm hover:opacity-100",
          )}
        >
          {expanded ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col space-y-0.5 px-2 py-2">
        {navItems.map((item) => {
          const active = item.employee
            ? pathname.startsWith("/employees") || pathname.startsWith("/employee")
            : item.href === "/creators"
              ? pathname.startsWith("/creators") || pathname.startsWith("/pool")
              : item.href === "/ai-tools"
                ? pathname.startsWith("/ai-tools") ||
                  pathname.startsWith("/tracking") ||
                  pathname.startsWith("/context-lab")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              icon={<Icon className="h-[18px] w-[18px] flex-shrink-0" />}
              label={t(item.labelKey)}
              active={active}
              expanded={expanded}
              dot={item.employee}
            />
          );
        })}
      </nav>

      {/* Onboarding — separate from the main navigation */}
      <div className={cn("border-t border-border", expanded ? "px-2.5 py-2.5" : "px-2 py-2.5")}>
        <Tooltip label={t("nav.onboarding")} disabled={expanded}>
          <Link
            href="/onboarding"
            className={cn(
              "group flex min-h-10 w-full items-center rounded-[10px] border transition-all",
              expanded ? "gap-2.5 px-2.5 py-2" : "h-10 justify-center px-0",
              pathname.startsWith("/onboarding")
                ? "border-brand/25 bg-soft-pink text-brand"
                : "border-border bg-surface text-slate hover:border-border-strong hover:text-ink",
            )}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[7px] bg-[linear-gradient(135deg,#fff0f5,#e8f6f4)] text-brand">
              <Rocket className="h-3.5 w-3.5" />
            </span>
            {expanded && (
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[11.5px] font-semibold">
                  {t("nav.onboarding")}
                </span>
                <span className="mt-0.5 block text-[8.5px] text-muted">
                  {t("nav.onboardingHint")}
                </span>
              </span>
            )}
          </Link>
        </Tooltip>
      </div>

      {/* Bottom — Account menu */}
      <div className={cn("border-t border-border", expanded ? "p-2.5" : "p-2")}>
        <AccountMenu collapsed={!expanded} />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
  expanded,
  badge,
  dot,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  expanded: boolean;
  badge?: number;
  dot?: boolean;
}) {
  return (
    <Tooltip label={label} disabled={expanded}>
      <Link
        href={href}
        className={cn(
          "relative flex h-10 items-center rounded-[8px] text-[13px] font-medium transition-colors",
          expanded ? "gap-3 px-3" : "justify-center",
          active ? "bg-soft-pink text-brand" : "text-slate hover:bg-surface-warm hover:text-ink",
        )}
      >
        {active && expanded && (
          <span
            className="absolute -left-2 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand"
            aria-hidden
          />
        )}
        {icon}
        {expanded && (
          <>
            <span className="flex-1 whitespace-nowrap">{label}</span>
            {badge ? (
              <span className="tabular rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                {badge}
              </span>
            ) : null}
            {dot && <span className="h-2 w-2 rounded-full bg-teal" />}
          </>
        )}
      </Link>
    </Tooltip>
  );
}

function Tooltip({
  label,
  disabled,
  children,
}: {
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) return <>{children}</>;
  return (
    <div className="group/tt relative">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-navy px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-elev transition-opacity duration-150 group-hover/tt:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}
