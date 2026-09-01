"use client";

import { ArrowLeft, CalendarDays, CreditCard, FileText, Mail, MessageSquare, Package, Reply, Send } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n/use-i18n";

type Tab = "info" | "email" | "offer" | "content" | "payment";

const copy = {
  en: {
    back: "Back to collaboration",
    creator: "Creator",
    campaign: "Campaign",
    platform: "Platform",
    followers: "Followers",
    engagement: "Engagement",
    goal: "Campaign goal",
    period: "Campaign period",
    activity: "Activity",
    collaborationInfo: "Collaboration info",
    creatorProfile: "Creator profile",
    campaignBrief: "Campaign brief",
    emailTab: "Email",
    offer: "Offer",
    content: "Draft & publication",
    payment: "Payment & shipping",
    progress: "Collaboration progress",
    email: "Email communication",
    emailSync: "5 messages synced to this collaboration.",
    compose: "Compose",
    reply: "Reply",
    forward: "Forward",
    to: "To",
    subject: "Subject",
    message: "Message",
    sendEmail: "Send email",
    offerDetails: "Confirmed collaboration details",
    deliverable: "Deliverable",
    compensation: "Compensation",
    publish: "Est. publish date",
    notes: "Collaboration notes",
    drafts: "Drafts",
    publications: "Published work",
    paymentInfo: "Payment information",
    shippingInfo: "Shipping address",
    recipient: "Recipient",
    method: "Payment method",
    account: "Account",
    amount: "Amount",
    address: "Address",
    status: "Status",
    submitted: "Submitted",
    approved: "Approved",
    live: "Live",
    timeline: [
      ["Aug 20, 10:24", "Added to outreach", "The personalized collaboration invitation was sent."],
      ["Aug 21, 14:40", "Creator replied", "Yoga Anna confirmed interest and shared her initial rate."],
      ["Aug 22, 09:15", "Offer confirmed", "Deliverables, compensation, and publication timing were confirmed."],
      ["Aug 23, 11:00", "Awaiting draft", "The creator is preparing the first draft for review."],
    ],
  },
  zh: {
    back: "返回合作管理",
    creator: "达人",
    campaign: "营销活动",
    platform: "平台",
    followers: "粉丝数",
    engagement: "互动率",
    goal: "营销目标",
    period: "活动有效期",
    activity: "合作进度",
    collaborationInfo: "合作信息",
    creatorProfile: "达人资料",
    campaignBrief: "活动简报",
    emailTab: "邮件沟通",
    offer: "合作报价",
    content: "稿件与作品",
    payment: "付款与寄送信息",
    progress: "合作进度",
    email: "邮件沟通",
    emailSync: "已同步 5 封与本次合作相关的邮件。",
    compose: "写邮件",
    reply: "回复",
    forward: "转发",
    to: "收件人",
    subject: "主题",
    message: "邮件内容",
    sendEmail: "发送邮件",
    offerDetails: "已确认的合作细节",
    deliverable: "交付内容",
    compensation: "合作报酬",
    publish: "预计发布时间",
    notes: "合作说明",
    drafts: "草稿",
    publications: "已发布作品",
    paymentInfo: "付款信息",
    shippingInfo: "收货地址",
    recipient: "收款人",
    method: "付款方式",
    account: "收款账户",
    amount: "付款金额",
    address: "收货地址",
    status: "状态",
    submitted: "已提交",
    approved: "已通过",
    live: "已发布",
    timeline: [
      ["8月20日 10:24", "加入达人建联", "系统已向达人发送个性化合作邀约。"],
      ["8月21日 14:40", "达人已回复", "Yoga Anna 确认感兴趣，并提供了初始报价。"],
      ["8月22日 09:15", "确认合作细节", "双方已确认交付内容、合作报酬与预计发布时间。"],
      ["8月23日 11:00", "等待提交草稿", "达人正在准备首版稿件，等待审核。"],
    ],
  },
};

export default function CollaborationDetailPage() {
  const [locale] = useLocale();
  const l = copy[locale];
  const [tab, setTab] = useState<Tab>("info");
  const tabs: Array<[Tab, string]> = [["info", l.collaborationInfo], ["email", l.emailTab], ["offer", l.offer], ["content", l.content], ["payment", l.payment]];

  return (
    <main className="flex h-full min-h-0 flex-col bg-surface">
      <nav className="flex h-12 flex-shrink-0 items-end border-b border-border bg-surface px-6" aria-label="Collaboration detail navigation">
        <Link href="/collaborations" aria-label={l.back} title={l.back} className="mb-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] text-slate transition-colors hover:bg-surface-warm hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`relative h-12 px-5 text-[12.5px] font-medium transition-colors ${tab === id ? "text-brand" : "text-slate hover:text-ink"}`}>
            {label}
            <span className={`absolute inset-x-3 bottom-0 h-[2px] rounded-full ${tab === id ? "bg-brand" : "bg-transparent"}`} />
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto bg-surface p-6 lg:p-8">
        <div className="mx-auto w-full max-w-[1180px]">
          {tab === "info" && <CollaborationInfoTab l={l} />}
          {tab === "email" && <EmailTab l={l} />}
          {tab === "offer" && <OfferTab l={l} />}
          {tab === "content" && <ContentTab l={l} />}
          {tab === "payment" && <PaymentTab l={l} />}
        </div>
      </div>
    </main>
  );
}

