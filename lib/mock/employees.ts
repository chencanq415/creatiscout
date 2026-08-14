import type { Employee } from "@/lib/types";

export const employees: Employee[] = [
  {
    id: "lucy",
    name: "Lucy",
    role: { zh: "内容运营专员", en: "Content Ops Specialist" },
    avatar: "https://i.pravatar.cc/120?img=47",
    online: true,
    joinedAt: "2026-05-21",
    skills: [
      { zh: "脚本生成", en: "Script generation" },
      { zh: "评论回复", en: "Comment replies" },
      { zh: "Brief 解析", en: "Brief parsing" },
      { zh: "小红书笔记", en: "RedNote posts" },
      { zh: "视觉素材 brief", en: "Visual asset briefs" },
    ],
    bio: {
      zh: "面向账号定位、热点洞察、内容日历、小红书笔记创作、视觉素材 brief、审批后发布、评论互动、数据复盘、品牌合规和跨平台改写的 AI 原生内容运营角色。",
      en: "AI-native content ops role covering account positioning, trend insights, content calendars, RedNote creation, visual asset briefs, post-approval publishing, comment engagement, data reviews, brand compliance, and cross-platform rewriting.",
    },
    stats: { autoTasks: 12, chatTasks: 38, projects: 3 },
  },
  {
    id: "mia",
    name: "Mia",
    role: { zh: "达人匹配专员", en: "Creator Matching Specialist" },
    avatar: "https://i.pravatar.cc/120?img=32",
    online: true,
    joinedAt: "2026-06-02",
    skills: [
      { zh: "达人画像", en: "Creator profiling" },
      { zh: "匹配度评估", en: "Fit scoring" },
      { zh: "私域池管理", en: "Private pool management" },
      { zh: "竞品达人追踪", en: "Competitor creator tracking" },
    ],
    bio: {
      zh: "负责跨平台寻找高契合度达人，结合 brief、品牌调性、过往合作数据做智能排序。",
      en: "Finds high-fit creators across platforms and ranks them intelligently using the brief, brand tone, and past collaboration data.",
    },
    stats: { autoTasks: 8, chatTasks: 19, projects: 2 },
  },
  {
    id: "noah",
    name: "Noah",
    role: { zh: "外联谈判专员", en: "Outreach & Negotiation Specialist" },
    avatar: "https://i.pravatar.cc/120?img=12",
    online: false,
    joinedAt: "2026-06-15",
    skills: [
      { zh: "邮件起草", en: "Email drafting" },
      { zh: "报价谈判", en: "Quote negotiation" },
      { zh: "合同推进", en: "Contract follow-through" },
      { zh: "回复跟进", en: "Reply follow-ups" },
    ],
    bio: {
      zh: "负责达人外联与多轮报价谈判，超出报价天花板自动转人工。",
      en: "Handles creator outreach and multi-round quote negotiation; escalates to a human when quotes exceed the ceiling.",
    },
    stats: { autoTasks: 5, chatTasks: 7, projects: 1 },
  },
];

export function getEmployee(id: string) {
  return employees.find((e) => e.id === id);
}
