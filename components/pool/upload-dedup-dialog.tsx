"use client";
import { Button } from "@/components/ui/button";
import { dynamicFingerprint, shortFingerprint } from "@/lib/dedup/fingerprint";
import { buildBatch, parseLines, statsOf } from "@/lib/dedup/match";
import { useLoc } from "@/lib/i18n/use-i18n";
import { dedupClients } from "@/lib/mock/dedup";
import { useDedupStore } from "@/lib/store/dedup-store";
import type { DedupBatch } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileUp, Loader2, Lock, X } from "lucide-react";
import { useRef, useState } from "react";

const L = {
  title: { zh: "上传客户私域达人名单", en: "Upload client's private creator list" },
  close: { zh: "关闭", en: "Close" },
  client: { zh: "归属客户", en: "Client" },
  dropTitle: {
    zh: "拖入 CSV / TXT，或点击选择文件",
    en: "Drop a CSV / TXT file, or click to browse",
  },
  dropHint: {
    zh: "每行一个达人昵称或 ID，多列时取第一列",
    en: "One creator name or ID per line; the first column is used",
  },
  orPaste: { zh: "或直接粘贴名单：", en: "Or paste the list directly:" },
  pastePlaceholder: {
    zh: "@creator_one\n@creator_two\n示例达人",
    en: "@creator_one\n@creator_two\n@creator_three",
  },
  privacy: {
    zh: "原始名单只在你的浏览器里处理：本地 md5 指纹化后才参与排重与撞库，服务端不留存明文。",
    en: "The raw list stays in your browser: it is md5-fingerprinted locally before dedup and matching — no plaintext is stored server-side.",
  },
  onlyNeed: {
    zh: "只需要达人昵称或 ID，不要粉丝手机号、邮箱等敏感字段。",
    en: "Only creator names or IDs are needed — no phone numbers, emails or other sensitive fields.",
  },
  encrypt: { zh: "本地脱敏并排重", en: "Fingerprint & dedup locally" },
  encrypting: { zh: "正在本地脱敏加密…", en: "Fingerprinting locally…" },
  previewTitle: { zh: "排重预览", en: "Dedup preview" },
  statTotal: { zh: "解析", en: "Parsed" },
  statMatched: { zh: "与我方库重合", en: "Overlap with our pool" },
  statClientOnly: { zh: "客户独有", en: "Client-only" },
  statDuplicate: { zh: "名单内重复", en: "Duplicates in list" },
  statInvalid: { zh: "无效", en: "Invalid" },
  fingerprintPreview: { zh: "指纹样例（客户可见）", en: "Fingerprint sample (client-visible)" },
  rows: { zh: "条", en: "" },
  back: { zh: "重新选择", en: "Start over" },
  confirm: { zh: "确认入库并打客户归属标", en: "Import & tag client ownership" },
  cancel: { zh: "取消", en: "Cancel" },
  empty: { zh: "还没有可解析的名单", en: "Nothing to parse yet" },
} as const;

type Phase = "input" | "hashing" | "preview";