function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`rounded-[14px] border border-border bg-surface p-5 ${className}`}><h3 className="mb-4 text-[13px] font-semibold text-ink">{title}</h3>{children}</section>;
}

function CollaborationInfoTab({ l }: { l: (typeof copy)["en"] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.85fr)]">
      <div className="space-y-5">
        <Section title={l.creatorProfile}>
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <img src="https://i.pravatar.cc/128?img=47" alt="Yoga Anna" className="h-11 w-11 rounded-full border border-white object-cover shadow-card" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">Yoga Anna</p>
              <p className="mt-0.5 text-[10.5px] text-slate">@yoga_anna · United States</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <InfoTile label={l.platform} value="Instagram · TikTok" />
            <InfoTile label={l.followers} value="220K" />
            <InfoTile label={l.engagement} value="7.8%" />
            <InfoTile label="Audience" value="72% women · age 18–34" />
          </div>
          <div className="mt-4 border-t border-border pt-4"><p className="text-[10px] text-muted">Creator bio</p><p className="mt-1.5 text-[11px] leading-relaxed text-slate">Lifestyle and skincare creator sharing approachable routines, product reviews, and beauty recommendations for a US-based audience.</p></div>
        </Section>
        <Section title={l.campaignBrief}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <InfoTile label={l.goal} value="Brand awareness" />
            <InfoTile label="Category" value="Beauty & Skincare" />
            <InfoTile label={l.period} value="May 20 — Jun 30, 2026" />
            <InfoTile label="Product" value="Summer Skincare Gift Box" />
          </div>
          <div className="mt-4 border-t border-border pt-4"><p className="text-[10px] text-muted">Campaign description</p><p className="mt-1.5 text-[11px] leading-relaxed text-slate">Creator seeding and content distribution for a summer skincare gift box. The creator should highlight the product routine and tag the official Honeylab account.</p></div>
        </Section>
      </div>
      <Section title={l.progress}>
        <div className="ml-2 border-l border-border pl-5">
          {l.timeline.map(([time, title, description], index) => (
            <div key={title} className={index === l.timeline.length - 1 ? "relative pb-0" : "relative pb-7"}>
              <span className={`absolute -left-[26px] top-0 h-2.5 w-2.5 rounded-full border-2 border-white ${index === l.timeline.length - 1 ? "bg-brand" : "bg-border-strong"}`} />
              <p className="text-[10px] text-muted">{time}</p><p className="mt-1 text-[11px] font-semibold text-ink">{title}</p><p className="mt-1 text-[11px] leading-relaxed text-slate">{description}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[10px] bg-surface-warm px-3.5 py-3"><p className="text-[10px] text-muted">{label}</p><p className="mt-1.5 text-[11px] font-semibold text-ink">{value}</p></div>;
}

const emails = [
  { id: 1, direction: "in", name: "Yoga Anna", time: "Aug 23 · 11:00", subject: "Re: Confirmed collaboration details", preview: "Everything looks good to me. I’ll submit the first draft by Aug 29.", body: "Hi Honeylab team,\n\nEverything looks good to me. I’ve reviewed the confirmed deliverables, compensation, and expected publication date. I’ll submit the first draft by Aug 29 for your review.\n\nBest,\nYoga", },
  { id: 2, direction: "out", name: "Honeylab team", time: "Aug 22 · 09:15", subject: "Your confirmed collaboration details", preview: "We’re pleased to confirm the collaboration with you.", body: "Hi Yoga,\n\nWe’re pleased to confirm our collaboration for the 618 Beauty Collab campaign. The agreed compensation is ¥8,500 for one Instagram Reel, with an expected publication date of Sep 02.\n\nPlease let us know if you have any questions.\n\nBest regards,\nThe Honeylab team", },
  { id: 3, direction: "in", name: "Yoga Anna", time: "Aug 21 · 14:40", subject: "Re: Collaboration invitation — 618 Beauty Collab", preview: "Thank you for reaching out. I’d love to learn more about the brief.", body: "Hi Honeylab team,\n\nThank you for reaching out. I’d love to learn more about the brief and the available budget.\n\nBest,\nYoga", },
  { id: 4, direction: "out", name: "Honeylab team", time: "Aug 20 · 10:24", subject: "Collaboration invitation — 618 Beauty Collab", preview: "We love your skincare content and think you would be a strong fit.", body: "Hi Yoga,\n\nWe love your skincare content and think you would be a strong fit for our upcoming 618 Beauty Collab campaign.\n\nBest regards,\nThe Honeylab team", },
  { id: 5, direction: "out", name: "Honeylab team", time: "Aug 20 · 10:18", subject: "Campaign brief — 618 Beauty Collab", preview: "A short overview of the campaign direction and product focus.", body: "Hi Yoga,\n\nHere is a short overview of our campaign direction and product focus.\n\nBest regards,\nThe Honeylab team", },
] as const;

function EmailTab({ l }: { l: (typeof copy)["en"] }) {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [compose, setCompose] = useState(false);
  const selected = emails.find((email) => email.id === selectedId) ?? emails[0];

  return <section className="overflow-hidden rounded-[14px] border border-border bg-surface">
    <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
      <div className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-surface-warm text-slate"><MessageSquare className="h-4 w-4" /></span><div><h3 className="text-[13px] font-semibold text-ink">{l.email}</h3><p className="mt-0.5 text-[9.5px] text-muted">{l.emailSync}</p></div></div>
      <button type="button" onClick={() => setCompose(true)} className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-brand transition-colors hover:text-brand-hover"><Send className="h-3.5 w-3.5" />{l.compose}</button>
    </header>
    <div className="grid min-h-[470px] lg:grid-cols-[310px_minmax(0,1fr)]">
      <aside className="border-b border-border lg:border-b-0 lg:border-r">
        {emails.map((email) => <button key={email.id} type="button" onClick={() => { setSelectedId(email.id); setCompose(false); }} className={`block w-full border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 ${!compose && selectedId === email.id ? "bg-surface-warm" : "hover:bg-surface-warm/70"}`}>
          <div className="flex items-start gap-2.5"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${email.direction === "in" ? "bg-soft-teal text-teal-text" : "bg-soft-pink text-brand"}`}>{email.direction === "in" ? "YA" : "HT"}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-[10.5px] font-semibold text-ink">{email.direction === "out" ? "To: " : ""}{email.name}</p><p className="shrink-0 text-[9px] text-muted">{email.time}</p></div><p className="mt-1 truncate text-[10px] font-medium text-ink">{email.subject}</p><p className="mt-1 truncate text-[9.5px] text-slate">{email.preview}</p></div></div>
        </button>)}
      </aside>
      {compose ? <Composer l={l} onCancel={() => setCompose(false)} /> : <EmailDetail email={selected} l={l} onReply={() => setCompose(true)} />}
    </div>
  </section>;
}

function EmailDetail({ email, l, onReply }: { email: (typeof emails)[number]; l: (typeof copy)["en"]; onReply: () => void }) {
  return <article className="flex min-w-0 flex-col">
    <div className="border-b border-border px-5 py-5"><p className="text-[9.5px] font-medium text-teal-text">{email.direction === "in" ? "Received email · Opened" : "Sent email"}</p><h4 className="mt-2 text-[16px] font-semibold tracking-[-0.015em] text-ink">{email.subject}</h4><div className="mt-3 flex items-center justify-between gap-4 text-[10px]"><p className="text-slate">{email.name} <span className="text-muted">&lt;{email.direction === "in" ? "yoga@creator.com" : "collab@honeylab.com"}&gt;</span></p><p className="shrink-0 text-muted">{email.time}</p></div></div>
    <div className="min-h-[260px] flex-1 whitespace-pre-line px-5 py-5 text-[11px] leading-7 text-slate">{email.body}</div>
    <div className="flex gap-2 border-t border-border px-5 py-3"><button type="button" onClick={onReply} className="inline-flex h-8 items-center gap-1.5 rounded-control border border-border px-3 text-[10px] font-medium text-ink transition-colors hover:bg-surface-warm"><Reply className="h-3.5 w-3.5" />{l.reply}</button><button type="button" onClick={onReply} className="h-8 rounded-control border border-border px-3 text-[10px] font-medium text-ink transition-colors hover:bg-surface-warm">{l.forward}</button></div>
  </article>;
}

function Composer({ l, onCancel }: { l: (typeof copy)["en"]; onCancel: () => void }) {
  return <div className="flex min-w-0 flex-col p-5"><h4 className="text-[15px] font-semibold text-ink">{l.compose}</h4><div className="mt-5 space-y-3"><Field label={l.to} value="Yoga Anna <yoga@creator.com>" /><Field label={l.subject} value="Re: 618 Beauty Collab" /><label className="block text-[10px] font-medium text-slate">{l.message}<textarea defaultValue={"Hi Yoga,\n\n"} className="mt-1.5 h-40 w-full resize-none rounded-control border border-border bg-surface px-3 py-2.5 text-[11px] leading-relaxed text-ink outline-none transition-colors focus:border-brand" /></label></div><div className="mt-auto flex justify-end gap-2 pt-5"><button type="button" onClick={onCancel} className="h-8 rounded-control border border-border px-3 text-[10px] font-medium text-slate hover:bg-surface-warm">Cancel</button><button type="button" onClick={onCancel} className="inline-flex h-8 items-center gap-1.5 rounded-control bg-brand px-3 text-[10px] font-semibold text-white shadow-cta hover:bg-brand-hover"><Send className="h-3.5 w-3.5" />{l.sendEmail}</button></div></div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <label className="block text-[10px] font-medium text-slate">{label}<input defaultValue={value} className="mt-1.5 h-9 w-full rounded-control border border-border bg-surface px-3 text-[11px] text-ink outline-none transition-colors focus:border-brand" /></label>;
}

function OfferTab({ l }: { l: (typeof copy)["en"] }) {
  return <Section title={l.offerDetails} className="max-w-5xl">
    <div className="grid gap-2.5 border-b border-border pb-5 md:grid-cols-3">
      <OfferItem icon={<FileText className="h-4 w-4" />} label={l.deliverable} value="Instagram Reel × 1" detail="45–60 sec product-focused video" />
      <OfferItem icon={<CreditCard className="h-4 w-4" />} label={l.compensation} value="¥8,500" detail="Fixed fee · payment after publication" />
      <OfferItem icon={<CalendarDays className="h-4 w-4" />} label={l.publish} value="Sep 02, 2026" detail="Subject to draft approval" />
    </div>
    <div className="pt-5"><p className="text-[11px] font-semibold text-ink">{l.notes}</p><p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-slate">The creator will feature the Honeylab summer skincare gift box and tag the official account. One draft review round is included before publication.</p></div>
  </Section>;
}

function OfferItem({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return <div className="rounded-[10px] bg-surface-warm p-3.5"><span className="text-slate">{icon}</span><p className="mt-2.5 text-[10px] text-muted">{label}</p><p className="mt-1 text-[13px] font-semibold text-ink">{value}</p><p className="mt-1 text-[10px] leading-relaxed text-slate">{detail}</p></div>;
}

function ContentTab({ l }: { l: (typeof copy)["en"] }) {
  return <div className="grid gap-6 xl:grid-cols-2">
    <Section title={l.drafts}><ContentRow kind="Draft v1" date="Aug 29, 2026 · 16:30" status={l.submitted} tone="amber" description="Instagram Reel — product routine and close-up shots" /></Section>
    <Section title={l.publications}><ContentRow kind="Instagram Reel" date="Sep 02, 2026 · 10:00" status={l.live} tone="green" description="Publication link and accumulated performance data will appear here." /></Section>
  </div>;
}

function ContentRow({ kind, date, status, tone, description }: { kind: string; date: string; status: string; tone: "amber" | "green"; description: string }) {
  return <div className="flex items-center gap-3 rounded-[10px] bg-surface-warm p-3.5"><div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate"><FileText className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-[11px] font-semibold text-ink">{kind}</p><span className={`rounded-full px-2 py-0.5 text-[9.5px] font-medium ${tone === "green" ? "bg-soft-teal text-teal-text" : "bg-soft-amber text-amber-text"}`}>{status}</span></div><p className="mt-1 text-[10.5px] text-slate">{description}</p><p className="mt-2 text-[9.5px] text-muted">{date}</p></div></div>;
}

function PaymentTab({ l }: { l: (typeof copy)["en"] }) {
  return <div className="grid gap-6 xl:grid-cols-2">
    <Section title={l.paymentInfo}><Details rows={[[l.recipient, "Yoga Anna"], [l.method, "Bank transfer"], [l.account, "•••• 8462"], [l.amount, "¥8,500"]]} /></Section>
    <Section title={l.shippingInfo}><div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[8px] bg-soft-pink text-brand"><Package className="h-4 w-4" /></div><Details rows={[[l.recipient, "Yoga Anna"], [l.address, "1820 Sunset Blvd, Apt 5B"], ["City", "Los Angeles, CA 90026"], ["Country", "United States"]]} /></Section>
  </div>;
}

function Details({ rows }: { rows: Array<[string, string]> }) {
  return <dl className="divide-y divide-border">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-5 py-2.5 first:pt-0 last:pb-0"><dt className="text-[10.5px] text-muted">{label}</dt><dd className="text-right text-[11px] font-semibold text-ink">{value}</dd></div>)}</dl>;
}
