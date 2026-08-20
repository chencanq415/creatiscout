"use client";
import {
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Globe,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getOrCreatePlusTrial, getTrialDaysRemaining } from "@/lib/account/trial";
import { useI18nStore } from "@/lib/i18n/use-i18n";
import { useT } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  collapsed?: boolean;
}

export function AccountMenu({ collapsed = false }: AccountMenuProps) {
  const t = useT();
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  const [langOpen, setLangOpen] = useState(false);
  const [trialDays, setTrialDays] = useState(14);

  useEffect(() => {
    const trial = getOrCreatePlusTrial();
    if (trial) setTrialDays(getTrialDaysRemaining(trial));
  }, []);

  const trialLabel =
    trialDays > 0
      ? t("account.trialRemaining").replace("{days}", String(trialDays))
      : t("account.trialExpired");
  const planLabel = trialDays > 0 ? t("account.plusTrial") : t("account.free");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-[10px] border border-transparent bg-surface-warm px-2.5 py-2 text-left transition-colors hover:border-border",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5B3A24] text-[12px] font-bold text-white">
            CS
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-navy ring-2 ring-surface">
              <Sparkles className="h-2 w-2 text-white" />
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-semibold text-ink">
                    Demo Workspace
                  </span>
                  <span className="inline-flex flex-shrink-0 items-center gap-0.5 rounded-full bg-navy/85 px-1.5 py-px text-[10px] font-semibold text-white">
                    <Sparkles className="h-2.5 w-2.5" />
                    {planLabel}
                  </span>
                </div>
                <div className="truncate text-[10.5px] text-muted">demo@creatiscout.example</div>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" sideOffset={10} className="w-[280px] p-1.5">
        {/* Identity row */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#5B3A24] text-[13px] font-bold text-white">
            CS
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-navy ring-2 ring-surface">
              <Sparkles className="h-2 w-2 text-white" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[14px] font-bold text-ink">Demo Workspace</span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-navy/85 px-1.5 py-px text-[10px] font-semibold text-white">
                <Sparkles className="h-2.5 w-2.5" />
                {planLabel}
              </span>
            </div>
            <div className="truncate text-[11px] text-muted">demo@creatiscout.example</div>
          </div>
        </div>

        <div className="my-1 h-px bg-border" />

        <div className="mx-1.5 mb-1.5 rounded-[9px] bg-soft-pink px-3 py-2 text-[11px] font-semibold text-brand">
          {trialLabel}
        </div>

        <MenuItem
          icon={<Settings className="h-3.5 w-3.5" />}
          label={t("account.accountSettings")}
        />
        <MenuItem icon={<Bell className="h-3.5 w-3.5" />} label={t("account.messageCenter")} />

        {/* Language submenu */}
        <Popover open={langOpen} onOpenChange={setLangOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group/dd relative flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-[13px] text-ink outline-none transition-[background-color,transform] duration-150 ease-out hover:translate-x-[1px] hover:bg-surface-warm"
            >
              <Globe className="h-3.5 w-3.5 text-slate" />
              <span className="flex-1 text-left">{t("account.language")}</span>
              <span className="text-[11.5px] text-muted">
                {locale === "zh" ? "中文" : "English"}
              </span>
              <ChevronRight className="h-3 w-3 text-muted" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" sideOffset={6} className="w-[180px] p-1.5">
            <LangItem
              flag="🇺🇸"
              label="English"
              active={locale === "en"}
              onClick={() => {
                setLocale("en");
                setLangOpen(false);
              }}
            />
            <LangItem
              flag="🇨🇳"
              label="中文"
              active={locale === "zh"}
              onClick={() => {
                setLocale("zh");
                setLangOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="my-1 h-px bg-border" />

        <MenuItem icon={<LogOut className="h-3.5 w-3.5" />} label={t("account.logout")} />
      </PopoverContent>
    </Popover>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/dd relative flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-[13px] text-ink outline-none transition-[background-color,transform] duration-150 ease-out hover:translate-x-[1px] hover:bg-surface-warm"
    >
      <span className="text-slate">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function LangItem({
  flag,
  label,
  active,
  onClick,
}: {
  flag: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] outline-none transition-[background-color,transform] duration-150 ease-out hover:translate-x-[1px] hover:bg-surface-warm",
        active && "bg-surface-warm",
      )}
    >
      <span className="text-base">{flag}</span>
      <span className="flex-1 text-left text-ink">{label}</span>
      {active && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
    </button>
  );
}
