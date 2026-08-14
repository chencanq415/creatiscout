"use client";
import { Brain, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";

const L = {
  title: { zh: "记忆", en: "Memory" },
  addMemory: { zh: "手动添加记忆", en: "Add Memory Manually" },
} as const;

const memory = [
  {
    tag: { zh: "用户偏好", en: "Preference" },
    text: {
      zh: "偏好夏日清爽调性，文案避免油腻形容词。",
      en: "Prefers a fresh summer tone; copy should avoid greasy, over-the-top adjectives.",
    },
    source: { zh: "618 美妆", en: "618 Beauty" },
    ts: { zh: "3 天前", en: "3 days ago" },
  },
  {
    tag: { zh: "决策", en: "Decision" },
    text: {
      zh: "报价超 ¥10k 一律转人工，曾因自动同意导致超预算。",
      en: "Any quote above ¥10k goes to a human — auto-approval once caused a budget overrun.",
    },
    source: { zh: "520 礼盒", en: "520 Gift Box" },
    ts: { zh: "1 周前", en: "1 week ago" },
  },
  {
    tag: { zh: "技能", en: "Skill" },
    text: {
      zh: "学到了「先痛点后解决」的爆款脚本结构。",
      en: 'Learned the viral script structure: "pain point first, solution second".',
    },
    source: { zh: "Context Lab", en: "Context Lab" },
    ts: { zh: "27 天前", en: "27 days ago" },
  },
  {
    tag: { zh: "工具", en: "Tooling" },
    text: {
      zh: "TikTok 后台爬数据需要带 cookie，否则 401。",
      en: "TikTok console scraping needs cookies attached, otherwise it returns 401.",
    },
    source: { zh: "工程踩坑", en: "Engineering notes" },
    ts: { zh: "20 天前", en: "20 days ago" },
  },
];

export default function MemoryPage() {
  const l = useLoc();
  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
        <Button variant="soft">
          <Plus className="h-3.5 w-3.5" /> {l(L.addMemory)}
        </Button>
      </div>
      <ul className="space-y-2.5">
        {memory.map((m, i) => (
          <li key={i} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft-lavender">
                <Brain className="h-4 w-4 text-lavender-text" />
              </div>
              <Badge tone="lavender">{l(m.tag)}</Badge>
              <span className="ml-auto text-[11px] text-muted">
                {l(m.source)} · {l(m.ts)}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink">{l(m.text)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
