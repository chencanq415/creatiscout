"use client";
import { Calendar, HelpCircle, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";

const L = {
  expandSidebar: { zh: "展开侧边栏", en: "Expand sidebar" },
  collapseSidebar: { zh: "折叠侧边栏", en: "Collapse sidebar" },
  closeEmployeePanel: { zh: "关闭数字员工侧板", en: "Close digital employee panel" },
  openEmployeePanel: { zh: "唤起数字员工", en: "Open digital employee" },
  closeEmployee: { zh: "关闭数字员工", en: "Close digital employee" },
  openEmployeeShortcut: { zh: "⌘K 唤起数字员工", en: "⌘K Open digital employee" },
} as const;

export function Topbar() {
  const l = useLoc();
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const openChat = useUIStore((s) => s.openChat);
  const closeChat = useUIStore((s) => s.closeChat);
  const chatOpen = useUIStore((s) => s.chatOpen);

  return (
    <header className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-border bg-surface px-5">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? l(L.expandSidebar) : l(L.collapseSidebar)}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div />

      <div className="flex items-center gap-3 text-slate">
        <button
          type="button"
          onClick={() => (chatOpen ? closeChat() : openChat())}
          aria-label={chatOpen ? l(L.closeEmployeePanel) : l(L.openEmployeePanel)}
          title={chatOpen ? l(L.closeEmployee) : l(L.openEmployeeShortcut)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors",
            chatOpen ? "bg-soft-pink text-brand" : "hover:bg-surface-warm hover:text-ink",
          )}
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-surface-warm hover:text-ink"
        >
          <Calendar className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-surface-warm hover:text-ink"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soft-lavender text-[11px] font-semibold text-lavender-text">
          AM
        </div>
      </div>
    </header>
  );
}
