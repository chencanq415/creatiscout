import { buildBatch, parseLines } from "@/lib/dedup/match";
import type { DedupBatch, DedupClient } from "@/lib/types";

export const dedupClients: DedupClient[] = [
  { id: "cl-honeylab", name: { zh: "蜜语 Honeylab", en: "Honeylab" } },
  { id: "cl-mumu", name: { zh: "MuMu 礼遇", en: "MuMu Gifting" } },
  { id: "cl-lumio", name: { zh: "Lumio Athletics", en: "Lumio Athletics" } },
  { id: "cl-sanyu", name: { zh: "三隅咖啡", en: "Sanyu Coffee" } },
];

/**
 * Seed 名单走的是和真实上传完全相同的 buildBatch 管道 ——
 * 这里只声明"客户给了哪些行"，重合 / 重复 / 无效全部由撞库逻辑现算。
 */
const seeds: {
  id: string;
  clientId: string;
  fileName: string;
  uploadedAt: string;
  lines: string[];
}[] = [
  {
    id: "db-honeylab-1",
    clientId: "cl-honeylab",
    fileName: "honeylab_私域达人_2026Q2.csv",
    uploadedAt: "2026-06-18T10:20:00Z",
    lines: [
      "@Creator_One",
      "@creator_two",
      "creator_one",
      "@morningglow_ky",
      "小满同学",
      "@creator_three",
      "@beibei_daily",
      "@ariana_makeup",
      "",
      "@tan_tan_life",
      "-",
      "@creator_four",
    ],
  },
  {
    id: "db-honeylab-2",
    clientId: "cl-honeylab",
    fileName: "honeylab_老客名单_补充.txt",
    uploadedAt: "2026-07-29T03:45:00Z",
    lines: [
      "MakeupByJade",
      "@guozi_sis",
      "@so_soft_studio",
      "@creator_five",
      "@guozi_sis",
      "@mint_and_moon",
      "@daisy_reviews",
    ],
  },
  {
    id: "db-mumu-1",
    clientId: "cl-mumu",
    fileName: "mumu_gifting_creators.csv",
    uploadedAt: "2026-07-11T08:05:00Z",
    lines: [
      "达人",
      "@leoparkco",
      "@yoga_anna",
      "@giftbox_amy",
      "@unboxing_kk",
      "@leoparkco",
      "@paper_and_pine",
      "@creator_six",
      "  ",
      "@nova_home",
    ],
  },
  {
    id: "db-lumio-1",
    clientId: "cl-lumio",
    fileName: "lumio_athletics_ambassadors.csv",
    uploadedAt: "2026-08-01T01:30:00Z",
    lines: [
      "Yoga Anna",
      "@runwithjoy",
      "@creator_seven",
      "@strength_sam",
      "@yoga_anna",
      "@trailhead_ben",
      "@fitwithzoe",
      "@core_daily",
      "@marathon_mo",
    ],
  },
];

export const dedupBatches: DedupBatch[] = seeds.map((s) =>
  buildBatch({ ...s, lines: parseLines(s.lines.join("\n")) }),
);
