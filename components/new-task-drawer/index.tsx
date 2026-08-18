"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, GripVertical, Paperclip, Send, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { useLoc } from "@/lib/i18n/use-i18n";
import { employees } from "@/lib/mock/employees";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign, ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const L = {
  seedWithContext: {
    zh: "你好，我是 {name}。我正在帮你跟进「{campaign}」这个 campaign，可以问我达人匹配、外联进度、报价、风险卡点等任何细节。",
    en: "Hi, I'm {name}. I'm currently on top of the \"{campaign}\" campaign for you — ask me anything about creator matching, outreach progress, quotes, or blockers.",
  },
  seedDefault: {
    zh: "你好，我是 {name} · {role}。告诉我你要做什么 — 可以是新建 campaign、起草外联邮件、拉一批达人候选，或者别的。",
    en: "Hi, I'm {name} · {role}. Tell me what you need — create a campaign, draft outreach emails, pull a creator shortlist, or anything else.",
  },
  newCampaignFallback: { zh: "新 Campaign", en: "New Campaign" },
  campaignCreatedMsg: {
    zh: "好的，我已经创建了「{name}」。预算 ¥{budget}，预计 30 天周期。我正在做 brief 解析，几分钟后会给出达人候选。",
    en: "Done — I've created \"{name}\". Budget ¥{budget}, planned as a 30-day run. I'm parsing the brief now and will surface creator candidates in a few minutes.",
  },
  campaignCardSummary: {
    zh: "预算 ¥{budget} · {platforms} · {name} 负责",
    en: "Budget ¥{budget} · {platforms} · Owned by {name}",
  },
  nonCampaignReply: {
    zh: "好的，我记下了。需要我帮你转成一个 campaign 任务么？告诉我大致预算和周期，我就开干。",
    en: "Got it, noted. Want me to turn this into a campaign task? Give me a rough budget and timeline and I'll get started.",
  },
  resizeAria: { zh: "拖动调整数字员工侧板宽度", en: "Drag to resize the digital employee panel" },
  askEmployeeTitle: { zh: "Ask 数字员工", en: "Ask Digital Employee" },
  clear: { zh: "清空", en: "Clear" },
  closeChat: { zh: "关闭对话", en: "Close chat" },
  assignTo: { zh: "派给", en: "Assign to" },
  thinking: { zh: "{name} 正在思考…", en: "{name} is thinking…" },
  quickPrompt1: {
    zh: "帮我建一个 618 美妆 campaign，预算 5 万",
    en: "Create a 618 beauty campaign with a ¥50k budget",
  },
  quickPrompt2: {
    zh: "给上周联系过没回的达人发一封跟进邮件",
    en: "Send a follow-up email to creators who didn't reply last week",
  },
  inputPlaceholder: { zh: "告诉员工你要做什么…", en: "Tell your employee what to do…" },
  inputHint: {
    zh: "Enter 发送 · Shift+Enter 换行 · 关闭后会保存到 {name} 的对话任务",
    en: "Enter to send · Shift+Enter for a new line · Saved to {name}'s chat tasks on close",
  },
  campaignCreated: { zh: "已创建 Campaign", en: "Campaign Created" },
  openDetails: { zh: "点击打开详情 →", en: "Open details →" },
} as const;

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export function NewTaskDrawer() {
  const {
    chatOpen,
    closeChat,
    chatPanelWidth,
    setChatPanelWidth,
    activeEmployeeId,
    setActiveEmployee,
    messages,
    pushMessage,
    resetChat,
    addCampaign,
    markShimmer,
    chatCampaignContext,
  } = useUIStore();
  const router = useRouter();
  const l = useLoc();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = chatPanelWidth;
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        // Panel is on the right — dragging left grows it.
        const delta = startX - ev.clientX;
        setChatPanelWidth(startWidth + delta);
      };
      const onUp = () => {
        setIsResizing(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [chatPanelWidth, setChatPanelWidth],
  );

  const activeEmployee = employees.find((e) => e.id === activeEmployeeId) ?? employees[0];

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      const seed = chatCampaignContext
        ? fill(l(L.seedWithContext), {
            name: activeEmployee.name,
            campaign: chatCampaignContext.name,
          })
        : fill(l(L.seedDefault), {
            name: activeEmployee.name,
            role: l(activeEmployee.role),
          });
      pushMessage({
        id: genId(),
        role: "employee",
        ts: nowIso(),
        content: seed,
      });
    }
  }, [chatOpen, activeEmployee, messages.length, pushMessage, chatCampaignContext, l]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      content: text,
      ts: nowIso(),
    };
    pushMessage(userMsg);
    setInput("");
    setTyping(true);

    // Scripted mock employee response
    setTimeout(() => {
      const isCampaignAsk = /campaign|项目|活动|建一个|创建|create|new campaign|launch/i.test(text);
      if (isCampaignAsk) {
        const newId = `cmp-${genId()}`;
        const extracted = extractName(text);
        const campaignName = extracted
          ? { zh: extracted, en: extracted }
          : L.newCampaignFallback;
        const newCampaign: Campaign = {
          id: newId,
          name: campaignName,
          brand: { zh: "待确认品牌", en: "Brand to confirm" },
          description: { zh: text, en: text },
          goal: "brand_awareness",
          category: "Other",
          status: "draft",
          startAt: new Date().toISOString().slice(0, 10),
          endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          ownerId: activeEmployee.id,
          proposed: 0,
          collaborating: 0,
          delivered: 0,
          budget: extractBudget(text) ?? 30000,
          spent: 0,
          platforms: ["RedNote"],
          briefSummary: { zh: text, en: text },
          compensation: {
            flatFee: { currency: "CNY", minFee: 0, maxFee: 0, totalBudget: extractBudget(text) ?? 30000 },
            freeProducts: [],
          },
          creatorRequirements: {
            regions: [],
            languages: [],
            categories: [],
            minimumFollowers: 0,
            contentTypes: [],
          },
          attachments: [],
          toggles: { poolFirst: true, sampling: false, adCode: true },
          step: "brief",
          updatedAt: nowIso(),
        };
        addCampaign(newCampaign);
        markShimmer(newId);

        pushMessage({
          id: genId(),
          role: "employee",
          ts: nowIso(),
          content: fill(l(L.campaignCreatedMsg), {
            name: l(newCampaign.name),
            budget: newCampaign.budget.toLocaleString(),
          }),
          card: {
            kind: "campaign",
            title: l(newCampaign.name),
            summary: fill(l(L.campaignCardSummary), {
              budget: newCampaign.budget.toLocaleString(),
              platforms: newCampaign.platforms.join(" / "),
              name: activeEmployee.name,
            }),
            href: newId,
          },
        });
      } else {
        pushMessage({
          id: genId(),
          role: "employee",
          ts: nowIso(),
          content: l(L.nonCampaignReply),
        });
      }
      setTyping(false);
    }, 900);
  }

  function handleCardClick(campaignId: string) {
    closeChat();
    router.push(`/campaigns/${campaignId}`);
  }

  return (
    <AnimatePresence initial={false}>
      {chatOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: chatPanelWidth, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={
            isResizing
              ? { duration: 0 }
              : { type: "spring", damping: 30, stiffness: 260 }
          }
          className="relative flex flex-shrink-0 flex-col self-stretch overflow-hidden rounded-panel bg-surface shadow-panel"
        >
          {/* Resize handle — sits at the left edge, sits visually in the gap */}
          <button
            type="button"
            aria-label={l(L.resizeAria)}
            onMouseDown={startResize}
            className={cn(
              "group/resize absolute left-0 top-0 z-20 flex h-full w-2 cursor-col-resize items-center justify-center",
              isResizing && "bg-soft-pink/40",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-4 items-center justify-center rounded-full bg-surface text-slate shadow-elev opacity-0 transition-opacity duration-150",
                "group-hover/resize:opacity-100",
                isResizing && "opacity-100 text-brand",
              )}
            >
              <GripVertical className="h-3.5 w-3.5" />
            </span>
          </button>
          <div
            className="flex h-full min-h-0 flex-col"
            style={{ width: chatPanelWidth }}
          >
          {/* Header */}
          <div className="flex h-14 items-center gap-2 border-b border-border bg-surface px-4">
            <img
              src={activeEmployee.avatar}
              alt=""
              className="h-7 w-7 flex-shrink-0 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold tracking-tight text-ink">
                {chatCampaignContext ? l(L.askEmployeeTitle) : activeEmployee.name}
              </div>
              {chatCampaignContext ? (
                <div className="flex items-center gap-1 text-[11px] text-brand">
                  <Sparkles className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{chatCampaignContext.name}</span>
                </div>
              ) : (
                <div className="truncate text-[11px] text-muted">{l(activeEmployee.role)}</div>
              )}
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="text-[12px] text-slate transition-colors hover:text-ink"
            >
              {l(L.clear)}
            </button>
            <button
              type="button"
              onClick={closeChat}
              aria-label={l(L.closeChat)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate transition-colors hover:bg-surface-warm hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Employee picker */}
          <div className="flex items-center gap-2 border-b border-border bg-surface-warm px-4 py-2">
            <span className="text-[11px] text-muted">{l(L.assignTo)}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[12px] hover:border-border-strong"
                >
                  <img src={activeEmployee.avatar} alt="" className="h-4 w-4 rounded-full" />
                  <span className="font-medium text-ink">{activeEmployee.name}</span>
                  <ChevronDown className="h-3 w-3 text-muted" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {employees.map((e) => (
                  <DropdownMenuItem
                    key={e.id}
                    onClick={() => {
                      setActiveEmployee(e.id);
                      resetChat();
                    }}
                  >
                    <img src={e.avatar} alt="" className="h-5 w-5 rounded-full" />
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-ink">{e.name}</div>
                      <div className="text-[11px] text-muted">{l(e.role)}</div>
                    </div>
                    {e.id === activeEmployee.id && <Check className="h-3.5 w-3.5 text-brand" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  employeeAvatar={activeEmployee.avatar}
                  onCardClick={handleCardClick}
                />
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-[12px] text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  <span>{fill(l(L.thinking), { name: activeEmployee.name })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-surface p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <QuickPrompt text={l(L.quickPrompt1)} onPick={setInput} />
              <QuickPrompt text={l(L.quickPrompt2)} onPick={setInput} />
            </div>
            <div className="flex items-end gap-2 rounded-[12px] border border-border bg-surface p-2">
              <button type="button" className="rounded-full p-1.5 text-muted hover:bg-page">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={l(L.inputPlaceholder)}
                rows={2}
                className="flex-1 resize-none border-0 bg-transparent text-[13px] leading-relaxed text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "rounded-[8px] p-2 transition-colors",
                  input.trim()
                    ? "bg-brand text-white shadow-cta hover:bg-brand-hover"
                    : "bg-surface-warm text-muted",
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 px-1 text-[10.5px] text-muted">
              {fill(l(L.inputHint), { name: activeEmployee.name })}
            </div>
          </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function QuickPrompt({ text, onPick }: { text: string; onPick: (t: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(text)}
      className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-slate hover:border-border-strong hover:text-ink"
    >
      {text}
    </button>
  );
}

function MessageBubble({
  msg,
  employeeAvatar,
  onCardClick,
}: {
  msg: ChatMessage;
  employeeAvatar: string;
  onCardClick: (id: string) => void;
}) {
  const l = useLoc();
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-soft-pink px-4 py-2.5 text-[13px] text-ink">
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <img src={employeeAvatar} alt="" className="mt-0.5 h-7 w-7 rounded-full" />
      <div className="max-w-[80%] space-y-2">
        <div className="rounded-2xl rounded-tl-md border border-border bg-surface px-4 py-2.5 text-[13px] text-ink">
          {msg.content}
        </div>
        {msg.card?.kind === "campaign" && msg.card.href && (
          <button
            type="button"
            onClick={() => onCardClick(msg.card!.href!)}
            className="block w-full rounded-2xl border border-border bg-surface p-3 text-left transition-colors hover:border-brand"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span className="text-[12px] font-medium text-brand-strong">{l(L.campaignCreated)}</span>
            </div>
            <div className="mt-1 text-[14px] font-semibold text-ink">{msg.card.title}</div>
            <div className="text-[12px] text-slate">{msg.card.summary}</div>
            <div className="mt-2 text-[11px] text-brand-strong">{l(L.openDetails)}</div>
          </button>
        )}
      </div>
    </div>
  );
}

function extractName(text: string): string | null {
  const m = text.match(/(?:建|创建|新建)(?:一?个)?「?([^「」,。\n]{1,20}?)」?(?:[活动campaign项目]|$)/);
  if (m) return m[1].trim();
  const m3 = text.match(/(?:create|build|launch|start)\s+(?:a|an|the)?\s*(.{1,40}?)\s*campaign/i);
  if (m3 && m3[1].trim()) return m3[1].trim();
  const m2 = text.match(/^(.+?)(?:campaign|活动|项目)/i);
  if (m2) return m2[1].trim();
  return null;
}

function extractBudget(text: string): number | null {
  const m = text.match(/(?:预算|budget)[^0-9¥$]*[¥$]?\s*([0-9.]+)\s*(万|w|k)?/i)
    ?? text.match(/[¥$]\s*([0-9.]+)\s*(万|w|k)?\s*(?:budget|预算)/i);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  const unit = (m[2] ?? "").toLowerCase();
  if (unit === "万" || unit === "w") return n * 10000;
  if (unit === "k") return n * 1000;
  return n;
}
