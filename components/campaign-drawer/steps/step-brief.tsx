"use client";
import { Badge } from "@/components/ui/badge";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Banknote, Boxes, FileText, Link2, Target, Users } from "lucide-react";
import { useState } from "react";
import { StepShell } from "./step-shell";

type SectionId = "basic" | "goal" | "budget" | "creator" | "content" | "logistics";

const L = {
  agentText: {
    zh: "Lucy 已完成 Brief 结构化解析 · 6 大模块共 30 个字段",
    en: "Lucy has parsed the brief into 6 structured modules with 30 fields",
  },
  cta: { zh: "保存并进入下一步", en: "Save & continue" },
  itemsSuffix: { zh: "项", en: "items" },
} as const;

const sections: {
  id: SectionId;
  label: LText;
  icon: React.ComponentType<{ className?: string }>;
  fields: { k: LText; v: LText; tone?: "highlight" | "muted" }[];
}[] = [
  {
    id: "basic",
    label: { zh: "基本信息", en: "Basics" },
    icon: FileText,
    fields: [
      {
        k: { zh: "公司名称及官网", en: "Company & website" },
        v: { zh: "蜜语 Honeylab · honeylab.com", en: "Honeylab · honeylab.com" },
      },
      {
        k: { zh: "主推产品及 brief", en: "Hero product & brief" },
        v: {
          zh: "夏日清爽护肤限定礼盒（3 SKU）",
          en: "Summer fresh skincare limited gift set (3 SKUs)",
        },
      },
      {
        k: { zh: "内容执行 brief", en: "Content execution brief" },
        v: {
          zh: "强调「3 步快出门」与限定礼盒仪式感",
          en: 'Highlight the "3-step out-the-door" routine and the limited gift-set unboxing moment',
        },
      },
      {
        k: { zh: "产品链接", en: "Product link" },
        v: { zh: "honeylab.com/p/summer-2026", en: "honeylab.com/p/summer-2026" },
        tone: "highlight",
      },
      {
        k: { zh: "核心卖点", en: "Key selling points" },
        v: {
          zh: "1) 持妆 12h · 2) 限定礼盒包装 · 3) 通勤友好",
          en: "1) 12h wear · 2) Limited gift-set packaging · 3) Commute-friendly",
        },
      },
      {
        k: { zh: "目标销售区域", en: "Target sales regions" },
        v: {
          zh: "中国一线、新一线城市 + 北美华人圈",
          en: "China tier-1 & new tier-1 cities + North American Chinese community",
        },
      },
      {
        k: { zh: "用户画像与使用场景", en: "Audience & use case" },
        v: {
          zh: "18-28 岁通勤女性，早晨快速妆容场景",
          en: "Women 18-28 who commute; quick morning makeup routine",
        },
      },
      {
        k: { zh: "海外销售渠道", en: "Overseas sales channels" },
        v: {
          zh: "TikTok Shop US / Amazon · 6 月上线",
          en: "TikTok Shop US / Amazon · launching in June",
        },
      },
      {
        k: { zh: "对标竞品", en: "Benchmark competitors" },
        v: {
          zh: "Glossier、Rare Beauty、Tower 28",
          en: "Glossier, Rare Beauty, Tower 28",
        },
      },
    ],
  },
  {
    id: "goal",
    label: { zh: "推广目标", en: "Goals" },
    icon: Target,
    fields: [
      {
        k: { zh: "本次营销目标", en: "Marketing objective" },
        v: {
          zh: "新品上市种草 + 礼盒首发种草转化",
          en: "New-launch awareness + first-drop gift-set conversion",
        },
      },
      {
        k: { zh: "核心 KPI", en: "Core KPIs" },
        v: {
          zh: "曝光 5M / 互动 200k / GMV 80万 / ROI ≥ 2.5x",
          en: "5M impressions / 200k engagements / ¥800k GMV / ROI ≥ 2.5x",
        },
      },
      {
        k: { zh: "期望上线时间", en: "Target launch window" },
        v: { zh: "6/15 - 6/30 集中爆发", en: "Concentrated burst Jun 15 - Jun 30" },
      },
      {
        k: { zh: "Timeline 要求", en: "Timeline requirements" },
        v: {
          zh: "5/20 brief 锁定 · 6/01 提报完成 · 6/15 首发",
          en: "Brief locked May 20 · submissions done Jun 1 · first post Jun 15",
        },
      },
    ],
  },
  {
    id: "budget",
    label: { zh: "预算", en: "Budget" },
    icon: Banknote,
    fields: [
      {
        k: { zh: "总预算", en: "Total budget" },
        v: { zh: "$50,000 USD", en: "$50,000 USD" },
        tone: "highlight",
      },
      {
        k: { zh: "投放节奏", en: "Spend pacing" },
        v: {
          zh: "5/20-5/31 测试 30% · 6/01-6/15 爆发 50% · 6/16-6/30 长尾 20%",
          en: "May 20-31 test 30% · Jun 1-15 burst 50% · Jun 16-30 long tail 20%",
        },
      },
      {
        k: { zh: "预期达人数量", en: "Expected creator count" },
        v: {
          zh: "15-20 位（micro 8-10 / mid 5-7 / 头部 1-2）",
          en: "15-20 creators (8-10 micro / 5-7 mid / 1-2 top-tier)",
        },
      },
      {
        k: { zh: "单个红人价格预期", en: "Per-creator price expectation" },
        v: {
          zh: "$800 - $2,500（含置换）",
          en: "$800 - $2,500 (incl. product exchange)",
        },
      },
    ],
  },
  {
    id: "creator",
    label: { zh: "红人要求", en: "Creator Requirements" },
    icon: Users,
    fields: [
      {
        k: { zh: "投放国家", en: "Target countries" },
        v: { zh: "美国 / 加拿大 / 中国大陆", en: "US / Canada / Mainland China" },
      },
      {
        k: { zh: "语言要求", en: "Language requirements" },
        v: { zh: "英文为主 · 中文 30%", en: "Primarily English · 30% Chinese" },
      },
      {
        k: { zh: "投放平台", en: "Platforms" },
        v: { zh: "TikTok / Instagram / 小红书", en: "TikTok / Instagram / RedNote" },
      },
      {
        k: { zh: "达人类型", en: "Creator type" },
        v: {
          zh: "美妆垂类 + 通勤生活方式",
          en: "Beauty vertical + commuter lifestyle",
        },
      },
      {
        k: { zh: "性别及特点要求", en: "Gender & profile" },
        v: {
          zh: "女性 90% · 25-32 岁通勤场景",
          en: "90% female · ages 25-32, commuter context",
        },
      },
      {
        k: { zh: "粉丝量级", en: "Follower range" },
        v: { zh: "10k-500k（micro 为主）", en: "10k-500k (mostly micro)" },
      },
      {
        k: { zh: "CPM / 均播要求", en: "CPM / avg views requirements" },
        v: {
          zh: "CPM ≤ $5 · 平均播放 ≥ 50k",
          en: "CPM ≤ $5 · avg views ≥ 50k",
        },
      },
      { k: { zh: "报价货币", en: "Quote currency" }, v: { zh: "USD", en: "USD" } },
      {
        k: { zh: "理想红人案例", en: "Ideal creator examples" },
        v: {
          zh: "@creator_one · @creator_two · @creator_three",
          en: "@creator_one · @creator_two · @creator_three",
        },
      },
    ],
  },
  {
    id: "content",
    label: { zh: "内容需求", en: "Content Needs" },
    icon: FileText,
    fields: [
      {
        k: { zh: "内容形式", en: "Content format" },
        v: {
          zh: "60s 视频 + 3 张图（视频为主，图作 carousel）",
          en: "60s video + 3 photos (video-first, photos as carousel)",
        },
      },
      {
        k: { zh: "交付要求", en: "Delivery requirements" },
        v: {
          zh: "草稿前置审核 · 通过后 3 天内发布 · 必带 @brand 与限定礼盒标签",
          en: "Draft pre-approval · publish within 3 days of approval · must tag @brand and the limited gift-set hashtag",
        },
      },
    ],
  },
  {
    id: "logistics",
    label: { zh: "产品与物流", en: "Product & Logistics" },
    icon: Boxes,
    fields: [
      {
        k: { zh: "物流方式及时效要求", en: "Shipping method & SLA" },
        v: {
          zh: "国内顺丰加急（48h）· 美区 UPS 标准 5-7 天",
          en: "SF Express expedited in China (48h) · UPS standard 5-7 days in the US",
        },
      },
    ],
  },
];

