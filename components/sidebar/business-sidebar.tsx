"use client";
import { useT } from "@/lib/i18n/use-i18n";
import { type DiscoverSections, useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import {
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  FileText,
  Handshake,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Radar,
  Rocket,
  Search,
  Smile,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountMenu } from "./account-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";

type NavItem = {
  href: string;
  labelKey: string;
  icon: typeof Search;
  employee?: boolean;
};

type DiscoverArea = keyof DiscoverSections;
type DiscoverSectionId = DiscoverSections[DiscoverArea];
type DiscoverNavItem = NavItem & {
  area: DiscoverArea;
  children: Array<{ id: DiscoverSectionId; labelKey: string }>;
};

const campaignNavItems: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/campaigns", labelKey: "nav.campaigns", icon: FileText },
  { href: "/creators", labelKey: "nav.creators", icon: Search },
  { href: "/collaborations", labelKey: "nav.collaborations", icon: Handshake },
  { href: "/insights", labelKey: "nav.insights", icon: ChartNoAxesCombined },
  { href: "/creative", labelKey: "nav.creative", icon: Palette },
  { href: "/brand-insights", labelKey: "nav.brandInsights", icon: Radar },
  {
    href: "/employees",
    labelKey: "nav.employees",
    icon: Smile,
    employee: true,
  },
];

