"use client";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { getEmployee } from "@/lib/mock/employees";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { cn, formatCurrency, formatRelative } from "@/lib/utils";
import { Briefcase, CalendarRange, Coins, EyeOff, Lock, LockOpen, Tag, User } from "lucide-react";

const L = {
  hideInfo: { zh: "隐藏 Campaign 信息", en: "Hide campaign info" },
  lastUpdated: { zh: "最后更新", en: "Updated" },
  basicInfo: { zh: "基础信息", en: "Basics" },
  client: { zh: "客户", en: "Client" },
  contact: { zh: "对接人", en: "Contact" },
  budget: { zh: "预算", en: "Budget" },
  spent: { zh: "已用", en: "Spent" },
  period: { zh: "周期", en: "Timeline" },
  owner: { zh: "负责员工", en: "Owner" },
  platform: { zh: "平台", en: "Platforms" },
  capabilityConfig: { zh: "Campaign 能力配置", en: "Campaign Capabilities" },
  configItems: { zh: "配置项", en: "Settings" },
  poolFirst: { zh: "私域达人池优先", en: "Private pool first" },
  poolFirstDesc: {
    zh: "先从合作过的达人池挑选，再补全网新发现",
    en: "Pick from creators you've worked with first, then top up with new discoveries",
  },
  sampling: { zh: "寄样追踪", en: "Sample tracking" },
  samplingDesc: {
    zh: "开启后新增寄样物流追踪步骤",
    en: "Adds a sample shipping & tracking step to the pipeline",
  },
  adCode: { zh: "Ad Code 回传", en: "Ad code callback" },
  adCodeDesc: { zh: "不投流可关闭", en: "Turn off if you're not running paid ads" },
  quoteCeiling: { zh: "报价限额", en: "Quote ceiling" },
  quoteCeilingDesc: {
    zh: "单达人报价封顶（USD），点 🔒 切换是否可编辑",
    en: "Max quote per creator (USD) — click 🔒 to toggle editing",
  },
  unlock: { zh: "解锁编辑", en: "Unlock editing" },
  lock: { zh: "锁定不可编辑", en: "Lock editing" },
  statusLive: { zh: "进行中", en: "Live" },
  statusOutreach: { zh: "外联中", en: "Outreach" },
  statusPaused: { zh: "已暂停", en: "Paused" },
  statusCompleted: { zh: "已完成", en: "Completed" },
  statusRisk: { zh: "风险", en: "At Risk" },
} as const;

