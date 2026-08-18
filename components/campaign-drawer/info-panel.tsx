"use client";

import { Badge } from "@/components/ui/badge";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign, CampaignCurrency, CampaignGoal } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import {
  CalendarRange,
  EyeOff,
  FileText,
  Gift,
  Globe2,
  Languages,
  Target,
  Tags,
  Users,
  WalletCards,
} from "lucide-react";

const L = {
  campaignDetails: { zh: "Campaign 详情", en: "Campaign Details" },
  hideInfo: { zh: "隐藏 Campaign 信息", en: "Hide campaign details" },
  lastUpdated: { zh: "最后更新", en: "Updated" },
  basicInfo: { zh: "基础信息", en: "Basic Information" },
  brand: { zh: "品牌", en: "Brand" },
  goal: { zh: "目标", en: "Goal" },
  category: { zh: "品类", en: "Category" },
  period: { zh: "周期", en: "Duration" },
  description: { zh: "Campaign 描述", en: "Description" },
  compensation: { zh: "合作报酬", en: "Compensation" },
  flatFee: { zh: "固定费用", en: "Flat fee" },
  totalBudget: { zh: "总预算", en: "Total budget" },
  commission: { zh: "佣金", en: "Commission" },
  freeProduct: { zh: "免费产品", en: "Free product" },
  giftCard: { zh: "礼品卡", en: "Gift card" },
  creatorRequirements: { zh: "达人要求", en: "Creator Requirements" },
  regions: { zh: "地区", en: "Regions" },
  languages: { zh: "语言", en: "Languages" },
  minimumFollowers: { zh: "最低粉丝数", en: "Minimum followers" },
  contentTypes: { zh: "内容类型", en: "Content types" },
  termsAttachments: { zh: "条款与附件", en: "Terms & Attachments" },
  terms: { zh: "合作条款", en: "Terms & conditions" },
  attachments: { zh: "附件", en: "Attachments" },
  none: { zh: "未填写", en: "Not provided" },
  statusDraft: { zh: "草稿", en: "Draft" },
  statusActive: { zh: "进行中", en: "Active" },
  statusPaused: { zh: "已暂停", en: "Paused" },
  statusClosed: { zh: "已结束", en: "Closed" },
} as const;

const goalLabels: Record<CampaignGoal, { zh: string; en: string }> = {
  brand_awareness: { zh: "品牌认知", en: "Brand awareness" },
  content_production: { zh: "内容生产", en: "Content production" },
  conversion_sales: { zh: "转化 / 销售", en: "Conversion / sales" },
  engagement: { zh: "互动增长", en: "Engagement" },
};

