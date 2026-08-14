"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type {
  Campaign,
  SampleAddress,
  SampleMode,
  SampleSelection,
  SampleSelectionStatus,
  ShipmentStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Check,
  MapPin,
  Package,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Ticket,
  Truck,
  Wallet,
} from "lucide-react";
import { LookalikeButton } from "../shared/lookalike-button";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至脚本确认", en: "Advance to script alignment" },
  tabSelection: { zh: "达人选品", en: "Product Selection" },
  tabLogistics: { zh: "物流追踪", en: "Logistics Tracking" },
  modeConfig: {
    zh: "本 campaign 启用的选品模式（可混用）",
    en: "Sample modes enabled for this campaign (mixable)",
  },
  modeDirect: { zh: "品牌直邮", en: "Brand Direct Mail" },
  modeCoupon: { zh: "优惠券购买", en: "Coupon Purchase" },
  modeCredit: { zh: "限定额度下单", en: "Credit-limit Order" },
  statusPending: { zh: "待选品", en: "Pending selection" },
  statusFeedback: { zh: "已反馈", en: "Feedback received" },
  statusMerchant: { zh: "商家确认", en: "Merchant review" },
  statusOrder: { zh: "待下单", en: "Pending order" },
  statusOrdered: { zh: "已下单", en: "Ordered" },
  products: { zh: "选品清单", en: "Selected products" },
  noProducts: { zh: "达人尚未反馈选品", en: "Creator hasn't picked products yet" },
  credit: { zh: "额度", en: "Credit" },
  units: { zh: "件数", en: "Units" },
  address: { zh: "收件地址", en: "Shipping address" },
  addressOk: { zh: "地址完整 ✓", en: "Address complete ✓" },
  addressMissing: { zh: "地址缺失字段", en: "Missing address fields" },
  actAdvance: { zh: "推进状态", en: "Advance status" },
  actReselect: { zh: "驳回 · 二次选品", en: "Reject · reselect" },
  actConfirm: { zh: "确认下单 → 物流", en: "Confirm order → logistics" },
  colToShip: { zh: "待发出", en: "To Ship" },
  colInTransit: { zh: "在途", en: "In Transit" },
  colDelivered: { zh: "已签收", en: "Delivered" },
  actShip: { zh: "模拟发货", en: "Simulate shipping" },
  actDeliver: { zh: "模拟签收", en: "Simulate delivery" },
  agentText: {
    zh: "Lucy 正在监控选品与物流 · 地址缺失自动标红 · 下单自动流入物流看板",
    en: "Lucy monitors selection & logistics · missing addresses flagged red · orders auto-flow to the kanban",
  },
  fieldName: { zh: "姓名", en: "Name" },
  fieldPhone: { zh: "电话", en: "Phone" },
  fieldLine1: { zh: "街道", en: "Street" },
  fieldCity: { zh: "城市", en: "City" },
  fieldPostcode: { zh: "邮编", en: "Postcode" },
  fieldCountry: { zh: "国家", en: "Country" },
} as const;

const modeMeta: Record<SampleMode, { label: LText; icon: typeof Package }> = {
  direct_mail: { label: L.modeDirect, icon: Package },
  coupon: { label: L.modeCoupon, icon: Ticket },
  credit_order: { label: L.modeCredit, icon: Wallet },
};

const selectionMeta: Record<
  SampleSelectionStatus,
  { label: LText; tone: "gray" | "blue" | "lavender" | "amber" | "teal" }
> = {
  pending_selection: { label: L.statusPending, tone: "gray" },
  feedback_received: { label: L.statusFeedback, tone: "blue" },
  merchant_review: { label: L.statusMerchant, tone: "lavender" },
  pending_order: { label: L.statusOrder, tone: "amber" },
  ordered: { label: L.statusOrdered, tone: "teal" },
};

const addressFields: { key: keyof SampleAddress; label: LText }[] = [
  { key: "name", label: L.fieldName },
  { key: "phone", label: L.fieldPhone },
  { key: "line1", label: L.fieldLine1 },
  { key: "city", label: L.fieldCity },
  { key: "postcode", label: L.fieldPostcode },
  { key: "country", label: L.fieldCountry },
];

