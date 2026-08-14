"use client";
import { Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";

const L = {
  title: { zh: "自动任务", en: "Auto Tasks" },
  newTask: { zh: "新建定时任务", en: "New Scheduled Task" },
  lastRun: { zh: "上次：", en: "Last run: " },
  running: { zh: "运行中", en: "Running" },
  paused: { zh: "暂停", en: "Paused" },
} as const;

const tasks = [
  {
    name: { zh: "每周一拉竞品 TOP 视频", en: "Pull top competitor videos every Monday" },
    cron: { zh: "每周一 09:00", en: "Mondays 09:00" },
    last: { zh: "3 天前 · 成功", en: "3 days ago · succeeded" },
    status: "running",
  },
  {
    name: { zh: "邮件自动跟进 · 3 天未回复", en: "Auto follow-up · no reply after 3 days" },
    cron: { zh: "每日 10:00", en: "Daily 10:00" },
    last: { zh: "今天 10:01 · 发出 8 封", en: "Today 10:01 · 8 emails sent" },
    status: "running",
  },
  {
    name: { zh: "私域池新增达人画像更新", en: "Refresh profiles for new private-pool creators" },
    cron: { zh: "每周日 22:00", en: "Sundays 22:00" },
    last: { zh: "1 天前", en: "1 day ago" },
    status: "paused",
  },
];

export default function AutoTasksPage() {
  const l = useLoc();
  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
        <Button>
          <Plus className="h-3.5 w-3.5" /> {l(L.newTask)}
        </Button>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {tasks.map((t) => (
          <li key={t.name.en} className="flex items-center gap-4 px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-soft-blue text-blue-text">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-ink">{l(t.name)}</div>
              <div className="text-[11px] text-muted">
                {l(t.cron)} · {l(L.lastRun)}
                {l(t.last)}
              </div>
            </div>
            <Badge tone={t.status === "running" ? "olive" : "amber"}>
              {t.status === "running" ? l(L.running) : l(L.paused)}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