export function UploadDedupDialog({
  open,
  clientId,
  onClose,
  onImported,
}: {
  open: boolean;
  clientId: string;
  onClose: () => void;
  onImported?: (batchId: string) => void;
}) {
  const l = useLoc();
  const addBatch = useDedupStore((s) => s.addBatch);
  const tagBatchOwnership = useDedupStore((s) => s.tagBatchOwnership);

  const [phase, setPhase] = useState<Phase>("input");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [draft, setDraft] = useState<DedupBatch | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const client = dedupClients.find((c) => c.id === clientId) ?? dedupClients[0];

  function reset() {
    setPhase("input");
    setText("");
    setFileName("");
    setDraft(null);
    setDragging(false);
  }

  function close() {
    reset();
    onClose();
  }

  async function readFile(file: File) {
    setFileName(file.name);
    setText(await file.text());
  }

  function runDedup() {
    const lines = parseLines(text);
    if (lines.length === 0) return;
    setPhase("hashing");
    // 指纹化本身是同步的；短暂延时是为了让"本地加密"这一步在界面上可见。
    setTimeout(() => {
      setDraft(
        buildBatch({
          id: `db-${clientId}-${Date.now()}`,
          clientId,
          fileName: fileName || (l({ zh: "粘贴名单.txt", en: "pasted-list.txt" }) as string),
          uploadedAt: new Date().toISOString(),
          lines,
        }),
      );
      setPhase("preview");
    }, 700);
  }

  function confirmImport() {
    if (!draft) return;
    addBatch(draft);
    tagBatchOwnership(draft.id);
    onImported?.(draft.id);
    close();
  }

  const stats = draft ? statsOf([draft]) : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-ink/40"
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-auto max-h-[86vh] w-[min(560px,94vw)] overflow-y-auto rounded-[12px] bg-surface shadow-floating"
            >
              <div className="flex items-start justify-between px-6 pt-5">
                <h2 className="text-[18px] font-bold tracking-tight text-navy">{l(L.title)}</h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label={l(L.close)}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-surface-warm hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 px-6 pb-6 pt-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="text-slate">{l(L.client)}</span>
                  <span className="rounded-full bg-soft-lavender px-2.5 py-0.5 text-[12px] font-medium text-lavender-text">
                    {l(client.name)}
                  </span>
                </div>

                {phase === "input" && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        const f = e.dataTransfer.files?.[0];
                        if (f) void readFile(f);
                      }}
                      className={`flex w-full flex-col items-center gap-1.5 rounded-[10px] border border-dashed px-4 py-7 transition-colors ${
                        dragging
                          ? "border-brand bg-soft-pink"
                          : "border-border-strong bg-surface-warm hover:border-brand hover:bg-soft-pink"
                      }`}
                    >
                      <FileUp className="h-5 w-5 text-brand" />
                      <span className="text-[13px] font-medium text-ink">
                        {fileName || l(L.dropTitle)}
                      </span>
                      <span className="text-[11px] text-muted">{l(L.dropHint)}</span>
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.txt,text/csv,text/plain"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void readFile(f);
                      }}
                    />

                    <div>
                      <div className="mb-1.5 text-[12px] text-slate">{l(L.orPaste)}</div>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        placeholder={l(L.pastePlaceholder)}
                        className="w-full resize-none rounded-[8px] border border-border bg-surface px-3 py-2 font-mono text-[12px] text-ink outline-none placeholder:text-muted focus:border-brand"
                      />
                    </div>
                  </>
                )}

                {phase === "hashing" && (
                  <div className="flex flex-col items-center gap-2 py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-brand" />
                    <span className="text-[13px] text-slate">{l(L.encrypting)}</span>
                  </div>
                )}

                {phase === "preview" && draft && stats && (
                  <div className="space-y-3">
                    <div className="text-[13px] font-semibold text-ink">{l(L.previewTitle)}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          [L.statTotal, stats.total, "text-ink"],
                          [L.statMatched, stats.matched, "text-brand"],
                          [L.statClientOnly, stats.clientOnly, "text-teal-text"],
                          [L.statDuplicate, stats.duplicate, "text-amber-text"],
                          [L.statInvalid, stats.invalid, "text-muted"],
                        ] as const
                      ).map(([label, value, tone]) => (
                        <div
                          key={label.en}
                          className="flex items-baseline justify-between rounded-[8px] bg-surface-warm px-3 py-2"
                        >
                          <span className="text-[12px] text-slate">{l(label)}</span>
                          <span className={`text-[15px] font-semibold ${tone}`}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="mb-1.5 text-[12px] text-slate">{l(L.fingerprintPreview)}</div>
                      <div className="space-y-1 rounded-[8px] border border-border bg-surface-warm px-3 py-2">
                        {draft.entries
                          .filter((e) => e.status !== "invalid")
                          .slice(0, 4)
                          .map((e) => (
                            <div key={e.id} className="font-mono text-[11px] text-slate">
                              {shortFingerprint(dynamicFingerprint(e.raw, draft.salt))}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-[8px] bg-soft-blue px-3 py-2.5">
                  <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-text" />
                  <div className="space-y-1 text-[11px] leading-relaxed text-blue-text">
                    <p>{l(L.privacy)}</p>
                    <p className="opacity-80">{l(L.onlyNeed)}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  {phase === "preview" ? (
                    <>
                      <Button variant="outline" size="sm" onClick={reset}>
                        {l(L.back)}
                      </Button>
                      <Button size="sm" onClick={confirmImport}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> {l(L.confirm)}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={close}>
                        {l(L.cancel)}
                      </Button>
                      <Button
                        size="sm"
                        disabled={phase === "hashing" || parseLines(text).length === 0}
                        onClick={runDedup}
                      >
                        <Lock className="h-3.5 w-3.5" /> {l(L.encrypt)}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
