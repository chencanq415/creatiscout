"use client";
import { Send } from "lucide-react";
import { useState } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { getEmployee } from "@/lib/mock/employees";

const L = {
  ackLong: {
    zh: "收到，我先看一下，稍后给你结果。",
    en: "Got it — let me take a look and I'll get back to you shortly.",
  },
  ackShort: { zh: "收到。", en: "Got it." },
  placeholder: { zh: "给员工发消息…", en: "Message this employee…" },
} as const;

export default function IMPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const e = getEmployee(id);
  const l = useLoc();
  const [msgs, setMsgs] = useState<{ role: "user" | "emp"; text: LText | string }[]>(() => [
    {
      role: "emp",
      text: {
        zh: `Hi，我是 ${e?.name}，工作时间随时找我，无关具体 campaign 也可以闲聊。`,
        en: `Hi, I'm ${e?.name}. Reach me anytime during work hours — happy to chat even outside a specific campaign.`,
      },
    },
  ]);
  const [v, setV] = useState("");

  return (
    <div className="flex h-full flex-col p-7 lg:p-8">
      <h2 className="mb-3 text-[16px] font-semibold text-ink">IM · {e?.name}</h2>
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-surface p-5">
        <div className="space-y-3">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-soft-pink px-4 py-2 text-[13px] text-ink">
                  {l(m.text)}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2">
                <img src={e?.avatar} alt="" className="h-7 w-7 rounded-full" />
                <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-2 text-[13px] text-ink">
                  {l(m.text)}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-surface p-2">
        <input
          value={v}
          onChange={(e2) => setV(e2.target.value)}
          onKeyDown={(e2) => {
            if (e2.key === "Enter" && v.trim()) {
              setMsgs([
                ...msgs,
                { role: "user", text: v },
                { role: "emp", text: L.ackLong },
              ]);
              setV("");
            }
          }}
          placeholder={l(L.placeholder)}
          className="flex-1 border-0 bg-transparent px-2 text-[13px] outline-none placeholder:text-muted"
        />
        <Button
          size="sm"
          onClick={() => {
            if (!v.trim()) return;
            setMsgs([
              ...msgs,
              { role: "user", text: v },
              { role: "emp", text: L.ackShort },
            ]);
            setV("");
          }}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
