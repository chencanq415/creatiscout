/**
 * 客户排重达人库 — 本地指纹化 / 脱敏工具。
 *
 * 设计要点：
 * - `matchKey` 是**无盐** md5，跨批次稳定，用于批内排重与撞我方达人库。
 * - `dynamicFingerprint` 是**加盐** md5（每批一个 salt），用于展示给客户。
 *   同一个达人在不同批次里展示出的指纹不同 → 客户可核对自己的名单，
 *   但外部拿到展示值也无法建彩虹表反查。这就是"动态脱敏"。
 * - 全部计算在浏览器本地完成，原始名单不需要离开客户端。
 */

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14,
  20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6,
  10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const K = new Uint32Array(64).map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));

function rotl(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function toHexLE(n: number): string {
  let s = "";
  for (let i = 0; i < 4; i++) s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
  return s;
}

/** RFC 1321 MD5. Web Crypto 不提供 MD5，所以这里自带一份实现。 */
export function md5(message: string): string {
  const msg = new TextEncoder().encode(message);
  const bitLen = msg.length * 8;
  const padded = new Uint8Array((((msg.length + 8) >> 6) << 6) + 64);
  padded.set(msg);
  padded[msg.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bitLen >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(bitLen / 2 ** 32), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let chunk = 0; chunk < padded.length; chunk += 64) {
    const M: number[] = [];
    for (let i = 0; i < 16; i++) M.push(view.getUint32(chunk + i * 4, true));

    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
}

/**
 * 归一化达人标识：去空白、去 @ 前缀、去零宽字符、小写。
 * 客户名单里同一个人常写成 `@Creator_One` / `creator_one ` / `Creator One`，
 * 归一化后才能真正排重。
 */
export function normalizeIdentifier(raw: string): string {
  return raw
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
    .trim()
    .replace(/^@+/, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

/** 跨批次稳定的比对键 —— 排重与撞库都用它，不落原文。 */
export function matchKeyOf(raw: string): string {
  return md5(normalizeIdentifier(raw));
}

/** 每批加盐的展示指纹 —— 客户可核对，外部无法反查。 */
export function dynamicFingerprint(raw: string, salt: string): string {
  return md5(`${salt}:${normalizeIdentifier(raw)}`);
}

/** `a3f9c41d…20b57c2` → `a3f9…7c2`，表格里显示用。 */
export function shortFingerprint(hex: string): string {
  return `${hex.slice(0, 4)}…${hex.slice(-3)}`;
}

const CJK = /[㐀-鿿豈-﫿]/;

/**
 * 掩码展示：拉丁 handle 保留首字符与尾段（`@creator_one` → `c***ator_one`），
 * 中文名保留首尾字（`张小满` → `张*满`）。
 */
export function maskIdentifier(raw: string): string {
  const s = raw.trim().replace(/^@+/, "");
  if (!s) return "";

  if (CJK.test(s)) {
    const chars = Array.from(s);
    if (chars.length <= 2) return `${chars[0]}*`;
    return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
  }

  if (s.length <= 3) return `${s[0]}**`;
  const hidden = Math.min(6, Math.max(2, Math.floor(s.length * 0.35)));
  return `${s[0]}***${s.slice(1 + hidden)}`;
}

/** 每批 salt：可读、稳定、不依赖随机源（SSR 安全）。 */
export function saltFor(batchId: string): string {
  return `cs.${md5(batchId).slice(0, 8)}`;
}
