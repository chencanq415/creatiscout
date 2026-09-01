"use client";

import { CheckCheck, FileCheck2, Mail, MessageSquare, Sparkles, WalletCards } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLoc } from "@/lib/i18n/use-i18n";

const L = {
  title: { zh: "消息中心", en: "Message Center" },
  subtitle: { zh: "查看需要关注的合作提醒与 AI 工作流动态。", en: "See collaboration alerts and AI workflow updates that need your attention." },
  all: { zh: "全部", en: "All" },
  unread: { zh: "未读", en: "Unread" },
  markAll: { zh: "全部标为已读", en: "Mark all as read" },
  empty: { zh: "暂时没有新消息", en: "You’re all caught up" },
  view: { zh: "查看详情", en: "View details" },
} as const;

const notifications = [
  { id: "offer", icon: MessageSquare, title: { zh: "Yoga Anna 已回复合作邀请", en: "Yoga Anna replied to the collaboration invitation" }, copy: { zh: "达人表示有兴趣，并提供了初始报价。", en: "The creator is interested and shared an initial quote." }, time: { zh: "12 分钟前", en: "12 min ago" }, unread: true, tone: "pink" },
  { id: "draft", icon: FileCheck2, title: { zh: "Nina Chen 已提交首版稿件", en: "Nina Chen submitted the first draft" }, copy: { zh: "请审核 520 礼盒种草活动的 Instagram Reel 稿件。", en: "Review the Instagram Reel draft for 520 Gift Box Seeding." }, time: { zh: "2 小时前", en: "2 hr ago" }, unread: true, tone: "amber" },
  { id: "payment", icon: WalletCards, title: { zh: "Ariana Lin 的付款记录待添加", en: "A payment record is due for Ariana Lin" }, copy: { zh: "作品已发布，合作金额 ¥6,800 等待结算。", en: "Content is live and the ¥6,800 compensation is ready for settlement." }, time: { zh: "昨天", en: "Yesterday" }, unread: true, tone: "blue" },
  { id: "ai", icon: Sparkles, title: { zh: "AI 已完成一批达人匹配", en: "AI completed a creator matching batch" }, copy: { zh: "为夏日瑜伽服上新新增 8 位候选达人。", en: "8 creators were added for Summer Yoga Wear Launch." }, time: { zh: "昨天", en: "Yesterday" }, unread: false, tone: "teal" },
] as const;

export default function MessagesPage() {
  const l = useLoc();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [readIds, setReadIds] = useState<string[]>([]);
  const visible = notifications.filter((item) => filter === "all" || (item.unread && !readIds.includes(item.id)));

  return <main className="min-h-full bg-surface px-6 py-6 lg:px-8"><div className="mx-auto max-w-[980px]">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[30px] font-bold tracking-[-0.035em] text-navy">{l(L.title)}</h1><p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p></div>
      <button type="button" onClick={() => setReadIds(notifications.map((item) => item.id))} className="inline-flex h-9 items-center gap-1.5 rounded-control border border-border px-3 text-[11px] font-medium text-slate hover:bg-surface-warm"><CheckCheck className="h-3.5 w-3.5" />{l(L.markAll)}</button>
    </header>
    <div className="mt-6 flex gap-1 border-b border-border"><Tab active={filter === "all"} onClick={() => setFilter("all")} label={l(L.all)} /><Tab active={filter === "unread"} onClick={() => setFilter("unread")} label={l(L.unread)} /></div>
    <section className="mt-5 overflow-hidden rounded-[14px] border border-border bg-surface">{visible.length ? visible.map((item) => {
      const Icon = item.icon; const isUnread = item.unread && !readIds.includes(item.id);
      const color = item.tone === "pink" ? "bg-soft-pink text-brand" : item.tone === "amber" ? "bg-soft-amber text-amber-text" : item.tone === "blue" ? "bg-soft-blue text-blue-text" : "bg-soft-teal text-teal-text";
      return <div key={item.id} className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className={`truncate text-[11.5px] ${isUnread ? "font-semibold text-ink" : "font-medium text-slate"}`}>{l(item.title)}</p>{isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}</div><p className="mt-1 text-[10.5px] text-slate">{l(item.copy)}</p><p className="mt-1.5 text-[9.5px] text-muted">{l(item.time)}</p></div><Link href={`/messages/${item.id}`} onClick={() => setReadIds((ids) => [...ids, item.id])} className="shrink-0 text-[10.5px] font-semibold text-brand hover:text-brand-hover">{l(L.view)} →</Link></div>;
    }) : <div className="flex min-h-64 flex-col items-center justify-center text-center"><Mail className="h-6 w-6 text-muted" /><p className="mt-3 text-[12px] font-semibold text-ink">{l(L.empty)}</p></div>}</section>
  </div></main>;
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} className={`relative h-10 px-4 text-[12px] font-medium ${active ? "text-brand" : "text-slate hover:text-ink"}`}>{label}<span className={`absolute inset-x-3 bottom-0 h-[2px] rounded-full ${active ? "bg-brand" : "bg-transparent"}`} /></button>;
}
