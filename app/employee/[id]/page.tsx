"use client";
import { Edit3, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";
import { getEmployee } from "@/lib/mock/employees";

const L = {
  online: { zh: "在线", en: "Online" },
  offline: { zh: "离线", en: "Offline" },
  joinedAt: { zh: "入职时间：", en: "Joined: " },
  edit: { zh: "编辑", en: "Edit" },
  viewArtifacts: { zh: "查看产物", en: "View Artifacts" },
  runHistory: { zh: "运行记录", en: "Run History" },
  workRecord: { zh: "工作记录", en: "Work Record" },
  timelineView: { zh: "时间线视图", en: "Timeline view" },
  daysOnboard: { zh: "入职天数", en: "Days Onboard" },
  daysUnit: { zh: "天", en: "days" },
  autoTasks: { zh: "自动任务", en: "Auto Tasks" },
  chatTasks: { zh: "对话任务", en: "Chat Tasks" },
  projectsCreated: { zh: "已创建项目", en: "Projects Created" },
  contribution: { zh: "贡献度", en: "Activity level" },
  less: { zh: "少", en: "Less" },
  more: { zh: "多", en: "More" },
  memoryTitle: { zh: "记忆与积累", en: "Memory & Learnings" },
  viewFullMemory: { zh: "查看完整记忆 →", en: "View full memory →" },
  mon: { zh: "周一", en: "Mon" },
  wed: { zh: "周三", en: "Wed" },
  fri: { zh: "周五", en: "Fri" },
} as const;

const MONTHS = [
  { zh: "7月", en: "Jul" },
  { zh: "8月", en: "Aug" },
  { zh: "9月", en: "Sep" },
  { zh: "10月", en: "Oct" },
  { zh: "11月", en: "Nov" },
  { zh: "12月", en: "Dec" },
  { zh: "1月", en: "Jan" },
  { zh: "2月", en: "Feb" },
  { zh: "3月", en: "Mar" },
  { zh: "4月", en: "Apr" },
  { zh: "5月", en: "May" },
  { zh: "6月", en: "Jun" },
] as const;

const MEMORY_ITEMS = [
  {
    title: {
      zh: "学到新技能：小红书爆款笔记重写",
      en: "New skill learned: rewriting viral RedNote posts",
    },
    src: { zh: "对话任务", en: "Chat task" },
    ts: { zh: "27 天前", en: "27 days ago" },
    tone: "lavender" as const,
  },
  {
    title: {
      zh: "记忆：客户偏好夏日清爽调性",
      en: "Memory: client prefers a fresh summer tone",
    },
    src: { zh: "618 美妆", en: "618 Beauty" },
    ts: { zh: "3 天前", en: "3 days ago" },
    tone: "pink" as const,
  },
  {
    title: {
      zh: "技能升级：报价谈判转人工阈值优化",
      en: "Skill upgrade: tuned the human-handoff threshold for quote negotiation",
    },
    src: { zh: "外联实战", en: "Outreach practice" },
    ts: { zh: "2 天前", en: "2 days ago" },
    tone: "olive" as const,
  },
];

export default function EmployeeHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const l = useLoc();
  const employee = getEmployee(id);
  if (!employee) return notFound();

  const rows = 7;
  const cols = 48;
  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const seed = (i * 9301 + 49297 + id.charCodeAt(0) * 17) % 233280;
    const r = seed / 233280;
    if (r > 0.93) return 4;
    if (r > 0.85) return 3;
    if (r > 0.72) return 2;
    if (r > 0.58) return 1;
    return 0;
  });
  const heatClass = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];

  return (
    <div className="space-y-6 p-7 lg:p-8">
      {/* Hero card — flat, no decoration */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start gap-6">
          <img
            src={employee.avatar}
            alt=""
            className="h-20 w-20 flex-shrink-0 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-tight text-ink">{employee.name}</h1>
              <Badge tone="lavender">{l(employee.role)}</Badge>
            </div>
            <div className="mt-2 flex items-center gap-3 text-[12px] text-slate">
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    employee.online ? "bg-teal" : "bg-muted"
                  }`}
                />
                {employee.online ? l(L.online) : l(L.offline)}
              </span>
              <span className="text-muted">·</span>
              <span>
                {l(L.joinedAt)}
                {employee.joinedAt}
              </span>
              <span className="text-muted">·</span>
              <span className="font-mono text-[11px]">ID: {employee.id}</span>
            </div>
            <p className="mt-3 max-w-prose text-[13.5px] leading-relaxed text-ink/80">
              {l(employee.bio)}
            </p>
            <Button variant="ghost" size="sm" className="mt-2 -ml-2">
              <Edit3 className="h-3.5 w-3.5" /> {l(L.edit)}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-3.5 w-3.5" /> {l(L.viewArtifacts)}
            </Button>
            <Button variant="ghost" size="sm">
              {l(L.runHistory)}
            </Button>
          </div>
        </div>
      </section>

      {/* Work record */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">{l(L.workRecord)}</h2>
          <Badge tone="gray">{l(L.timelineView)}</Badge>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <StatCard label={l(L.daysOnboard)} value="38" sub={l(L.daysUnit)} />
          <StatCard label={l(L.autoTasks)} value={String(employee.stats.autoTasks)} />
          <StatCard label={l(L.chatTasks)} value={String(employee.stats.chatTasks)} />
          <StatCard label={l(L.projectsCreated)} value={String(employee.stats.projects)} />
        </div>

        <div className="mt-6">
          <div className="mb-2 grid grid-cols-12 gap-1 pl-10 text-[10px] text-muted">
            {MONTHS.map((m) => (
              <span key={m.en}>{l(m)}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <div
              className="flex flex-col justify-around text-[10px] text-muted"
              style={{ height: rows * 14 - 4 }}
            >
              <span>{l(L.mon)}</span>
              <span>{l(L.wed)}</span>
              <span>{l(L.fri)}</span>
            </div>
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${cols}, 10px)`,
                gridTemplateRows: `repeat(${rows}, 10px)`,
                gridAutoFlow: "column",
              }}
            >
              {cells.map((v, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-[3px] ${heatClass[v]}`}
                  title={`${l(L.contribution)} ${v}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-muted">
            <span>{l(L.less)}</span>
            {heatClass.map((c, i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-[3px] ${c}`} />
            ))}
            <span>{l(L.more)}</span>
          </div>
        </div>
      </section>

      {/* Memory */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">{l(L.memoryTitle)}</h2>
          <a
            href={`/employee/${employee.id}/memory`}
            className="text-[12px] text-slate transition-colors hover:text-ink"
          >
            {l(L.viewFullMemory)}
          </a>
        </div>
        <ul className="space-y-2">
          {MEMORY_ITEMS.map((m, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-[8px] bg-surface-warm px-4 py-3 transition-colors hover:bg-soft-pink"
            >
              <Badge tone={m.tone}>{l(m.src)}</Badge>
              <span className="flex-1 text-[13px] text-ink">{l(m.title)}</span>
              <span className="tabular text-[11px] text-muted">{l(m.ts)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="text-[28px] font-semibold leading-none text-ink">
        <span className="tabular">{value}</span>
        {sub && <span className="ml-0.5 text-[13px] font-medium text-slate">{sub}</span>}
      </div>
      <div className="mt-2 text-[12px] text-slate">{label}</div>
    </div>
  );
}