export function StepBrief({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const [active, setActive] = useState<SectionId>("basic");
  const sec = sections.find((s) => s.id === active)!;
  const Icon = sec.icon;

  return (
    <StepShell
      agentStatus="done"
      agentText={l(L.agentText)}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        {/* Left rail nav */}
        <nav className="space-y-1">
          {sections.map((s) => {
            const SIcon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-soft-pink text-brand"
                    : "text-slate hover:bg-surface-warm hover:text-ink",
                )}
              >
                <SIcon className="h-4 w-4" />
                <span className="flex-1">{l(s.label)}</span>
                <span className="tabular text-[10px] text-muted">{s.fields.length}</span>
              </button>
            );
          })}
        </nav>

        {/* Right content panel */}
        <div className="rounded-[10px] border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-soft-pink text-brand">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="text-[14px] font-bold text-navy">{l(sec.label)}</div>
            </div>
            <Badge tone="gray">
              {sec.fields.length} {l(L.itemsSuffix)}
            </Badge>
          </div>
          <dl className="divide-y divide-[#EDF0F5]">
            {sec.fields.map((f) => (
              <div
                key={f.k.en}
                className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-5 py-3 lg:grid-cols-[180px_minmax(0,1fr)]"
              >
                <dt className="text-[12px] font-medium text-muted">{l(f.k)}</dt>
                <dd
                  className={cn(
                    "text-[13px] leading-relaxed",
                    f.tone === "highlight"
                      ? "font-semibold text-brand"
                      : f.tone === "muted"
                        ? "text-slate"
                        : "text-ink",
                  )}
                >
                  {f.tone === "highlight" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Link2 className="h-3 w-3" />
                      {l(f.v)}
                    </span>
                  ) : (
                    l(f.v)
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </StepShell>
  );
}
