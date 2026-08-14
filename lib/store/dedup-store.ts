"use client";
import { dedupBatches } from "@/lib/mock/dedup";
import type { DedupBatch, RevealRecord } from "@/lib/types";
import { create } from "zustand";

interface DedupState {
  batches: DedupBatch[];
  addBatch: (b: DedupBatch) => void;

  /** 内部展开过原文的条目 —— 展开即留痕 */
  reveals: RevealRecord[];
  revealedIds: string[];
  reveal: (entryId: string, by?: string) => void;
  hideAll: () => void;

  /** 客户归属打标：matchKey → 归属客户 id 列表（同一达人可被多个客户认领） */
  ownership: Record<string, string[]>;
  tagBatchOwnership: (batchId: string) => void;
}

export const useDedupStore = create<DedupState>((set, get) => ({
  batches: dedupBatches,
  addBatch: (b) => set((s) => ({ batches: [b, ...s.batches] })),

  reveals: [],
  revealedIds: [],
  reveal: (entryId, by = "admin") =>
    set((s) => {
      if (s.revealedIds.includes(entryId)) return s;
      return {
        revealedIds: [...s.revealedIds, entryId],
        reveals: [...s.reveals, { entryId, by, at: new Date().toISOString() }],
      };
    }),
  hideAll: () => set({ revealedIds: [] }),

  ownership: {},
  tagBatchOwnership: (batchId) => {
    const batch = get().batches.find((b) => b.id === batchId);
    if (!batch) return;
    set((s) => {
      const next = { ...s.ownership };
      for (const e of batch.entries) {
        if (e.status !== "matched" && e.status !== "client_only") continue;
        const owners = next[e.matchKey] ?? [];
        if (!owners.includes(batch.clientId)) next[e.matchKey] = [...owners, batch.clientId];
      }
      return { ownership: next };
    });
  },
}));
