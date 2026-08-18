"use client";
import {
  Binoculars,
  FileText,
  FlaskConical,
  Mail,
  Search,
  Handshake,
  Plus,
  Smile,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account-menu";

const navItems = [
  { href: "/campaigns", labelKey: "nav.campaigns", icon: FileText },
  { href: "/creators", labelKey: "nav.creators", icon: Search },
  { href: "/collaborations", labelKey: "nav.collaborations", icon: Handshake },
  { href: "/tracking", labelKey: "nav.tracking", icon: Binoculars },
  { href: "/context-lab", labelKey: "nav.contextLab", icon: FlaskConical },
  { href: "/pool", labelKey: "nav.pool", icon: Users },
  { href: "/mail", labelKey: "nav.mail", icon: Mail, badge: 2 },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const t = useT();
  const openChat = useUIStore((s) => s.openChat);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const expanded = !collapsed;

  return (
    <aside
      className={cn(
        "flex h-full flex-shrink-0 flex-col bg-page transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[212px]",
      )}
    >
      {/* Logo */}
      <Link
        href="/campaigns"
        className={cn(
          "flex items-center py-4",
          expanded ? "gap-2 px-[14px]" : "justify-center px-0",
        )}
      >
        <img
          src="/brand/logo.png"
          alt="CreatiScout"
          className="h-8 w-8 flex-shrink-0 object-contain"
        />
        {expanded && (
          <span className="whitespace-nowrap text-[16px] font-bold tracking-tight text-navy">
            CreatiScout
          </span>
        )}
      </Link>

      {/* New Task CTA */}
      <div className={cn("pb-2 pt-1", expanded ? "px-2.5" : "px-2")}>
        <Tooltip label={t("common.newTask")} disabled={expanded}>
          <button
            type="button"
            onClick={() => openChat()}
            aria-label={t("common.newTask")}
            className={cn(
              "flex w-full items-center rounded-md bg-brand text-white shadow-cta transition-colors hover:bg-brand-hover",
              expanded ? "h-8 gap-2 px-3" : "h-8 justify-center",
            )}
          >
            <Plus className="h-3.5 w-3.5 flex-shrink-0" />
            {expanded && (
              <span className="whitespace-nowrap text-[12.5px] font-medium">
                {t("common.newTask")}
              </span>
            )}
          </button>
        </Tooltip>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col space-y-0.5 px-2 py-2">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              icon={<Icon className="h-[18px] w-[18px] flex-shrink-0" />}
              label={t(item.labelKey)}
              active={active}
              expanded={expanded}
              badge={item.badge}
            />
          );
        })}

        <div className="mt-auto pt-4">
          <div className="mb-2 border-t border-border" />
          <NavLink
            href="/employees"
            icon={<Smile className="h-[18px] w-[18px] flex-shrink-0" />}
            label={t("nav.employees")}
            active={pathname.startsWith("/employees") || pathname.startsWith("/employee")}
            expanded={expanded}
            dot
          />
        </div>
      </nav>

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
