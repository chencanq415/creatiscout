"use client";
import { UploadDedupDialog } from "@/components/pool/upload-dedup-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { dynamicFingerprint, maskIdentifier, shortFingerprint } from "@/lib/dedup/fingerprint";
import { statsOf } from "@/lib/dedup/match";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { dedupClients } from "@/lib/mock/dedup";
import { useDedupStore } from "@/lib/store/dedup-store";
import type { DedupMatchStatus } from "@/lib/types";
import { ChevronDown, Eye, EyeOff, ShieldCheck, Tag, Upload } from "lucide-react";
import { useMemo, useState } from "react";

const L = {
  client: { zh: "客户", en: "Client" },
  upload: { zh: "上传名单", en: "Upload list" },
  tagOwnership: { zh: "打客户归属标", en: "Tag ownership" },
  tagged: { zh: "已打标", en: "Tagged" },
  batches: { zh: "批次", en: "Batches" },
  allBatches: { zh: "全部批次", en: "All batches" },

  statTotal: { zh: "已上传", en: "Uploaded" },
  statMatched: { zh: "与我方库重合", en: "Overlap" },
  statClientOnly: { zh: "客户独有", en: "Client-only" },
  statNoise: { zh: "重复 / 无效", en: "Dupe / invalid" },
  overlapRate: { zh: "重合率", en: "Overlap rate" },

  colFingerprint: { zh: "动态指纹", en: "Fingerprint" },
  colCreator: { zh: "达人（脱敏）", en: "Creator (masked)" },
  colSource: { zh: "平台", en: "Platform" },
  colResult: { zh: "撞库结果", en: "Match result" },
  colOwner: { zh: "客户归属", en: "Owned by" },

  matched: { zh: "已在我方库", en: "In our pool" },
  clientOnly: { zh: "客户独有", en: "Client-only" },
  duplicate: { zh: "名单内重复", en: "Duplicate in list" },
  invalid: { zh: "无效", en: "Invalid" },
  all: { zh: "全部", en: "All" },

  reveal: { zh: "显示原文", en: "Reveal" },
  hideAll: { zh: "全部收起", en: "Hide all" },
  revealAudit: {
    zh: "展开原文会留痕。本次已由 admin 展开",
    en: "Reveals are logged. admin has revealed",
  },
  revealAuditUnit: { zh: "条", en: "entries" },

  privacyNote: {
    zh: "客户名单在浏览器本地 md5 指纹化后才参与排重与撞库；展示指纹按批次加盐，换批即换值。",
    en: "Lists are md5-fingerprinted in the browser before dedup and matching; displayed fingerprints are salted per batch.",
  },

  emptyTitle: { zh: "该客户还没有上传私域名单", en: "No private list uploaded for this client" },
  emptyHint: {
    zh: "让业务向客户要一份私域达人名单——只要昵称或 ID，不涉及其他敏感字段。上传后我们本地脱敏、排重，再和我方达人库撞一次，重合的部分不必重复付费触达。",
    en: "Ask the client for their private creator list — names or IDs only, no other sensitive fields. We fingerprint and dedup locally, then match against our pool so overlapping creators aren't paid for twice.",
  },
} as const;

const STATUS_META: Record<
  DedupMatchStatus,
  { label: LText; tone: "pink" | "teal" | "amber" | "gray" }
> = {
  matched: { label: L.matched, tone: "pink" },
  client_only: { label: L.clientOnly, tone: "teal" },
  duplicate: { label: L.duplicate, tone: "amber" },
  invalid: { label: L.invalid, tone: "gray" },
};

const FILTERS: { key: DedupMatchStatus | "all"; label: LText }[] = [
  { key: "all", label: L.all },
  { key: "matched", label: L.matched },
  { key: "client_only", label: L.clientOnly },
  { key: "duplicate", label: L.duplicate },
  { key: "invalid", label: L.invalid },
];

const creatorById = new Map(creators.map((c) => [c.id, c]));

