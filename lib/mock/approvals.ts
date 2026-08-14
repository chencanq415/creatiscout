import type { ApprovalItem, MailItem } from "@/lib/types";

export const approvals: ApprovalItem[] = [
  {
    id: "apr-1",
    kind: "matching",
    campaignId: "cmp-618-beauty",
    title: { zh: "18 位推荐达人 · 等你审核", en: "18 recommended creators · awaiting your review" },
    reason: {
      zh: "Lucy 基于受众契合、GMV 潜力与品牌安全度筛选。",
      en: "Lucy shortlisted by audience fit, GMV potential, and brand safety.",
    },
    count: 18,
    ts: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "apr-2",
    kind: "outreach",
    campaignId: "cmp-520-gift",
    title: { zh: "12 封外联邮件草稿", en: "12 outreach email drafts" },
    reason: {
      zh: "已为高契合度达人定制个性化邮件。",
      en: "Personalized emails prepared for high-fit creators.",
    },
    count: 12,
    ts: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: "apr-3",
    kind: "video",
    campaignId: "cmp-summer-yoga",
    title: { zh: "3 条视频草稿 · 等你审核", en: "3 video drafts · awaiting your review" },
    reason: {
      zh: "达人提交了草稿，AI 已做初步合规检查。",
      en: "Creators submitted drafts; AI ran an initial compliance check.",
    },
    count: 3,
    ts: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: "apr-4",
    kind: "quote",
    campaignId: "cmp-618-beauty",
    title: { zh: "1 位达人报价超天花板", en: "1 creator quote exceeds ceiling" },
    reason: {
      zh: "示例达人 A 报价 ¥11,000 / 条，超出 ¥9,000 上限。",
      en: "Creator A quoted ¥11,000 per video, above the ¥9,000 ceiling.",
    },
    count: 1,
    ts: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
];

export const mails: MailItem[] = [
  {
    id: "ml-1",
    from: "Creator A <creator.a@example.com>",
    subject: "Re: 618 Beauty collab proposal",
    preview: "Thanks for reaching out. My usual rate for a 60s video is...",
    ts: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unread: true,
    campaignId: "cmp-618-beauty",
  },
  {
    id: "ml-2",
    from: "Creator B <creator.b@example.com>",
    subject: "Re: 520 Gift Box collaboration",
    preview:
      "Hi, reviewed the brief — overall direction looks good, but I'd like to discuss the rate...",
    ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true,
    campaignId: "cmp-520-gift",
  },
  {
    id: "ml-3",
    from: "Creator C <creator.c@example.com>",
    subject: "Video draft delivered",
    preview: "Here is the first cut, looking forward to your feedback.",
    ts: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    unread: false,
    campaignId: "cmp-summer-yoga",
  },
];
