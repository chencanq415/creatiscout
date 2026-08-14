"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type LText, type Locale, loc, lookup } from "./dict";

interface I18nState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (l) => set({ locale: l }),
    }),
    { name: "creatiscout.locale.v2" },
  ),
);

export function useT() {
  const locale = useI18nStore((s) => s.locale);
  return (key: string) => lookup(key, locale);
}

export function useLocale(): [Locale, (l: Locale) => void] {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);
  return [locale, setLocale];
}

/** Returns a function resolving bilingual `{ zh, en }` values (or plain strings) to the active locale. */
export function useLoc() {
  const locale = useI18nStore((s) => s.locale);
  return (t: LText | string) => loc(t, locale);
}
