"use client";

import { ArrowLeft, ArrowUpRight, FileCheck2, MessageSquare, Sparkles, WalletCards } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLoc } from "@/lib/i18n/use-i18n";

type MessageRecord = {
  icon: typeof MessageSquare;
  title: { zh: string; en: string };
  time: { zh: string; en: string };
  label: { zh: string; en: string };
  content: { zh: string; en: string };
  creator?: string;
  campaign: string;
  meta: { zh: string; en: string }[];
  destination: string;
  action: { zh: string; en: string };
  color: string;
};

const messages: Record<string, MessageRecord> = {
  offer: {
    icon: MessageSquare, title: { zh: "Yoga Anna 已回复合作邀请", en: "Yoga Anna replied to the collaboration invitation" }, time: { zh: "今天 10:18", en: "Today, 10:18 AM" }, label: { zh: "合作沟通", en: "Collaboration update" },
    content: { zh: "Yoga Anna 已确认她对本次合作感兴趣，并在回复中提供了初始报价与可配合的内容形式。请进入合作管理，查看具体沟通内容并决定是否进入下一步议价。", en: "Yoga Anna confirmed her interest and shared an initial rate along with available content formats. Open the collaboration to review the reply and decide whether to continue negotiating." },
    creator: "Yoga Anna · @yoga_anna", campaign: "618 美妆联名", meta: [{ zh: "当前状态：待确认", en: "Current status: Awaiting confirmation" }, { zh: "达人初始报价：¥8,500", en: "Initial quote: ¥8,500" }], destination: "/collaborations", action: { zh: "查看合作", en: "Open collaboration" }, color: "bg-soft-pink text-brand",
  },
  draft: {
    icon: FileCheck2, title: { zh: "Nina Chen 已提交首版稿件", en: "Nina Chen submitted the first draft" }, time: { zh: "今天 08:30", en: "Today, 8:30 AM" }, label: { zh: "稿件审核", en: "Draft review" },
    content: { zh: "Nina Chen 已提交 520 礼盒种草活动的 Instagram Reel 首版稿件。请及时审核内容，确认是否符合品牌要求，或将修改意见发送给达人。", en: "Nina Chen submitted the first Instagram Reel draft for 520 Gift Box Seeding. Review it against brand requirements and either approve it or send revision feedback." },
    creator: "Nina Chen · @creator_two", campaign: "520 礼盒种草", meta: [{ zh: "当前状态：稿件待审核", en: "Current status: Draft awaiting review" }, { zh: "交付内容：Instagram Reel × 1", en: "Deliverable: Instagram Reel × 1" }], destination: "/collaborations", action: { zh: "审核稿件", en: "Review draft" }, color: "bg-soft-amber text-amber-text",
  },
  payment: {
    icon: WalletCards, title: { zh: "Ariana Lin 的付款记录待添加", en: "A payment record is due for Ariana Lin" }, time: { zh: "昨天 16:45", en: "Yesterday, 4:45 PM" }, label: { zh: "款项结算", en: "Payment" },
    content: { zh: "Ariana Lin 的作品已发布并通过审核。本次合作金额 ¥6,800 等待添加付款记录；完成后，合作状态将更新为已付款。", en: "Ariana Lin’s content has been published and approved. Add the ¥6,800 payment record to complete settlement and update the collaboration to paid." },
    creator: "Ariana Lin · @ariana_makeup", campaign: "618 美妆联名", meta: [{ zh: "当前状态：待付款", en: "Current status: Payment pending" }, { zh: "结算金额：¥6,800", en: "Settlement amount: ¥6,800" }], destination: "/collaborations", action: { zh: "添加付款记录", en: "Add payment record" }, color: "bg-soft-blue text-blue-text",
  },
  ai: {
    icon: Sparkles, title: { zh: "AI 已完成一批达人匹配", en: "AI completed a creator matching batch" }, time: { zh: "昨天 14:20", en: "Yesterday, 2:20 PM" }, label: { zh: "智能匹配", en: "AI matching" },
    content: { zh: "系统已根据夏日瑜伽服上新的活动需求完成新一轮匹配，并新增 8 位候选达人。你可以在达人管理中查看匹配原因、近期表现和作品。", en: "A new matching batch is ready for Summer Yoga Wear Launch. Eight candidates were added based on the campaign brief; review their match reasons, recent performance, and content." },
    campaign: "夏日瑜伽服上新", meta: [{ zh: "新增候选达人：8 位", en: "New candidates: 8" }, { zh: "匹配维度：地区、品类、平台与受众", en: "Matched on: region, category, platform, and audience" }], destination: "/creators", action: { zh: "查看候选达人", en: "View candidates" }, color: "bg-soft-teal text-teal-text",
  },
};

export default function MessageDetailPage() {
  const l = useLoc();
  const params = useParams<{ id: string }>();
  const item = messages[params.id] ?? messages.offer;
  const Icon = item.icon;

  return <main className="min-h-full bg-surface px-6 py-6 lg:px-8"><div className="mx-auto max-w-[900px]">
    <Link href="/messages" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate hover:text-ink"><ArrowLeft className="h-4 w-4" />{l({ zh: "返回消息中心", en: "Back to Message Center" })}</Link>
    <article className="mt-5 overflow-hidden rounded-[14px] border border-border bg-surface">
      <header className="flex items-start gap-3 border-b border-border px-6 py-5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] ${item.color}`}><Icon className="h-4.5 w-4.5" /></span>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{l(item.label)}</p><h1 className="mt-1 text-[20px] font-bold tracking-[-0.025em] text-navy">{l(item.title)}</h1><p className="mt-1 text-[11px] text-muted">{l(item.time)}</p></div>
      </header>
      <div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,1fr)_230px]">
        <div><h2 className="text-[13px] font-semibold text-ink">{l({ zh: "消息详情", en: "Message details" })}</h2><p className="mt-3 max-w-[580px] text-[13px] leading-6 text-slate">{l(item.content)}</p><Link href={item.destination} className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-control bg-brand px-3.5 text-[11px] font-semibold text-white hover:bg-brand-hover">{l(item.action)}<ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
        <aside className="rounded-[10px] bg-surface-warm p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{l({ zh: "关联信息", en: "Related information" })}</p>{item.creator && <Info label={l({ zh: "达人", en: "Creator" })} value={item.creator} />}<Info label={l({ zh: "营销活动", en: "Campaign" })} value={item.campaign} />{item.meta.map((entry, index) => <p key={index} className="mt-3 border-t border-border pt-3 text-[11px] leading-5 text-slate">{l(entry)}</p>)}</aside>
      </div>
    </article>
  </div></main>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="mt-3"><p className="text-[10px] text-muted">{label}</p><p className="mt-1 text-[11.5px] font-semibold text-ink">{value}</p></div>;
}
