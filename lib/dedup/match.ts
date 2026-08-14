import { matchKeyOf, normalizeIdentifier, saltFor } from "@/lib/dedup/fingerprint";
import { creators } from "@/lib/mock/creators";
import type { DedupBatch, DedupEntry, DedupMatchStatus } from "@/lib/types";

/**
 * 我方达人库的比对索引：昵称与 handle 都归一化后入索引，
 * 客户名单里写昵称还是写 handle 都能撞上。
 */
const creatorIndex: Map<string, string> = (() => {
  const idx = new Map<string, string>();
  for (const c of creators) {
    idx.set(matchKeyOf(c.name), c.id);
    idx.set(matchKeyOf(c.handle), c.id);
  }
  return idx;
})();

/** 从粘贴文本 / CSV 文本里拆出一列达人标识。取每行第一个非空字段。 */
export function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const cell = line.split(/[,\t;]/)[0] ?? "";
      return cell.replace(/^["']|["']$/g, "").trim();
    })
    .filter((line, i) => !(i === 0 && /^(达人|昵称|name|handle|creator|id)$/i.test(line)));
}

function classify(
  raw: string,
  seen: Set<string>,
  seenCreators: Set<string>,
): { status: DedupMatchStatus; creatorId?: string } {
  const normalized = normalizeIdentifier(raw);
  if (normalized.length < 2) return { status: "invalid" };

  const key = matchKeyOf(raw);
  if (seen.has(key)) return { status: "duplicate" };
  seen.add(key);

  const creatorId = creatorIndex.get(key);
  if (!creatorId) return { status: "client_only" };

  // 同一个达人客户可能既写了昵称又写了 handle（`Yoga Anna` / `@yoga_anna`）——
  // 字面 key 不同但指向同一人，第二次出现仍算批内重复。
  if (seenCreators.has(creatorId)) return { status: "duplicate", creatorId };
  seenCreators.add(creatorId);

  return { status: "matched", creatorId };
}

/**
 * 把一批原始行跑成 DedupBatch：归一化 → 指纹化 → 批内排重 → 撞我方库。
 * 纯函数、无随机源，seed 数据与真实上传走的是同一条路径。
 */
export function buildBatch(input: {
  id: string;
  clientId: string;
  fileName: string;
  uploadedAt: string;
  lines: string[];
}): DedupBatch {
  const seen = new Set<string>();
  const seenCreators = new Set<string>();
  const entries: DedupEntry[] = input.lines.map((raw, i) => {
    const { status, creatorId } = classify(raw, seen, seenCreators);
    return {
      id: `${input.id}-e${i}`,
      raw,
      matchKey: matchKeyOf(raw),
      status,
      creatorId,
    };
  });

  return {
    id: input.id,
    clientId: input.clientId,
    fileName: input.fileName,
    uploadedAt: input.uploadedAt,
    salt: saltFor(input.id),
    entries,
  };
}

export interface DedupStats {
  total: number;
  matched: number;
  clientOnly: number;
  duplicate: number;
  invalid: number;
  /** 重合率：命中我方库 / 有效条数 */
  overlapRate: number;
}

export function statsOf(batches: DedupBatch[]): DedupStats {
  const all = batches.flatMap((b) => b.entries);
  const count = (s: DedupMatchStatus) => all.filter((e) => e.status === s).length;
  const matched = count("matched");
  const clientOnly = count("client_only");
  const valid = matched + clientOnly;
  return {
    total: all.length,
    matched,
    clientOnly,
    duplicate: count("duplicate"),
    invalid: count("invalid"),
    overlapRate: valid === 0 ? 0 : matched / valid,
  };
}
