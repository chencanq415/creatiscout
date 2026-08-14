"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";

const L = {
  title: { zh: "挂靠项目", en: "Attached Projects" },
  subtitle: {
    zh: "挂靠 = 授予该员工读取项目所有信息的权限。可在新建 campaign 时自动指派。",
    en: "Attaching grants this employee read access to everything in a project. Can be auto-assigned when creating a campaign.",
  },
  attachNew: { zh: "挂靠新项目", en: "Attach Project" },
  colProject: { zh: "项目", en: "Project" },
  colRole: { zh: "角色", en: "Role" },
  colPermission: { zh: "权限", en: "Permissions" },
  colJoined: { zh: "加入时间", en: "Joined" },
  colActions: { zh: "操作", en: "Actions" },
  readWriteAllStages: { zh: "读写 · 所有阶段", en: "Read/write · all stages" },
  open: { zh: "打开", en: "Open" },
  empty: { zh: "还没有挂靠的项目", en: "No attached projects yet" },
} as const;

export default function EmployeeProjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const campaigns = useUIStore((s) => s.campaigns);
  const router = useRouter();
  const l = useLoc();
  const owned = campaigns.filter((c) => c.ownerId === id);

  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
          <p className="mt-0.5 text-[12px] text-muted">{l(L.subtitle)}</p>
        </div>
        <Button>
          <Plus className="h-3.5 w-3.5" /> {l(L.attachNew)}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{l(L.colProject)}</th>
              <th className="px-4 py-3 text-left font-medium">{l(L.colRole)}</th>
              <th className="px-4 py-3 text-left font-medium">{l(L.colPermission)}</th>
              <th className="px-4 py-3 text-left font-medium">{l(L.colJoined)}</th>
              <th className="px-4 py-3 text-right font-medium">{l(L.colActions)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {owned.map((c) => (
              <tr key={c.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-medium text-ink">{l(c.name)}</td>
                <td className="px-4 py-3">
                  <Badge tone="pink">Owner</Badge>
                </td>
                <td className="px-4 py-3 text-slate">{l(L.readWriteAllStages)}</td>
                <td className="px-4 py-3 text-slate">{c.startAt}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => router.push(`/campaigns/${c.id}`)}>
                    {l(L.open)}
                  </Button>
                </td>
              </tr>
            ))}
            {owned.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[12px] text-muted">
                  {l(L.empty)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