export function CampaignInfoPanel({ campaign, standalone = false }: { campaign: Campaign; standalone?: boolean }) {
  const l = useLoc();
  const [locale] = useLocale();
  const toggleInfo = useUIStore((s) => s.toggleCampaignInfo);
  const requirements = campaign.creatorRequirements;

  return (
    <div className={cn(
      "flex flex-col bg-surface",
      standalone
        ? "mx-auto w-full max-w-[920px] overflow-hidden rounded-[14px] border border-border shadow-card"
        : "h-full overflow-y-auto border-r border-border",
    )}>
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
              {l(L.campaignDetails)}
            </div>
            <div className="mt-1.5 text-[20px] font-bold tracking-tight text-navy">
              {l(campaign.name)}
            </div>
            <div className="mt-1 text-[12px] font-medium text-slate">{l(campaign.brand)}</div>
          </div>
          {!standalone && (
            <button
              type="button"
              onClick={toggleInfo}
              aria-label={l(L.hideInfo)}
              title={l(L.hideInfo)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-surface-warm hover:text-ink"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <StatusBadge status={campaign.status} />
          <span className="tabular text-[11px] text-muted">
            {l(L.lastUpdated)} {formatRelative(campaign.updatedAt, locale)}
          </span>
        </div>
      </div>

      <Section title={l(L.basicInfo)}>
        <FieldRow icon={<Target className="h-3.5 w-3.5 text-brand" />} label={l(L.goal)}>
          {l(goalLabels[campaign.goal])}
        </FieldRow>
        <FieldRow icon={<Tags className="h-3.5 w-3.5 text-lavender-text" />} label={l(L.category)}>
          {campaign.category}
        </FieldRow>
        <FieldRow icon={<CalendarRange className="h-3.5 w-3.5 text-teal-text" />} label={l(L.period)}>
          <span className="tabular">{campaign.startAt} – {campaign.endAt}</span>
        </FieldRow>
        {campaign.description && (
          <div className="rounded-[10px] bg-surface-warm p-3 text-[12px] leading-relaxed text-slate">
            <div className="mb-1 font-semibold text-ink">{l(L.description)}</div>
            {l(campaign.description)}
          </div>
        )}
      </Section>

      <Section title={l(L.compensation)}>
        <CompensationDetails campaign={campaign} />
      </Section>

      <Section title={l(L.creatorRequirements)}>
        <FieldRow icon={<Globe2 className="h-3.5 w-3.5 text-blue-text" />} label={l(L.regions)}>
          {requirements.regions.join(", ") || l(L.none)}
        </FieldRow>
        <FieldRow icon={<Languages className="h-3.5 w-3.5 text-teal-text" />} label={l(L.languages)}>
          {requirements.languages.join(", ") || l(L.none)}
        </FieldRow>
        <FieldRow icon={<Users className="h-3.5 w-3.5 text-lavender-text" />} label={l(L.minimumFollowers)}>
          {requirements.minimumFollowers.toLocaleString()}
        </FieldRow>
        <FieldRow icon={<FileText className="h-3.5 w-3.5 text-amber-text" />} label={l(L.contentTypes)}>
          {requirements.contentTypes.join(", ") || l(L.none)}
        </FieldRow>
      </Section>

      <Section title={l(L.termsAttachments)}>
        <div className="rounded-[10px] border border-border p-3">
          <div className="text-[12px] font-semibold text-ink">{l(L.terms)}</div>
          <div className="mt-1 text-[11px] leading-relaxed text-muted">
            {campaign.termsAndConditions || l(L.none)}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px]">
          <span className="text-muted">{l(L.attachments)}</span>
          <span className="font-semibold text-ink">{campaign.attachments.length}</span>
        </div>
      </Section>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-6 py-5 last:border-b-0">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function FieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] items-start gap-3">
      <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-muted">{icon}<span>{label}</span></div>
      <div className="text-[12px] font-medium leading-relaxed text-ink">{children}</div>
    </div>
  );
}

function money(currency: CampaignCurrency, value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function CompensationDetails({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const compensation = campaign.compensation;
  return (
    <div className="space-y-2">
      {compensation.flatFee && (
        <CompensationRow icon={<WalletCards className="h-4 w-4" />} title={l(L.flatFee)}>
          {money(compensation.flatFee.currency, compensation.flatFee.minFee)} – {money(compensation.flatFee.currency, compensation.flatFee.maxFee)}
          <span className="mt-0.5 block text-[10px] font-normal text-muted">{l(L.totalBudget)} · {money(compensation.flatFee.currency, compensation.flatFee.totalBudget)}</span>
        </CompensationRow>
      )}
      {compensation.commission && (
        <CompensationRow icon={<Target className="h-4 w-4" />} title={l(L.commission)}>
          {compensation.commission.rate}%
        </CompensationRow>
      )}
      {compensation.freeProducts.length > 0 && (
        <CompensationRow icon={<Gift className="h-4 w-4" />} title={l(L.freeProduct)}>
          {compensation.freeProducts.map((product) => product.name).join(", ")}
        </CompensationRow>
      )}
      {compensation.giftCard && (
        <CompensationRow icon={<Gift className="h-4 w-4" />} title={l(L.giftCard)}>
          {compensation.giftCard.name} · {money(compensation.giftCard.currency, compensation.giftCard.value)}
        </CompensationRow>
      )}
      {!compensation.flatFee && !compensation.commission && compensation.freeProducts.length === 0 && !compensation.giftCard && (
        <div className="text-[12px] text-muted">{l(L.none)}</div>
      )}
    </div>
  );
}

function CompensationRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[10px] bg-surface-warm p-3">
      <span className="mt-0.5 text-brand">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">{title}</div>
        <div className="mt-0.5 text-[12px] font-semibold text-ink">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const l = useLoc();
  const map = {
    draft: { tone: "gray", label: L.statusDraft },
    active: { tone: "teal", label: L.statusActive },
    paused: { tone: "amber", label: L.statusPaused },
    closed: { tone: "blue", label: L.statusClosed },
  } as const;
  const meta = map[status];
  return <Badge tone={meta.tone}>{l(meta.label)}</Badge>;
}
