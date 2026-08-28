import type { Locale } from "@/lib/i18n/dict";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelative(date: Date | string, locale: Locale = "en") {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  const zh = locale === "zh";
  if (min < 1) return zh ? "刚刚" : "just now";
  if (min < 60) return zh ? `${min} 分钟前` : `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return zh ? `${hr} 小时前` : `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return zh ? `${day} 天前` : `${day}d ago`;
  return d.toLocaleDateString(zh ? "zh-CN" : "en-US");
}

export function formatCurrency(n: number) {
  return `¥${n.toLocaleString("en-US")}`;
}

const brandCoverPalette = [
  { backgroundColor: "#FFF0F5", color: "#C9366B" },
  { backgroundColor: "#EDF8F6", color: "#257A74" },
  { backgroundColor: "#EFF5FF", color: "#3C6AA3" },
  { backgroundColor: "#F5F0FF", color: "#7854A8" },
  { backgroundColor: "#FFF6EC", color: "#A66125" },
  { backgroundColor: "#F5F8E8", color: "#66722B" },
];

export function getBrandCoverTheme(brand: string) {
  const hash = Array.from(brand).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return brandCoverPalette[hash % brandCoverPalette.length];
}
