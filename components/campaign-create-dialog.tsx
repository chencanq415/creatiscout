"use client";

import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  FileUp,
  ImageIcon,
  MessageSquareText,
  Paperclip,
  PenLine,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const L = {
  eyebrow: { zh: "创建方式", en: "CREATE CAMPAIGN" },
  title: { zh: "如何创建这个 Campaign？", en: "How would you like to create this campaign?" },
  subtitle: {
    zh: "选择最适合你当前素材的方式，后续都可以继续编辑。",
    en: "Choose the best starting point. You can edit everything later.",
  },
  recommended: { zh: "推荐", en: "RECOMMENDED" },
  aiTitle: { zh: "通过 AI 创建 Campaign", en: "Create with AI" },
  aiDescription: {
    zh: "像和同事沟通一样描述需求，AI 会追问并整理成完整 Campaign。",
    en: "Describe the campaign naturally. AI will ask follow-up questions and structure the details.",
  },
  conversation: { zh: "对话创建", en: "Conversational" },
  images: { zh: "支持图片", en: "Images" },
  files: { zh: "支持文件", en: "Files" },
  aiAction: { zh: "开始与 AI 对话", en: "Start with AI" },
  briefTitle: { zh: "上传 Brief 解析为 Campaign", en: "Import a campaign brief" },
  briefDescription: {
    zh: "上传 PDF、Word、PPT 或图片，提取品牌、周期、平台和达人要求。",
    en: "Upload a PDF, document, deck, or image to extract campaign requirements.",
  },
  manualTitle: { zh: "手动添加 Campaign", en: "Add campaign manually" },
  manualDescription: {
    zh: "从空白表单开始，逐项填写 Campaign 信息。",
    en: "Start from a blank form and enter each campaign detail.",
  },
} as const;

export function CampaignCreateDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const l = useLoc();
  const router = useRouter();
  const openChat = useUIStore((state) => state.openChat);

  function chooseAI() {
    onOpenChange(false);
    openChat("lucy");
  }

  function chooseRoute(mode: "brief" | "manual") {
    onOpenChange(false);
    router.push(`/campaigns/new?mode=${mode}`);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-[3px] data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-[760px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] border border-white/70 bg-surface shadow-panel outline-none">
          <div className="relative border-b border-border bg-[linear-gradient(135deg,#fff7fa_0%,#ffffff_55%,#effaf9_100%)] px-7 py-6">
            <Dialog.Close
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
              {l(L.eyebrow)}
            </div>
            <Dialog.Title className="mt-2 pr-10 text-[25px] font-bold tracking-[-0.025em] text-navy">
              {l(L.title)}
            </Dialog.Title>
            <Dialog.Description className="mt-1.5 text-[12.5px] text-slate">
              {l(L.subtitle)}
            </Dialog.Description>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            <button
              type="button"
              onClick={chooseAI}
              className="group relative w-full overflow-hidden rounded-[17px] border border-brand/25 bg-[linear-gradient(115deg,#fff0f5_0%,#fff8fb_45%,#eefaf8_100%)] p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/45 hover:shadow-elev"
            >
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-5 -translate-y-6 rounded-full bg-brand/10 blur-2xl" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[16px] bg-brand text-white shadow-cta">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[17px] font-bold text-navy">{l(L.aiTitle)}</h3>
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[8.5px] font-bold tracking-wider text-white">
                      {l(L.recommended)}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-[560px] text-[11.5px] leading-5 text-slate">
                    {l(L.aiDescription)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Feature icon={MessageSquareText} label={l(L.conversation)} />
                    <Feature icon={ImageIcon} label={l(L.images)} />
                    <Feature icon={Paperclip} label={l(L.files)} />
                  </div>
                </div>
                <span className="flex flex-shrink-0 items-center gap-1 text-[11.5px] font-semibold text-brand-strong">
                  {l(L.aiAction)}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>

            <div className="grid gap-3 sm:grid-cols-2">
              <CreationOption
                icon={FileUp}
                title={l(L.briefTitle)}
                description={l(L.briefDescription)}
                onClick={() => chooseRoute("brief")}
              />
              <CreationOption
                icon={PenLine}
                title={l(L.manualTitle)}
                description={l(L.manualDescription)}
                onClick={() => chooseRoute("manual")}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white/80 px-2.5 py-1 text-[9.5px] font-medium text-slate shadow-card">
      <Icon className="h-3 w-3 text-brand" />
      {label}
    </span>
  );
}

function CreationOption({
  icon: Icon,
  title,
  description,
  onClick,
}: { icon: typeof Sparkles; title: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[128px] gap-3.5 rounded-[14px] border border-border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card"
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-surface-warm text-slate group-hover:bg-soft-pink group-hover:text-brand">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center justify-between gap-2 text-[13.5px] font-bold text-navy">
          {title}
          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </span>
        <span className="mt-1.5 block text-[10.5px] leading-[17px] text-muted">{description}</span>
      </span>
    </button>
  );
}
