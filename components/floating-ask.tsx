"use client";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";

const L = {
  askAria: { zh: "问数字员工 · ⌘K", en: "Ask Digital Employee · ⌘K" },
  askTitle: { zh: "⌘K 询问数字员工", en: "⌘K Ask Digital Employee" },
} as const;

export function FloatingAsk() {
  const l = useLoc();
  const openChat = useUIStore((s) => s.openChat);
  const closeChat = useUIStore((s) => s.closeChat);
  const chatOpen = useUIStore((s) => s.chatOpen);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key === "k" || e.key === "K";
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (useUIStore.getState().chatOpen) {
          closeChat();
        } else {
          openChat();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openChat, closeChat]);

  if (chatOpen) return null;

  return (
    <button
      type="button"
      data-chat-trigger
      onClick={() => openChat()}
      aria-label={l(L.askAria)}
      title={l(L.askTitle)}
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/85 bg-brand text-white shadow-[0_14px_36px_rgba(248,47,114,0.34)] transition-[background-color,box-shadow,scale] duration-200 ease-out hover:scale-[1.06] hover:bg-brand-hover hover:shadow-[0_16px_42px_rgba(248,47,114,0.42)]"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand/18" />
      <Sparkles className="h-6 w-6" />
    </button>
  );
}
