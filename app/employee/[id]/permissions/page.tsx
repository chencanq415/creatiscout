"use client";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLoc } from "@/lib/i18n/use-i18n";

const L = {
  title: { zh: "权限", en: "Permissions" },
  subtitle: {
    zh: "控制这位员工能看什么、能改什么、能自动做什么。",
    en: "Control what this employee can see, change, and do automatically.",
  },
  readWrite: { zh: "读写", en: "Read/write" },
  needsConfirm: { zh: "需要确认", en: "Needs confirmation" },
  readOnly: { zh: "只读", en: "Read-only" },
  forbidden: { zh: "禁止", en: "Blocked" },
} as const;

const scopes = [
  {
    name: { zh: "Campaigns · 所有挂靠项目", en: "Campaigns · all attached projects" },
    level: "readWrite" as const,
  },
  { name: { zh: "私域达人池", en: "Private creator pool" }, level: "readWrite" as const },
  { name: { zh: "邮件中心 · 起草", en: "Outreach Inbox · drafting" }, level: "readWrite" as const },
  {
    name: { zh: "邮件中心 · 自动发送", en: "Outreach Inbox · auto-send" },
    level: "needsConfirm" as const,
  },
  { name: { zh: "Tracking 竞品", en: "Competitor Tracking" }, level: "readOnly" as const },
  { name: { zh: "财务系统", en: "Finance system" }, level: "forbidden" as const },
];

export default function PermissionsPage() {
  const l = useLoc();
  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div>
        <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
        <p className="mt-0.5 text-[12px] text-muted">{l(L.subtitle)}</p>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {scopes.map((s) => (
          <li key={s.name.en} className="flex items-center gap-4 px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-soft-blue">
              <Lock className="h-4 w-4 text-blue-text" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-ink">{l(s.name)}</div>
            </div>
            <Badge
              tone={s.level === "forbidden" ? "amber" : s.level === "needsConfirm" ? "blue" : "olive"}
            >
              {l(L[s.level])}
            </Badge>
            <Switch defaultChecked={s.level !== "forbidden"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
