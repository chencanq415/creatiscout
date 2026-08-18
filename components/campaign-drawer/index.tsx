"use client";
import { Badge } from "@/components/ui/badge";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, MoreHorizontal, X } from "lucide-react";
import { CampaignInfoPanel } from "./info-panel";
import { CampaignPipeline } from "./pipeline";

const L = {
  back: { zh: "返回", en: "Back" },
  statusDraft: { zh: "草稿", en: "Draft" },
  statusActive: { zh: "进行中", en: "Active" },
  statusPaused: { zh: "已暂停", en: "Paused" },
  statusClosed: { zh: "已结束", en: "Closed" },
} as const;

const stepOrder: Campaign["step"][] = [
  "brief",
  "matching",
  "outreach",
  "confirm",
  "contract",
  "sample",
  "script",
  "video",
  "publish",
  "tracking",
];

export function CampaignDrawer() {
  const l = useLoc();
  const { activeCampaignId, closeCampaign, campaigns } = useUIStore();
  const campaign = campaigns.find((c) => c.id === activeCampaignId);
  const open = !!activeCampaignId && !!campaign;

  return (
    <AnimatePresence>
      {open && campaign && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCampaign}
            className="fixed inset-0 z-40 bg-black/20"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[calc(100vw-212px)] flex-col bg-page shadow-drawer"
          >
            {/* Sticky header */}
            <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-border bg-surface px-6">
              <button
                type="button"
                onClick={closeCampaign}
                className="flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
              >
                <ChevronLeft className="h-4 w-4" />
                {l(L.back)}
              </button>
              <div className="h-5 w-px flex-shrink-0 bg-border" />
              <h2 className="truncate text-[16px] font-semibold tracking-tight text-ink">
                {l(campaign.name)}
              </h2>
              <StatusBadge status={campaign.status} />
              <div className="hidden lg:block">
                <MiniPipeline currentStep={campaign.step} hasSample={campaign.toggles.sampling} />
              </div>
              <div className="ml-auto flex flex-shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  className="rounded-full p-1.5 text-slate transition-colors hover:bg-surface-warm hover:text-ink"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={closeCampaign}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-warm text-slate transition-colors hover:bg-soft-pink hover:text-brand-strong"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body: two columns */}
            <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
              <CampaignInfoPanel campaign={campaign} />
              <div className="min-w-0">
                <CampaignPipeline campaign={campaign} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MiniPipeline({
  currentStep,
  hasSample,
}: {
  currentStep: Campaign["step"];
  hasSample: boolean;
}) {
  const order = stepOrder.filter((s) => (s === "sample" ? hasSample : true));
  const currentIdx = order.indexOf(currentStep);
  return (
    <div className="ml-3 flex items-center gap-1">
      {order.map((s, i) => (
        <span
          key={s}
          className={`h-1.5 w-6 rounded-full ${
            i < currentIdx ? "bg-olive" : i === currentIdx ? "bg-brand-strong" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const l = useLoc();
  const map: Record<
    Campaign["status"],
    { tone: "teal" | "blue" | "amber" | "gray" | "pink"; label: { zh: string; en: string } }
  > = {
    draft: { tone: "gray", label: L.statusDraft },
    active: { tone: "teal", label: L.statusActive },
    paused: { tone: "amber", label: L.statusPaused },
    closed: { tone: "blue", label: L.statusClosed },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{l(m.label)}</Badge>;
}
