"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { formatCurrency } from "@/lib/utils";
import { Filter, Plus, Search, Upload } from "lucide-react";
import { useState } from "react";

const L = {
  searchPlaceholder: { zh: "搜索达人 / 标签…", en: "Search creators / tags…" },
  filter: { zh: "筛选", en: "Filter" },
  import: { zh: "导入", en: "Import" },
  add: { zh: "添加", en: "Add" },
  colCreator: { zh: "达人", en: "Creator" },
  colPlatform: { zh: "平台 / 粉丝", en: "Platform / Followers" },
  colTags: { zh: "标签", en: "Tags" },
  colCollabs: { zh: "合作", en: "Collabs" },
  colAvgQuote: { zh: "平均报价", en: "Avg Quote" },
  colEngagement: { zh: "互动率", en: "Eng. Rate" },
  colHeat: { zh: "关系热度", en: "Relationship Heat" },
  heatHigh: { zh: "🔥 高", en: "🔥 High" },
  heatMid: { zh: "🌿 中", en: "🌿 Mid" },
  heatLow: { zh: "💤 低", en: "💤 Low" },
} as const;

const extras: LText[][] = [
  [
    { zh: "高互动", en: "High engagement" },
    { zh: "通勤美妆", en: "Commuter beauty" },
  ],
  [
    { zh: "北美华人", en: "NA Chinese community" },
    { zh: "性价比", en: "Cost-effective" },
  ],
  [
    { zh: "头部", en: "Top tier" },
    { zh: "母婴交叉", en: "Mom & baby crossover" },
  ],
  [
    { zh: "瑜伽垂类", en: "Yoga vertical" },
    { zh: "海外", en: "Overseas" },
  ],
  [
    { zh: "新锐 micro", en: "Rising micro" },
    { zh: "高 CPM", en: "High CPM" },
  ],
];

export function PrivatePoolView() {
  const l = useLoc();
  const [q, setQ] = useState("");
  const list = creators.filter((c) => (q ? c.name.includes(q) || c.handle.includes(q) : true));
  const heatColors = [
    "bg-soft-pink text-brand-strong",
    "bg-soft-teal text-teal-text",
    "bg-soft-amber text-amber-text",
  ];
  const heatLabels = [L.heatHigh, L.heatMid, L.heatLow];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Badge tone="lavender">
          {l({ zh: `${creators.length} 位合作过`, en: `${creators.length} past collaborators` })}
        </Badge>
        <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={l(L.searchPlaceholder)}
            className="w-56 border-0 bg-transparent text-[13px] outline-none placeholder:text-muted"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-3.5 w-3.5" /> {l(L.filter)}
        </Button>
        <Button variant="soft" size="sm">
          <Upload className="h-3.5 w-3.5" /> {l(L.import)}
        </Button>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" /> {l(L.add)}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{l(L.colCreator)}</th>
              <th className="px-4 py-3 text-left font-medium">{l(L.colPlatform)}</th>
              <th className="px-4 py-3 text-left font-medium">{l(L.colTags)}</th>
              <th className="px-4 py-3 text-right font-medium">{l(L.colCollabs)}</th>
              <th className="px-4 py-3 text-right font-medium">{l(L.colAvgQuote)}</th>
              <th className="px-4 py-3 text-right font-medium">{l(L.colEngagement)}</th>
              <th className="px-4 py-3 text-left font-medium">{l(L.colHeat)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c, i) => (
              <tr key={c.id} className="hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
                    <div>
                      <div className="font-medium text-ink">{c.name}</div>
                      <div className="text-[11px] text-muted">{c.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{c.platform}</div>
                  <div className="text-[11px] text-muted">
                    {l({
                      zh: `${(c.followers / 1000).toFixed(0)}k 粉`,
                      en: `${(c.followers / 1000).toFixed(0)}k followers`,
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(extras[i] ?? []).map((t) => (
                      <Badge key={t.en} tone="lavender">
                        {l(t)}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">
                  {l({ zh: `${c.collaborations ?? 0} 次`, en: `${c.collaborations ?? 0}×` })}
                </td>
                <td className="px-4 py-3 text-right font-medium text-ink">
                  {formatCurrency(c.averageQuote ?? 0)}
                </td>
                <td className="px-4 py-3 text-right text-ink">{c.engagement}%</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${heatColors[i % 3]}`}
                  >
                    {l(heatLabels[i % 3])}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
