"use client";
import { Plug, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";

const L = {
  title: { zh: "连接器", en: "Connectors" },
  addNew: { zh: "添加新连接", en: "Add Connection" },
  connected: { zh: "已接入", en: "Connected" },
  available: { zh: "未启用", en: "Available" },
} as const;

const connectors = [
  {
    name: { zh: "飞书邮箱", en: "Lark Mail" },
    status: "connected",
    desc: { zh: "起草、发送、监听新邮件", en: "Draft, send, and watch for new mail" },
  },
  {
    name: { zh: "TikTok 后台", en: "TikTok Console" },
    status: "connected",
    desc: { zh: "数据拉取、广告 code 绑定", en: "Data pulls and ad code binding" },
  },
  {
    name: { zh: "小红书 商家版", en: "RedNote for Business" },
    status: "connected",
    desc: { zh: "笔记发布、互动数据", en: "Post publishing and engagement data" },
  },
  {
    name: { zh: "顺丰物流 API", en: "SF Express API" },
    status: "available",
    desc: { zh: "寄样物流追踪", en: "Sample shipment tracking" },
  },
  {
    name: { zh: "财务系统 OA", en: "Finance OA System" },
    status: "available",
    desc: { zh: "合同 / 付款流转", en: "Contract and payment workflows" },
  },
];

export default function ConnectorsPage() {
  const l = useLoc();
  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
        <Button variant="soft">
          <Plus className="h-3.5 w-3.5" /> {l(L.addNew)}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {connectors.map((c) => (
          <div key={c.name.en} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface">
                <Plug className="h-4 w-4 text-slate" />
              </div>
              <span className="text-[13px] font-semibold text-ink">{l(c.name)}</span>
              <Badge tone={c.status === "connected" ? "olive" : "gray"} className="ml-auto">
                {c.status === "connected" ? l(L.connected) : l(L.available)}
              </Badge>
            </div>
            <p className="mt-2 text-[12px] text-slate">{l(c.desc)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
