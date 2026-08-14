"use client";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";

const L = {
  title: { zh: "对话任务", en: "Chat Tasks" },
  newChat: { zh: "+ 新建对话", en: "+ New Chat" },
} as const;

const archive = [
  {
    title: { zh: "建一个 618 美妆 campaign", en: "Set up a 618 beauty campaign" },
    summary: {
      zh: "已创建 campaign · 预算 5 万 · 第一轮达人候选已推荐",
      en: "Campaign created · ¥50k budget · first round of creator candidates recommended",
    },
    ts: { zh: "今天 10:21", en: "Today 10:21" },
    tag: { zh: "campaign", en: "campaign" },
  },
  {
    title: {
      zh: "给上周没回的达人补发跟进",
      en: "Follow up with creators who didn't reply last week",
    },
    summary: {
      zh: "起草 8 封跟进邮件，已发送 6 封，回收 3 个回复",
      en: "Drafted 8 follow-up emails, sent 6, received 3 replies",
    },
    tag: { zh: "外联", en: "Outreach" },
    ts: { zh: "昨天 16:08", en: "Yesterday 16:08" },
  },
  {
    title: {
      zh: "拉一批秋冬服装类达人候选",
      en: "Pull a batch of fall/winter fashion creator candidates",
    },
    summary: {
      zh: "已交付 18 位候选 · 等你审核",
      en: "18 candidates delivered · awaiting your review",
    },
    tag: { zh: "达人", en: "Creators" },
    ts: { zh: "3 天前", en: "3 days ago" },
  },
];

export default function ChatsPage() {
  const openChat = useUIStore((s) => s.openChat);
  const l = useLoc();
  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
        <button
          type="button"
          onClick={() => openChat()}
          className="rounded-full bg-brand-strong px-4 py-2 text-[13px] font-medium text-white hover:bg-[#D81D63]"
        >
          {l(L.newChat)}
        </button>
      </div>
      <ul className="space-y-2.5">
        {archive.map((a, i) => (
          <li
            key={i}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-surface p-4 hover:bg-surface"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft-pink">
              <MessageSquare className="h-4 w-4 text-brand-strong" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ink">{l(a.title)}</span>
                <Badge tone="lavender">{l(a.tag)}</Badge>
              </div>
              <p className="mt-0.5 text-[12px] text-slate">{l(a.summary)}</p>
            </div>
            <span className="text-[11px] text-muted">{l(a.ts)}</span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </li>
        ))}
      </ul>
    </div>
  );
}