export function DedupLibrary() {
  const l = useLoc();
  const batches = useDedupStore((s) => s.batches);
  const ownership = useDedupStore((s) => s.ownership);
  const revealedIds = useDedupStore((s) => s.revealedIds);
  const reveal = useDedupStore((s) => s.reveal);
  const hideAll = useDedupStore((s) => s.hideAll);
  const tagBatchOwnership = useDedupStore((s) => s.tagBatchOwnership);

  const [clientId, setClientId] = useState(dedupClients[0].id);
  const [batchId, setBatchId] = useState<string | "all">("all");
  const [filter, setFilter] = useState<DedupMatchStatus | "all">("all");
  const [uploadOpen, setUploadOpen] = useState(false);

  const client = dedupClients.find((c) => c.id === clientId) ?? dedupClients[0];
  const clientBatches = useMemo(
    () => batches.filter((b) => b.clientId === clientId),
    [batches, clientId],
  );
  const visibleBatches = useMemo(
    () => (batchId === "all" ? clientBatches : clientBatches.filter((b) => b.id === batchId)),
    [clientBatches, batchId],
  );
  const stats = useMemo(() => statsOf(visibleBatches), [visibleBatches]);

  const rows = useMemo(
    () =>
      visibleBatches.flatMap((b) =>
        b.entries
          .filter((e) => filter === "all" || e.status === filter)
          .map((e) => ({ entry: e, salt: b.salt, batchId: b.id })),
      ),
    [visibleBatches, filter],
  );

  const allTagged =
    clientBatches.length > 0 &&
    clientBatches.every((b) =>
      b.entries
        .filter((e) => e.status === "matched" || e.status === "client_only")
        .every((e) => (ownership[e.matchKey] ?? []).includes(b.clientId)),
    );

  function selectClient(id: string) {
    setClientId(id);
    setBatchId("all");
    setFilter("all");
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-slate">{l(L.client)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {l(client.name)} <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {dedupClients.map((c) => (
              <DropdownMenuItem key={c.id} onSelect={() => selectClient(c.id)}>
                {l(c.name)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {clientBatches.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {batchId === "all"
                  ? l({
                      zh: `${l(L.allBatches)}（${clientBatches.length}）`,
                      en: `${l(L.allBatches)} (${clientBatches.length})`,
                    })
                  : (clientBatches.find((b) => b.id === batchId)?.fileName ?? "")}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[280px]">
              <DropdownMenuItem onSelect={() => setBatchId("all")}>
                {l(L.allBatches)}
              </DropdownMenuItem>
              {clientBatches.map((b) => (
                <DropdownMenuItem key={b.id} onSelect={() => setBatchId(b.id)}>
                  <span className="truncate">{b.fileName}</span>
                  <span className="ml-auto pl-2 text-[11px] text-muted">{b.entries.length}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="ml-auto flex items-center gap-2">
          {revealedIds.length > 0 && (
            <Button variant="ghost" size="sm" onClick={hideAll}>
              <EyeOff className="h-3.5 w-3.5" /> {l(L.hideAll)}
            </Button>
          )}
          {clientBatches.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              disabled={allTagged}
              onClick={() => {
                for (const b of clientBatches) tagBatchOwnership(b.id);
              }}
            >
              <Tag className="h-3.5 w-3.5" /> {allTagged ? l(L.tagged) : l(L.tagOwnership)}
            </Button>
          )}
          <Button variant="soft" size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> {l(L.upload)}
          </Button>
        </div>
      </div>

      {clientBatches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface-warm px-8 py-14 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-soft-pink">
            <Upload className="h-4 w-4 text-brand" />
          </div>
          <div className="text-[14px] font-semibold text-ink">{l(L.emptyTitle)}</div>
          <p className="mx-auto mt-2 max-w-[520px] text-[12px] leading-relaxed text-slate">
            {l(L.emptyHint)}
          </p>
          <Button className="mt-4" size="sm" onClick={() => setUploadOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> {l(L.upload)}
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(
              [
                [L.statTotal, stats.total, "text-ink"],
                [L.statMatched, stats.matched, "text-brand"],
                [L.statClientOnly, stats.clientOnly, "text-teal-text"],
                [L.statNoise, stats.duplicate + stats.invalid, "text-amber-text"],
              ] as const
            ).map(([label, value, tone], i) => (
              <div key={label.en} className="rounded-2xl border border-border bg-surface px-4 py-3">
                <div className="text-[11px] text-slate">{l(label)}</div>
                <div className={`mt-1 text-[22px] font-semibold leading-none ${tone}`}>{value}</div>
                {i === 1 && (
                  <div className="mt-1.5 text-[11px] text-muted">
                    {l(L.overlapRate)} {(stats.overlapRate * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Filters + privacy note */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  filter === f.key
                    ? "bg-brand-strong text-white"
                    : "border border-border bg-surface text-slate hover:text-ink"
                }`}
              >
                {l(f.label)}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-text" />
              <span className="max-w-[560px]">{l(L.privacyNote)}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <table className="w-full text-[13px]">
              <thead className="bg-surface-warm text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">{l(L.colFingerprint)}</th>
                  <th className="px-4 py-3 text-left font-medium">{l(L.colCreator)}</th>
                  <th className="px-4 py-3 text-left font-medium">{l(L.colSource)}</th>
                  <th className="px-4 py-3 text-left font-medium">{l(L.colResult)}</th>
                  <th className="px-4 py-3 text-left font-medium">{l(L.colOwner)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-row">
                {rows.map(({ entry, salt }) => {
                  const creator = entry.creatorId ? creatorById.get(entry.creatorId) : undefined;
                  const revealed = revealedIds.includes(entry.id);
                  const meta = STATUS_META[entry.status];
                  const owners = (ownership[entry.matchKey] ?? [])
                    .map((id) => dedupClients.find((c) => c.id === id))
                    .filter((c) => c !== undefined);

                  return (
                    <tr key={entry.id} className="hover:bg-surface-warm">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate">
                        {shortFingerprint(dynamicFingerprint(entry.raw, salt))}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={revealed ? "text-ink" : "font-mono text-[12px] text-slate"}
                          >
                            {revealed ? entry.raw || "—" : maskIdentifier(entry.raw) || "—"}
                          </span>
                          {!revealed && entry.raw && (
                            <button
                              type="button"
                              onClick={() => reveal(entry.id)}
                              title={l(L.reveal)}
                              aria-label={l(L.reveal)}
                              className="text-muted transition-colors hover:text-brand"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate">{creator?.platform ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <Badge tone={meta.tone}>{l(meta.label)}</Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        {owners.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {owners.map((c) => (
                              <Badge key={c.id} tone="lavender">
                                {l(c.name)}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {revealedIds.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-text">
              <Eye className="h-3.5 w-3.5" />
              {l(L.revealAudit)} {revealedIds.length} {l(L.revealAuditUnit)}
            </div>
          )}
        </>
      )}

      <UploadDedupDialog
        open={uploadOpen}
        clientId={clientId}
        onClose={() => setUploadOpen(false)}
        onImported={(id) => setBatchId(id)}
      />
    </div>
  );
}