export function StepSample({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  return (
    <StepShell
      agentStatus="running"
      agentText={l(L.agentText)}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <Tabs defaultValue="selection">
        <TabsList>
          <TabsTrigger value="selection">
            <ShoppingBag className="h-3.5 w-3.5" /> {l(L.tabSelection)}
          </TabsTrigger>
          <TabsTrigger value="logistics">
            <Truck className="h-3.5 w-3.5" /> {l(L.tabLogistics)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="selection">
          <SelectionView />
        </TabsContent>
        <TabsContent value="logistics">
          <LogisticsView />
        </TabsContent>
      </Tabs>
    </StepShell>
  );
}

/* ── ① 达人选品 ── */
function SelectionView() {
  const l = useLoc();
  const {
    enabledSampleModes,
    toggleSampleMode,
    sampleSelections,
    setCreatorSampleMode,
    advanceSelection,
    requestReselection,
    confirmSampleOrder,
  } = usePipelineStore();

  return (
    <div className="space-y-3">
      {/* campaign 级模式配置 */}
      <div className="rounded-[10px] border border-border bg-surface p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted">{l(L.modeConfig)}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(modeMeta) as SampleMode[]).map((m) => {
            const Icon = modeMeta[m].icon;
            const on = enabledSampleModes.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleSampleMode(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                  on
                    ? "border-brand bg-soft-pink text-brand"
                    : "border-border bg-surface text-muted hover:text-ink",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {l(modeMeta[m].label)}
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 每位达人的选品卡 */}
      {sampleSelections.map((sel) => (
        <SelectionCard
          key={sel.creatorId}
          sel={sel}
          enabledModes={enabledSampleModes}
          onMode={(m) => setCreatorSampleMode(sel.creatorId, m)}
          onAdvance={() => advanceSelection(sel.creatorId)}
          onReselect={() => requestReselection(sel.creatorId)}
          onConfirm={() => confirmSampleOrder(sel.creatorId)}
        />
      ))}
    </div>
  );
}

function SelectionCard({
  sel,
  enabledModes,
  onMode,
  onAdvance,
  onReselect,
  onConfirm,
}: {
  sel: SampleSelection;
  enabledModes: SampleMode[];
  onMode: (m: SampleMode) => void;
  onAdvance: () => void;
  onReselect: () => void;
  onConfirm: () => void;
}) {
  const l = useLoc();
  const c = creators.find((x) => x.id === sel.creatorId);
  if (!c) return null;
  const meta = selectionMeta[sel.status];
  const missing = addressFields.filter((f) => !sel.address[f.key]);

  return (
    <div className="rounded-[12px] border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
        <span className="text-[14px] font-semibold text-ink">{c.name}</span>
        <LookalikeButton creatorId={c.id} sourceStep="sample" />
        <Badge tone={meta.tone}>{l(meta.label)}</Badge>
        {/* per-creator 模式切换 */}
        <div className="ml-auto flex gap-1">
          {enabledModes.map((m) => {
            const Icon = modeMeta[m].icon;
            const on = sel.mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onMode(m)}
                title={l(modeMeta[m].label)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] transition-colors",
                  on
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-surface text-muted hover:text-ink",
                )}
              >
                <Icon className="h-3 w-3" />
                {on && l(modeMeta[m].label)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {/* 选品清单 + 额度消耗 */}
        <div className="rounded-[8px] bg-surface-warm/50 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted">{l(L.products)}</div>
          {sel.products.length === 0 ? (
            <div className="mt-1 text-[12px] text-muted">{l(L.noProducts)}</div>
          ) : (
            <ul className="mt-1 space-y-0.5 text-[12px] text-ink">
              {sel.products.map((p) => (
                <li key={p.en} className="flex items-center gap-1.5">
                  <ShoppingBag className="h-3 w-3 text-slate" />
                  {l(p)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
            {sel.creditUsd !== undefined && (
              <span
                className={cn(
                  "tabular",
                  (sel.creditUsedUsd ?? 0) > sel.creditUsd ? "text-brand-strong" : "text-slate",
                )}
              >
                {l(L.credit)}: ${sel.creditUsedUsd ?? 0} / ${sel.creditUsd}
              </span>
            )}
            {sel.unitLimit !== undefined && (
              <span className="tabular text-slate">
                {l(L.units)}: {sel.unitsUsed ?? 0} / {sel.unitLimit}
              </span>
            )}
          </div>
          {sel.note && <div className="mt-1.5 text-[11px] text-amber-text">{l(sel.note)}</div>}
        </div>

        {/* 地址完整度校验 */}
        <div
          className={cn(
            "rounded-[8px] p-3",
            missing.length === 0 ? "bg-[#EDF9F0]" : "bg-soft-amber/50",
          )}
        >
          <div className="flex items-center gap-1.5">
            <MapPin
              className={cn(
                "h-3.5 w-3.5",
                missing.length === 0 ? "text-teal-text" : "text-amber-text",
              )}
            />
            <span className="text-[10px] uppercase tracking-wider text-muted">{l(L.address)}</span>
            {missing.length === 0 ? (
              <span className="text-[11px] font-medium text-teal-text">{l(L.addressOk)}</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-text">
                <AlertTriangle className="h-3 w-3" />
                {l(L.addressMissing)}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {addressFields.map((f) => {
              const v = sel.address[f.key];
              return (
                <span
                  key={f.key}
                  className={cn(
                    "rounded px-1.5 py-px text-[11px]",
                    v ? "bg-surface text-slate" : "bg-soft-pink font-medium text-brand-strong",
                  )}
                >
                  {l(f.label)}
                  {v ? `: ${v}` : " ✗"}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 操作 */}
      {sel.status !== "ordered" && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
          {sel.status !== "pending_order" && (
            <button
              type="button"
              onClick={onAdvance}
              className="rounded-full border border-dashed border-border bg-surface-warm/50 px-3 py-1 text-[11px] text-slate hover:bg-surface-warm hover:text-ink"
            >
              {l(L.actAdvance)} →
            </button>
          )}
          {sel.status === "merchant_review" && (
            <button
              type="button"
              onClick={onReselect}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-amber-text hover:bg-soft-amber"
            >
              <RotateCcw className="h-3 w-3" />
              {l(L.actReselect)}
            </button>
          )}
          {sel.status === "pending_order" && (
            <button
              type="button"
              disabled={missing.length > 0}
              onClick={onConfirm}
              className="inline-flex items-center gap-1 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-medium text-white hover:bg-[#D81D63] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
              {l(L.actConfirm)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── ② 物流追踪（看板） ── */
const shipCols: { id: ShipmentStatus; label: LText; icon: typeof Package }[] = [
  { id: "to_ship", label: L.colToShip, icon: Package },
  { id: "in_transit", label: L.colInTransit, icon: Truck },
  { id: "delivered", label: L.colDelivered, icon: PackageCheck },
];

function LogisticsView() {
  const l = useLoc();
  const { shipments, advanceShipment } = usePipelineStore();

  return (
    <div className="grid grid-cols-3 gap-4">
      {shipCols.map((col) => {
        const Icon = col.icon;
        const items = shipments.filter((s) => s.status === col.id);
        return (
          <div key={col.id} className="rounded-[12px] border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-4 w-4 text-slate" />
              <span className="text-[13px] font-semibold text-ink">{l(col.label)}</span>
              <Badge tone="gray" className="ml-auto">
                {items.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {items.map((it) => {
                const c = creators.find((x) => x.id === it.creatorId);
                if (!c) return null;
                return (
                  <div
                    key={it.creatorId}
                    className="rounded-[10px] border border-border bg-surface p-3"
                  >
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt="" className="h-7 w-7 rounded-full" />
                      <span className="text-[13px] font-medium text-ink">{c.name}</span>
                    </div>
                    {it.tracking && (
                      <div className="mt-2 font-mono text-[11px] text-slate">{it.tracking}</div>
                    )}
                    <div className="mt-1 text-[11px] text-muted">{l(it.note)}</div>
                    {it.status !== "delivered" && (
                      <button
                        type="button"
                        onClick={() => advanceShipment(it.creatorId)}
                        className="mt-2 rounded-full border border-dashed border-border bg-surface-warm/50 px-2.5 py-0.5 text-[10px] text-slate hover:bg-surface-warm hover:text-ink"
                      >
                        {it.status === "to_ship" ? l(L.actShip) : l(L.actDeliver)} →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