export function CampaignInfoPanel({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const [locale] = useLocale();
  const updateCampaign = useUIStore((s) => s.updateCampaign);
  const toggleInfo = useUIStore((s) => s.toggleCampaignInfo);
  const owner = getEmployee(campaign.ownerId);
  const spentPct = Math.min(100, Math.round((campaign.spent / campaign.budget) * 100));

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-border bg-surface">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Campaign
            </div>
            <div className="mt-1.5 text-[20px] font-bold tracking-tight text-navy">
              {l(campaign.name)}
            </div>
          </div>
          <button
            type="button"
            onClick={toggleInfo}
            aria-label={l(L.hideInfo)}
            title={l(L.hideInfo)}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-surface-warm hover:text-ink"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <StatusBadge status={campaign.status} />
          <span className="tabular text-[11px] text-muted">
            {l(L.lastUpdated)} {formatRelative(campaign.updatedAt, locale)}
          </span>
        </div>
      </div>

      {/* 基础信息 */}
      <div className="px-6 py-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {l(L.basicInfo)}
        </div>
        <div className="space-y-3">
          <FieldRow
            icon={<Briefcase className="h-3.5 w-3.5 text-lavender-text" />}
            label={l(L.client)}
            value={
              <span className="text-[13px] font-semibold text-ink">
                {campaign.client ? l(campaign.client) : "—"}
              </span>
            }
          />
          <FieldRow
            icon={<User className="h-3.5 w-3.5 text-blue-text" />}
            label={l(L.contact)}
            value={
              <span className="text-[13px] text-ink">
                {campaign.contact ? l(campaign.contact) : "—"}
              </span>
            }
          />
          <FieldRow
            icon={<Coins className="h-3.5 w-3.5 text-amber-text" />}
            label={l(L.budget)}
            value={
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-ink">
                    {formatCurrency(campaign.budget)}
                  </span>
                  <span className="text-[11px] text-slate">
                    {l(L.spent)} {formatCurrency(campaign.spent)}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEF0F4]">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${spentPct}%` }} />
                </div>
              </div>
            }
          />
          <FieldRow
            icon={<CalendarRange className="h-3.5 w-3.5 text-teal-text" />}
            label={l(L.period)}
            value={
              <span className="tabular text-[13px] text-ink">
                {campaign.startAt} — {campaign.endAt}
              </span>
            }
          />
          <FieldRow
            icon={<img src={owner?.avatar} alt="" className="h-4 w-4 rounded-full" />}
            label={l(L.owner)}
            value={
              <span className="text-[13px] font-medium text-ink">
                {owner?.name}
                <span className="ml-1 text-[11px] font-normal text-muted">
                  {owner ? `· ${l(owner.role)}` : ""}
                </span>
              </span>
            }
          />
          <FieldRow
            icon={<Tag className="h-3.5 w-3.5 text-lavender-text" />}
            label={l(L.platform)}
            value={
              <div className="flex flex-wrap gap-1">
                {campaign.platforms.map((p) => (
                  <Badge key={p} tone="lavender">
                    {p}
                  </Badge>
                ))}
              </div>
            }
          />
        </div>
      </div>

      {/* Campaign 能力配置 */}
      <div className="border-t border-border px-6 py-5">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {l(L.capabilityConfig)}
        </div>
        <div className="rounded-[10px] border border-border bg-surface p-4">
          <div className="mb-3 text-[12px] font-semibold text-ink">{l(L.configItems)}</div>
          <div className="space-y-3">
            <ToggleRow
              label={l(L.poolFirst)}
              description={l(L.poolFirstDesc)}
              checked={campaign.toggles.poolFirst}
              onChange={(v) =>
                updateCampaign(campaign.id, {
                  toggles: { ...campaign.toggles, poolFirst: v },
                })
              }
            />
            <QuoteCeilingRow campaign={campaign} />
            <ToggleRow
              label={l(L.sampling)}
              description={l(L.samplingDesc)}
              checked={campaign.toggles.sampling}
              onChange={(v) =>
                updateCampaign(campaign.id, {
                  toggles: { ...campaign.toggles, sampling: v },
                })
              }
            />
            <ToggleRow
              label={l(L.adCode)}
              description={l(L.adCodeDesc)}
              checked={campaign.toggles.adCode}
              onChange={(v) =>
                updateCampaign(campaign.id, {
                  toggles: { ...campaign.toggles, adCode: v },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] items-start gap-3">
      <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div>{value}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <div className="flex-1">
        <div className="text-[13px] font-medium text-ink">{label}</div>
        <div className="mt-0.5 text-[11px] text-muted">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function QuoteCeilingRow({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const updateCampaign = useUIStore((s) => s.updateCampaign);
  const locked = campaign.quoteCeilingLocked ?? true;
  const value = campaign.quoteCeilingUsd ?? 0;

  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-3">
      <div className="flex-1">
        <div className="text-[13px] font-medium text-ink">{l(L.quoteCeiling)}</div>
        <div className="mt-0.5 text-[11px] text-muted">{l(L.quoteCeilingDesc)}</div>
      </div>
      <div
        className={cn(
          "flex h-9 items-center gap-1 rounded-[8px] border bg-surface px-2 transition-colors",
          locked ? "border-border bg-surface-warm" : "border-border-strong",
        )}
      >
        <span className="select-none text-[12px] font-semibold text-slate">$</span>
        <input
          type="number"
          value={value || ""}
          disabled={locked}
          onChange={(e) =>
            updateCampaign(campaign.id, {
              quoteCeilingUsd: Number(e.target.value) || 0,
            })
          }
          placeholder="0"
          className={cn(
            "tabular w-[88px] border-0 bg-transparent text-right text-[13px] font-semibold text-ink outline-none focus:outline-none focus-visible:!outline-none",
            locked && "cursor-not-allowed text-slate",
          )}
          style={{ outline: "none", boxShadow: "none" }}
        />
        <button
          type="button"
          aria-label={locked ? l(L.unlock) : l(L.lock)}
          onClick={() => updateCampaign(campaign.id, { quoteCeilingLocked: !locked })}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-[6px] transition-colors",
            locked
              ? "text-muted hover:bg-soft-pink hover:text-brand"
              : "bg-soft-pink text-brand hover:bg-[#FFD5E2]",
          )}
        >
          {locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const l = useLoc();
  const map: Record<
    Campaign["status"],
    { tone: "teal" | "blue" | "amber" | "gray" | "pink"; label: { zh: string; en: string } }
  > = {
    live: { tone: "teal", label: L.statusLive },
    outreach: { tone: "blue", label: L.statusOutreach },
    paused: { tone: "amber", label: L.statusPaused },
    completed: { tone: "gray", label: L.statusCompleted },
    risk: { tone: "pink", label: L.statusRisk },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{l(m.label)}</Badge>;
}