const discoverNavItems: DiscoverNavItem[] = [
  {
    href: "/creators",
    labelKey: "nav.creators",
    icon: Search,
    area: "creators",
    children: [
      { id: "discovery", labelKey: "nav.creatorDiscovery" },
      { id: "outreach", labelKey: "nav.creatorOutreach" },
      { id: "private", labelKey: "nav.creatorPrivate" },
    ],
  },
  {
    href: "/brand-insights",
    labelKey: "nav.brandInsights",
    icon: Radar,
    area: "brandRadar",
    children: [
      { id: "explore", labelKey: "nav.brandExplore" },
      { id: "competitors", labelKey: "nav.brandCompetitors" },
    ],
  },
  {
    href: "/creative",
    labelKey: "nav.creative",
    icon: Palette,
    area: "creative",
    children: [
      { id: "calendar", labelKey: "nav.creativeCalendar" },
      { id: "trends", labelKey: "nav.creativeTrends" },
      { id: "ai-tools", labelKey: "nav.creativeAiTools" },
    ],
  },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const productMode = useUIStore((s) => s.productMode);
  const setProductMode = useUIStore((s) => s.setProductMode);
  const discoverSections = useUIStore((s) => s.discoverSections);
  const setDiscoverSection = useUIStore((s) => s.setDiscoverSection);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const expanded = !collapsed;
  const [expandedDiscoverItem, setExpandedDiscoverItem] = useState<DiscoverArea>("creators");

  useEffect(() => {
    const savedMode = window.localStorage.getItem("creatiscout-product-mode");
    if (savedMode === "discover" || savedMode === "campaign") {
      setProductMode(savedMode);
    }
  }, [setProductMode]);

  useEffect(() => {
    if (pathname.startsWith("/brand-insights")) setExpandedDiscoverItem("brandRadar");
    else if (pathname.startsWith("/creative")) setExpandedDiscoverItem("creative");
    else if (pathname.startsWith("/creators") || pathname.startsWith("/pool")) {
      setExpandedDiscoverItem("creators");
    }
  }, [pathname]);

  const changeProductMode = (mode: "discover" | "campaign") => {
    if (mode === productMode) return;
    setProductMode(mode);
    window.localStorage.setItem("creatiscout-product-mode", mode);
    if (mode === "discover") {
      setExpandedDiscoverItem("creators");
      setDiscoverSection("creators", "discovery");
    }
    router.push(mode === "discover" ? "/creators" : "/dashboard");
  };

  const selectDiscoverSection = (area: DiscoverArea, section: DiscoverSectionId) => {
    if (area === "creators") {
      setDiscoverSection("creators", section as DiscoverSections["creators"]);
    } else if (area === "brandRadar") {
      setDiscoverSection("brandRadar", section as DiscoverSections["brandRadar"]);
    } else {
      setDiscoverSection("creative", section as DiscoverSections["creative"]);
    }
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-shrink-0 flex-col bg-page transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[212px]",
      )}
    >
      {/* Brand and product switcher */}
      <div
        className={cn(
          "flex h-16 flex-shrink-0 items-center",
          expanded ? "px-3" : "justify-center px-2",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Switch CreatiScout mode"
              className={cn(
                "flex min-w-0 items-center rounded-[9px] text-left transition-colors hover:bg-surface-warm",
                expanded ? "w-full gap-2 px-1.5 py-1" : "justify-center p-1",
              )}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/logo.png`}
                alt="CreatiScout"
                className={cn("flex-shrink-0 object-contain", expanded ? "h-8 w-8" : "h-7 w-7")}
              />
              {expanded && (
                <>
                  <span className="min-w-0 flex-1 truncate text-[16px] font-bold tracking-tight text-navy">
                    CreatiScout
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={expanded ? "bottom" : "right"}
            align="start"
            className="w-[244px] p-1.5"
          >
            {(["discover", "campaign"] as const).map((mode) => {
              const selected = productMode === mode;
              return (
                <DropdownMenuItem
                  key={mode}
                  onSelect={() => changeProductMode(mode)}
                  className={cn(
                    "items-start px-2.5 py-2.5",
                    mode === "campaign" &&
                      "hover:bg-soft-pink/70 data-[highlighted]:bg-soft-pink/70",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                      <span>{mode === "discover" ? "Discover" : "Campaign"}</span>
                      {mode === "campaign" && (
                        <>
                          <Sparkles className="h-3 w-3 text-brand" />
                          <span className="rounded-full bg-soft-pink px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.08em] text-brand">
                            Beta
                          </span>
                        </>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[9.5px] leading-4 text-muted">
                      {t(mode === "discover" ? "nav.discoverDescription" : "nav.campaignDescription")}
                    </span>
                  </span>
                  {selected && <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col space-y-0.5 px-2 py-2">
        {productMode === "discover" ? discoverNavItems.map((item) => {
          const active = item.href === "/creators"
            ? pathname.startsWith("/creators") || pathname.startsWith("/pool")
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const open = expandedDiscoverItem === item.area;
          return (
            <DiscoverNavGroup
              key={item.area}
              item={item}
              active={active}
              open={open}
              expanded={expanded}
              activeChild={discoverSections[item.area]}
              translate={t}
              onOpen={() => {
                setExpandedDiscoverItem(item.area);
                router.push(item.href);
              }}
              onSelect={(section) => {
                setExpandedDiscoverItem(item.area);
                selectDiscoverSection(item.area, section);
                router.push(item.href);
              }}
              label={t(item.labelKey)}
            />
          );
        }) : campaignNavItems.map((item) => {
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
      {productMode === "campaign" && <div className={cn("border-t border-border", expanded ? "px-2.5 py-2.5" : "px-2 py-2.5")}>
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
      </div>}

      {/* Collapse / expand */}
      <div className={cn("px-2 pb-2", productMode === "campaign" && "pt-1")}>
        <Tooltip label={t(collapsed ? "nav.expandSidebar" : "nav.collapseSidebar")} disabled={expanded}>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={t(collapsed ? "nav.expandSidebar" : "nav.collapseSidebar")}
            className={cn(
              "flex h-9 w-full items-center rounded-[8px] text-[11px] font-medium text-muted transition-colors hover:bg-surface-warm hover:text-ink",
              expanded ? "gap-2.5 px-3" : "justify-center",
            )}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {expanded && <span>{t("nav.collapseSidebar")}</span>}
          </button>
        </Tooltip>
      </div>

      {/* Bottom — Account menu */}
      <div className={cn("border-t border-border", expanded ? "p-2.5" : "p-2")}>
        <AccountMenu collapsed={!expanded} />
      </div>
    </aside>
  );
}

function DiscoverNavGroup({
  item,
  label,
  active,
  open,
  expanded,
  activeChild,
  translate,
  onOpen,
  onSelect,
}: {
  item: DiscoverNavItem;
  label: string;
  active: boolean;
  open: boolean;
  expanded: boolean;
  activeChild: DiscoverSectionId;
  translate: (key: string) => string;
  onOpen: () => void;
  onSelect: (section: DiscoverSectionId) => void;
}) {
  const Icon = item.icon;

  if (!expanded) {
    return (
      <Tooltip label={label}>
        <button
          type="button"
          onClick={onOpen}
          className={cn(
            "relative flex h-10 w-full items-center justify-center rounded-[8px] transition-colors",
            active ? "bg-soft-pink text-brand" : "text-slate hover:bg-surface-warm hover:text-ink",
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </button>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-[8px] px-3 text-[13px] font-medium transition-colors",
          active ? "text-ink" : "text-slate hover:bg-surface-warm hover:text-ink",
        )}
      >
        <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", active && "text-brand")} />
        <span className="flex-1 text-left">{label}</span>
      </button>

      {open && (
        <div className="ml-[21px] space-y-0.5 border-l border-border py-0.5 pl-3">
          {item.children.map((child) => {
            const selected = active && activeChild === child.id;
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => onSelect(child.id)}
                className={cn(
                  "relative flex h-8 w-full items-center rounded-[7px] px-2.5 text-left text-[11.5px] font-medium transition-colors",
                  selected
                    ? "bg-soft-pink text-brand"
                    : "text-muted hover:bg-surface-warm hover:text-ink",
                )}
              >
                {selected && (
                  <span className="absolute -left-[13px] h-4 w-[2px] rounded-r-full bg-brand" aria-hidden />
                )}
                {translate(child.labelKey)}
              </button>
            );
          })}
        </div>
      )}
    </div>
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
