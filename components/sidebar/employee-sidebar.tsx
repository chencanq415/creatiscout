"use client";
import {
  ArrowLeft,
  Bell,
  Brain,
  ChevronDown,
  FolderOpen,
  Home,
  Lock,
  MessageCircle,
  MessageSquare,
  Plug,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoc } from "@/lib/i18n/use-i18n";
import type { Employee } from "@/lib/types";
import { cn } from "@/lib/utils";

const L = {
  backToChat: { zh: "返回对话", en: "Back to chat" },
  onDuty: { zh: "在班", en: "On duty" },
  live: { zh: "Live", en: "Live" },
} as const;

const items = [
  { suffix: "", label: { zh: "首页", en: "Home" }, icon: Home },
  { suffix: "/projects", label: { zh: "项目", en: "Projects" }, icon: FolderOpen },
  { suffix: "/auto-tasks", label: { zh: "自动任务", en: "Auto Tasks" }, icon: Timer },
  { suffix: "/chats", label: { zh: "对话任务", en: "Chat Tasks" }, icon: MessageSquare },
  { suffix: "/memory", label: { zh: "记忆", en: "Memory" }, icon: Brain },
  { suffix: "/skills", label: { zh: "技能", en: "Skills" }, icon: Sparkles },
  { suffix: "/connectors", label: { zh: "连接器", en: "Connectors" }, icon: Plug },
  { suffix: "/im", label: { zh: "IM", en: "IM" }, icon: MessageCircle },
  { suffix: "/permissions", label: { zh: "权限", en: "Permissions" }, icon: Lock },
];

export function EmployeeSidebar({ employee }: { employee: Employee }) {
  const pathname = usePathname();
  const l = useLoc();
  const base = `/employee/${employee.id}`;

  return (
    <aside className="flex h-full w-[212px] flex-shrink-0 flex-col bg-page">
      {/* Back */}
      <div className="px-3 pt-3">
        <Link
          href="/employees"
          className="flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {l(L.backToChat)}
        </Link>
      </div>

      {/* Employee */}
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center gap-2.5 rounded-[10px] border border-border bg-surface px-3 py-2.5">
          <img src={employee.avatar} alt="" className="h-9 w-9 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-semibold text-ink">{employee.name}</div>
            <div className="text-[10px] text-muted">{l(employee.role)}</div>
          </div>
          {employee.online && <span className="h-2 w-2 rounded-full bg-teal" />}
        </div>
      </div>

      <div className="mx-3 my-1 border-t border-border" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2.5 py-2">
        {items.map((it) => {
          const href = base + it.suffix;
          const active = pathname === href || (it.suffix === "" && pathname === base);
          const Icon = it.icon;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex h-10 items-center gap-3 rounded-[8px] px-3 text-[13px] font-medium transition-colors",
                active
                  ? "bg-soft-pink text-brand"
                  : "text-slate hover:bg-surface-warm hover:text-ink",
              )}
            >
              {active && (
                <span
                  className="absolute -left-2.5 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand"
                  aria-hidden
                />
              )}
              <Icon className="h-[18px] w-[18px]" />
              <span>{l(it.label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-3 border-t border-border p-3">
        <div className="flex items-center gap-2 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-navy text-[11px] font-bold text-white">
            KO
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-ink">KOL Ops Team</div>
            <div className="text-[10px] text-muted">
              {l(L.onDuty)} · <span className="text-teal-text">{l(L.live)}</span>
            </div>
          </div>
          <ChevronDown className="h-3 w-3 text-muted" />
        </div>
        <div className="flex items-center gap-5 px-2 text-muted">
          <Settings className="h-4 w-4 cursor-pointer hover:text-ink" />
          <Bell className="h-4 w-4 cursor-pointer hover:text-ink" />
        </div>
      </div>
    </aside>
  );
}
