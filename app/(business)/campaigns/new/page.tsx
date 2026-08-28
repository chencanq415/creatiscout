"use client";

import {
  AIWorkflowConfig,
  aiWorkflowStepLabels,
  getDefaultAIWorkflow,
} from "@/components/campaigns/ai-workflow-config";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type {
  Campaign,
  CampaignCurrency,
  CampaignGiftCard,
  CampaignGoal,
  CampaignProduct,
  CampaignStatus,
} from "@/lib/types";
import { cn, getBrandCoverTheme } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileText,
  FileUp,
  Gift,
  ImageIcon,
  Link2,
  PackagePlus,
  Paperclip,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const L = {
  back: { zh: "返回营销活动", en: "Back to Campaigns" },
  title: { zh: "新建营销活动", en: "Create campaign" },
  subtitle: {
    zh: "一键创建营销活动，AI 全程自动跟进，15 秒锁定高质量达人。",
    en: "Create a campaign in one click. AI automates every step—from matching to follow-up—and connects you with high-quality creators in as little as 15 seconds.",
  },
  basic: { zh: "基础信息", en: "Basic information" },
  basicSub: { zh: "设定营销活动的品牌、目标与有效期，为后续达人匹配提供依据。", en: "Set the brand, goal, and timeline that guide creator matching." },
  brand: { zh: "品牌", en: "Brand" },
  campaignName: { zh: "活动名称", en: "Campaign name" },
  description: { zh: "描述（可选）", en: "Description (optional)" },
  goal: { zh: "营销目标", en: "Goal" },
  category: { zh: "品类", en: "Category" },
  duration: { zh: "活动有效期", en: "Campaign duration" },
  ongoing: { zh: "长期进行", en: "Ongoing" },
  startDate: { zh: "开始日期", en: "Start date" },
  endDate: { zh: "结束日期", en: "End date" },
  image: { zh: "活动封面（可选）", en: "Campaign image (optional)" },
  imageHint: {
    zh: "未添加图片时，会自动使用品牌名生成默认封面。",
    en: "If no image is added, the brand name becomes the default cover.",
  },
  compensation: { zh: "合作方式", en: "Compensation" },
  compensationSub: {
    zh: "选择你希望如何与达人合作，可灵活组合多种合作方式。",
    en: "Choose how you’d like to collaborate with creators. Combine one or more methods to fit your campaign.",
  },
  flatFeeGuide: { zh: "为每个合作支付固定的费用。", en: "Pay a fixed fee for each collaboration." },
  commissionGuide: { zh: "通过发放佣金链接与达人合作，按效果进行付费。", en: "Collaborate with creators through affiliate links and pay based on performance." },
  productGuide: { zh: "提供免费的产品给达人进行合作。", en: "Provide complimentary products to creators as part of the collaboration." },
  singleRate: { zh: "单次合作报价", en: "Fee range per creator" },
  commissionPolicy: { zh: "佣金政策", en: "Commission policy" },
  rateByPercent: { zh: "按订单比例", en: "Percentage of each order" },
  rateByAmount: { zh: "每单固定金额", en: "Fixed amount per order" },
  perOrderAmount: { zh: "每单金额", en: "Amount per order" },
  affiliateHint: { zh: "达人接受合作后，该佣金链接会随合作信息发送给达人。", en: "Once a creator accepts, this affiliate link will be sent with the collaboration details." },
  flatFee: { zh: "固定费用", en: "Flat fee" },
  commission: { zh: "佣金", en: "Commission" },
  freeProduct: { zh: "免费产品", en: "Free product" },
  giftCard: { zh: "礼品卡", en: "Gift card" },
  currency: { zh: "币种", en: "Currency" },
  minFee: { zh: "最低费用", en: "Min fee" },
  maxFee: { zh: "最高费用", en: "Max fee" },
  totalBudget: { zh: "总预算", en: "Total budget" },
  commissionRate: { zh: "佣金比例（%）", en: "Commission rate (%)" },
  affiliateLink: { zh: "分销链接", en: "Affiliate link" },
  addProduct: { zh: "添加产品", en: "Add product" },
  productName: { zh: "产品名称", en: "Product name" },
  value: { zh: "价值", en: "Value" },
  productImage: { zh: "产品图片", en: "Product image" },
  productLink: { zh: "产品链接", en: "Product link" },
  giftCardName: { zh: "礼品卡名称", en: "Gift card name" },
  giftCardImage: { zh: "礼品卡图片", en: "Gift card image" },
  creatorRequirements: { zh: "达人要求", en: "Creator requirements" },
  creatorRequirementsSub: {
    zh: "定义达人的地区、语言和类型要求，并分别设置各平台的内容要求。",
    en: "Set creator requirements for region, language, and category, then define content requirements for each social platform.",
  },
  regions: { zh: "达人地区", en: "Creator region" },
  languages: { zh: "语言", en: "Language" },
  creatorCategories: { zh: "达人类目", en: "Category" },
  platforms: { zh: "交付平台", en: "Platform" },
  minimumFollowers: { zh: "粉丝门槛", en: "Follower minimum" },
  contentTypes: { zh: "内容类型", en: "Content type" },
  deliverables: { zh: "平台要求", en: "Social Platform" },
  requirementsNotes: { zh: "备注", en: "Notes" },
  selectMultiple: { zh: "可多选", en: "Select one or more" },
  uploadImage: { zh: "上传图片", en: "Upload image" },
  replaceImage: { zh: "更换图片", en: "Replace image" },
  terms: { zh: "条款与附件", en: "Terms & attachments" },
  termsSub: { zh: "设置合作细则和相关材料。", en: "Set collaboration terms and supporting materials." },
  termsConditions: { zh: "合作条款", en: "Terms & conditions" },
  attachments: { zh: "附件", en: "Attachment" },
  saveDraft: { zh: "保存草稿", en: "Save draft" },
  create: { zh: "创建并开始营销活动", en: "Create and start campaign" },
  required: {
    zh: "请填写品牌、活动名称、营销目标、品类和开始日期。",
    en: "Brand, campaign name, goal, category, and a start date are required.",
  },
  briefImport: { zh: "上传营销活动 Brief", en: "Upload campaign brief" },
  briefImportSub: {
    zh: "支持 PDF、Word、PPT、表格和图片。AI 将解析品牌、周期、平台、预算和达人要求，你可以在下方校对结果。",
    en: "Supports PDFs, documents, decks, spreadsheets, and images. AI will extract the brand, dates, platforms, budget, and creator requirements for review below.",
  },
  chooseBrief: { zh: "选择 Brief 文件", en: "Choose brief files" },
  readyToParse: { zh: "已准备解析", en: "Ready to parse" },
  campaignStage: { zh: "创建营销活动", en: "Create Campaign" },
  workflowStage: { zh: "AI 工作流配置", en: "AI Workflow" },
  campaignStageSub: {
    zh: "完成营销活动信息与合作条件",
    en: "Complete campaign information and collaboration terms",
  },
  workflowStageSub: {
    zh: "配置 AI 如何匹配、建联、跟进与复盘",
    en: "Configure how AI matches, reaches out, follows up, and reports",
  },
  previous: { zh: "上一步", en: "Previous" },
  next: { zh: "下一步", en: "Next" },
} as const;

type CreateTab = "details" | "workflow";

const goals: CampaignGoal[] = [
  "brand_awareness",
  "content_production",
  "conversion_sales",
  "engagement",
];
const goalLabels: Record<CampaignGoal, { zh: string; en: string }> = {
  brand_awareness: { zh: "品牌认知", en: "Brand awareness" },
  content_production: { zh: "内容生产", en: "Content production" },
  conversion_sales: { zh: "转化 / 销售", en: "Conversion / sales" },
  engagement: { zh: "互动增长", en: "Engagement" },
};
const currencies: CampaignCurrency[] = ["USD", "CNY", "EUR", "GBP"];
const campaignCategories = ["Beauty & Skincare", "Fashion", "Food & Beverage", "Sports & Fitness", "Gaming", "Lifestyle"];
const creatorCategories = ["Beauty", "Fashion", "Lifestyle", "Fitness", "Food", "Gaming", "Travel", "Tech"];
const creatorRegions = ["United States", "United Kingdom", "Canada", "Australia", "Singapore", "China"];
const creatorLanguages = ["English", "Chinese", "Spanish", "French", "German", "Japanese"];
const platforms = ["TikTok", "Instagram", "YouTube"] as const;
const deliverableTypes: Record<(typeof platforms)[number], string[]> = {
  TikTok: ["Post", "Video", "Story"],
  Instagram: ["Reel", "Story", "Post"],
  YouTube: ["Short", "Video", "Live Stream"],
};
const splitList = (value: string) =>
  value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
const makeProduct = (): CampaignProduct => ({
  id: `product-${Math.random().toString(36).slice(2, 9)}`,
  name: "",
  currency: "USD",
  value: 0,
});
const makeGiftCard = (): CampaignGiftCard => ({
  id: `gift-${Math.random().toString(36).slice(2, 9)}`,
  name: "",
  currency: "USD",
  value: 0,
});
type DeliverableConfig = {
  platform: (typeof platforms)[number];
  minimumFollowers: number;
  contentTypes: string;
  notes: string;
};
const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function NewCampaignPage() {
  return (
    <Suspense fallback={null}>
      <NewCampaignContent />
    </Suspense>
  );
}

function NewCampaignContent() {
  const l = useLoc();
  const router = useRouter();
  const searchParams = useSearchParams();
  const briefMode = searchParams.get("mode") === "brief";
  const addCampaign = useUIStore((state) => state.addCampaign);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<CreateTab>("details");
  const [compactHeader, setCompactHeader] = useState(false);
  const [basic, setBasic] = useState({
    brand: "",
    name: "",
    description: "",
    goal: "" as CampaignGoal,
    category: "",
    startAt: "",
    endAt: "",
    ongoing: false,
    image: "",
  });
  const [enabled, setEnabled] = useState({
    flatFee: false,
    commission: false,
    products: false,
  });
  const [flatFee, setFlatFee] = useState({
    currency: "USD" as CampaignCurrency,
    minFee: 0,
    maxFee: 0,
    totalBudget: 0,
  });
  const [commission, setCommission] = useState({
    mode: "percentage" as "percentage" | "amount",
    rate: 0,
    perOrderAmount: 0,
    currency: "USD" as CampaignCurrency,
    affiliateLink: "",
  });
  const [products, setProducts] = useState<CampaignProduct[]>([]);
  const [freeProductMode, setFreeProductMode] = useState<"product" | "gift_card">("product");
  const [giftCards, setGiftCards] = useState<CampaignGiftCard[]>([]);
  const [requirements, setRequirements] = useState({
    regions: "",
    languages: "",
    categories: "",
  });
  const [deliverableConfigs, setDeliverableConfigs] = useState<DeliverableConfig[]>([]);
  const [terms, setTerms] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [aiWorkflow, setAIWorkflow] = useState(() => getDefaultAIWorkflow(l));

  const generateTerms = () => setTerms(l({
    zh: "1. 创作者发布内容时需按要求添加 Link in Bio 或指定链接。\n2. 内容不得包含违法、违规、误导性或与品牌价值观不符的表述。\n3. 发布前需提交内容供品牌方审核，审核通过后方可发布。\n4. 创作者授权品牌方在约定期限内用于品牌自有渠道的传播与推广。",
    en: "1. Include the required link in bio or designated link when publishing content.\n2. Do not include unlawful, misleading, or brand-inappropriate content.\n3. Submit content for brand approval before publishing.\n4. Grant the brand permission to use approved content on its owned channels for the agreed period.",
  }));

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;
    const updateHeader = () => setCompactHeader(scrollContainer.scrollTop > 240);
    updateHeader();
    scrollContainer.addEventListener("scroll", updateHeader, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(""), 4200);
    return () => window.clearTimeout(timer);
  }, [error]);

  function submit(status: CampaignStatus) {
    if (!basic.brand.trim() || !basic.name.trim() || !basic.goal || !basic.category || !basic.startAt || (!basic.ongoing && !basic.endAt)) {
      setError(l(L.required));
      return;
    }
    const campaign: Campaign = {
      id: `cmp-${Math.random().toString(36).slice(2, 10)}`,
      name: { zh: basic.name.trim(), en: basic.name.trim() },
      brand: { zh: basic.brand.trim(), en: basic.brand.trim() },
      description: basic.description ? { zh: basic.description, en: basic.description } : undefined,
      image: basic.image || undefined,
      goal: basic.goal,
      category: basic.category || "Other",
      status,
      startAt: basic.startAt,
      endAt: basic.ongoing ? "Ongoing" : basic.endAt,
      ownerId: "lucy",
      proposed: 0,
      collaborating: 0,
      delivered: 0,
      budget: enabled.flatFee ? flatFee.totalBudget : 0,
      spent: 0,
      platforms: deliverableConfigs.map((item) => item.platform),
      briefSummary: { zh: basic.description || basic.name, en: basic.description || basic.name },
      compensation: {
        flatFee: enabled.flatFee ? flatFee : undefined,
        commission: enabled.commission
          ? {
              rate: commission.mode === "percentage" ? commission.rate : 0,
              perOrderAmount: commission.mode === "amount" ? commission.perOrderAmount : undefined,
              currency: commission.currency,
              affiliateLink: commission.affiliateLink,
            }
          : undefined,
        freeProducts: enabled.products && freeProductMode === "product" ? products.filter((product) => product.name.trim()) : [],
        giftCard: enabled.products && freeProductMode === "gift_card" ? giftCards[0] : undefined,
        giftCards: enabled.products && freeProductMode === "gift_card" ? giftCards.filter((card) => card.name.trim()) : [],
      },
      creatorRequirements: {
        regions: splitList(requirements.regions),
        languages: splitList(requirements.languages),
        categories: splitList(requirements.categories),
        minimumFollowers: deliverableConfigs.length ? Math.min(...deliverableConfigs.map((item) => item.minimumFollowers)) : 0,
        contentTypes: deliverableConfigs.flatMap((item) => splitList(item.contentTypes)),
        deliverables: deliverableConfigs.map((item) => ({
          platform: item.platform,
          minimumFollowers: item.minimumFollowers,
          contentTypes: splitList(item.contentTypes),
          notes: item.notes || undefined,
        })),
      },
      termsAndConditions: terms || undefined,
      attachments: attachments.map((file) => ({
        id: `attachment-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        size: file.size,
      })),
      client: { zh: basic.brand, en: basic.brand },
      toggles: { poolFirst: true, sampling: enabled.products, adCode: true },
      automation: "full",
      aiWorkflow,
      step: "brief",
      updatedAt: new Date().toISOString(),
    };
    addCampaign(campaign);
    router.push(`/campaigns/${campaign.id}`);
  }

  function validateBasic() {
    if (!basic.brand.trim() || !basic.name.trim() || !basic.goal || !basic.category || !basic.startAt || (!basic.ongoing && !basic.endAt)) {
      setError(l(L.required));
      return false;
    }
    setError("");
    return true;
  }

  function handlePrimary() {
    if (activeTab === "details") {
      if (!validateBasic()) return;
      setActiveTab("workflow");
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    submit("active");
  }

  return (
    <div className="min-h-full bg-surface px-6 py-6 lg:px-8">
      {error && <div role="alert" className="fixed right-6 top-6 z-[70] flex w-[min(380px,calc(100vw-48px))] items-start gap-3 rounded-[10px] border border-brand/25 bg-white px-4 py-3 shadow-floating animate-fade-in"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><p className="flex-1 text-[12px] font-medium leading-5 text-ink">{error}</p><button type="button" onClick={() => setError("")} aria-label="Dismiss" className="rounded-[5px] p-0.5 text-muted transition-colors hover:bg-surface-warm hover:text-ink"><X className="h-3.5 w-3.5" /></button></div>}
      <div className="mx-auto max-w-[1180px]">
        <div>
          <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate hover:text-ink"><ArrowLeft className="h-4 w-4" />{l(L.back)}</Link>
          <div className="mt-4 flex items-start justify-between gap-6"><div><h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1><p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p></div><CampaignActions activeTab={activeTab} onSave={() => submit("draft")} onPrimary={handlePrimary} saveLabel={l(L.saveDraft)} nextLabel={l(L.next)} createLabel={l(L.create)} /></div>
          <div className="mt-6 flex items-center gap-1 border-b border-border"><CreateTabButton step={1} title={l({ zh: "活动详情", en: "Campaign Details" })} active={activeTab === "details"} complete={activeTab === "workflow"} onClick={() => setActiveTab("details")} /><div className="px-1 text-[13px] text-border-strong">→</div><CreateTabButton step={2} title={l(L.workflowStage)} active={activeTab === "workflow"} complete={false} onClick={() => setActiveTab("workflow")} /></div>
        </div>

        {compactHeader && <div className="sticky top-0 z-30 -mx-2 flex h-[58px] items-center justify-between border-b border-border bg-surface px-2 shadow-[0_5px_14px_rgba(24,39,75,0.04)]"><div className="flex min-w-0 items-center gap-1"><CreateTabButton step={1} title={l({ zh: "活动详情", en: "Campaign Details" })} active={activeTab === "details"} complete={activeTab === "workflow"} onClick={() => setActiveTab("details")} /><div className="px-1 text-[13px] text-border-strong">→</div><CreateTabButton step={2} title={l(L.workflowStage)} active={activeTab === "workflow"} complete={false} onClick={() => setActiveTab("workflow")} /></div><CampaignActions compact activeTab={activeTab} onSave={() => submit("draft")} onPrimary={handlePrimary} saveLabel={l(L.saveDraft)} nextLabel={l(L.next)} createLabel={l(L.create)} /></div>}

        {briefMode && <BriefImportPanel files={attachments} onFiles={setAttachments} />}

        <div className="mt-6 grid gap-7 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start">
          <aside className={cn("lg:sticky", compactHeader ? "lg:top-[76px]" : "lg:top-6")}>
            {activeTab === "details" ? (
              <SectionIndex
                key="details-index"
                items={[
                  { id: "campaign-basic", label: l(L.basic) },
                  {
                    id: "campaign-compensation",
                    label: l(L.compensation),
                  },
                  {
                    id: "campaign-creators",
                    label: l(L.creatorRequirements),
                  },
                  { id: "campaign-terms", label: l(L.terms) },
                ]}
              />
            ) : (
              <SectionIndex
                key="workflow-index"
                items={[
                  {
                    id: "workflow-section-1",
                    label: l(aiWorkflowStepLabels[0]),
                  },
                  {
                    id: "workflow-section-2",
                    label: l(aiWorkflowStepLabels[1]),
                  },
                  {
                    id: "workflow-section-3",
                    label: l(aiWorkflowStepLabels[2]),
                  },
                ]}
              />
            )}
          </aside>

          <div className="min-w-0 space-y-5">
            {activeTab === "details" && (
              <FormSection
                id="campaign-basic"
                icon={<FileText className="h-4 w-4" />}
                title={l(L.basic)}
                subtitle={l(L.basicSub)}
              >
                <Field label={l(L.brand)}>
                  <Input value={basic.brand} onChange={(value) => setBasic({ ...basic, brand: value })} placeholder={l({ zh: "例如：Honeylab", en: "e.g. Honeylab" })} />
                </Field>
                <Field label={l(L.campaignName)}>
                  <Input value={basic.name} onChange={(value) => setBasic({ ...basic, name: value })} placeholder={l({ zh: "例如：夏季达人推广", en: "e.g. Summer creator campaign" })} />
                </Field>
                <Field label={l({ zh: "描述", en: "Description" })} optional>
                  <Textarea value={basic.description} onChange={(value) => setBasic({ ...basic, description: value })} placeholder={l({ zh: "简要介绍您的营销活动，帮助达人更好地了解合作内容…", en: "Briefly describe your campaign to help creators understand the collaboration." })} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Field label={l(L.goal)}>
                    <OptionSelect
                      value={basic.goal}
                      onChange={(value) => setBasic({ ...basic, goal: value as CampaignGoal })}
                      placeholder={l({ zh: "选择目标", en: "Select goal" })}
                      options={goals.map((goal) => ({ value: goal, label: l(goalLabels[goal]) }))}
                    />
                  </Field>
                  <Field label={l(L.category)}>
                    <MultiOptionSelect
                      value={basic.category}
                      onChange={(value) => setBasic({ ...basic, category: value })}
                      options={campaignCategories}
                      placeholder={l({ zh: "选择品类", en: "Select category" })}
                    />
                  </Field>
                </div>
                <Field label={l({ zh: "周期", en: "Duration" })} trailing={<ToggleOption label={l(L.ongoing)} checked={basic.ongoing} onChange={(ongoing) => setBasic({ ...basic, ongoing })} />}>
                  <DateRangePicker
                    startAt={basic.startAt}
                    endAt={basic.endAt}
                    ongoing={basic.ongoing}
                    onChange={(startAt, endAt) => setBasic({ ...basic, startAt, endAt })}
                  />
                </Field>
                <Field label={l({ zh: "封面图片", en: "Cover image" })} optional>
                  <ImageUpload value={basic.image} fallback={basic.brand} onChange={(image) => setBasic({ ...basic, image })} label={l({ zh: "上传活动封面", en: "Upload campaign image" })} description={l({ zh: "推荐 1600 × 900 · PNG、JPG 或 WebP", en: "Recommended 1600 × 900 · PNG, JPG or WebP" })} muted />
                </Field>
              </FormSection>
            )}

            {activeTab === "details" && (
              <FormSection
                id="campaign-compensation"
                icon={<WalletCards className="h-4 w-4" />}
                title={l(L.compensation)}
                subtitle={l(L.compensationSub)}
              >
                <div className="grid gap-2.5 md:grid-cols-3">
                  <CompensationGuide active={enabled.flatFee} onClick={() => setEnabled({ ...enabled, flatFee: !enabled.flatFee })} icon={<CircleDollarSign className="h-4 w-4" />} title={l(L.flatFee)} description={l(L.flatFeeGuide)} />
                  <CompensationGuide active={enabled.commission} onClick={() => setEnabled({ ...enabled, commission: !enabled.commission })} icon={<span className="text-[15px] font-bold">%</span>} title={l(L.commission)} description={l(L.commissionGuide)} />
                  <CompensationGuide active={enabled.products} onClick={() => { const next = !enabled.products; setEnabled({ ...enabled, products: next }); if (next && freeProductMode === "product" && products.length === 0) setProducts([makeProduct()]); }} icon={<Gift className="h-4 w-4" />} title={l(L.freeProduct)} description={l(L.productGuide)} />
                </div>
                <CompensationBlock
                  checked={enabled.flatFee}
                  onToggle={() => setEnabled({ ...enabled, flatFee: !enabled.flatFee })}
                  title={l(L.flatFee)}
                  description={l({ zh: "为每位达人支付固定费用，最终报价以你的合作报价为准。", en: "Pay a fixed fee for each creator collaboration. Final rates are based on your offer." })}
                  showToggle={false}
                >
                  {enabled.flatFee && (
                    <div className="space-y-4">
                      <Field label={l(L.singleRate)}>
                        <div className="grid gap-3 md:grid-cols-[120px_1fr_1fr]">
                          <CurrencySelect value={flatFee.currency} onChange={(currency) => setFlatFee({ ...flatFee, currency })} />
                          <NumberInput value={flatFee.minFee} onChange={(minFee) => setFlatFee({ ...flatFee, minFee })} placeholder={l(L.minFee)} />
                          <NumberInput value={flatFee.maxFee} onChange={(maxFee) => setFlatFee({ ...flatFee, maxFee })} placeholder={l(L.maxFee)} />
                        </div>
                      </Field>
                      <Field label={l(L.totalBudget)}>
                        <CurrencyValueInput currency={flatFee.currency} value={flatFee.totalBudget} onCurrencyChange={(currency) => setFlatFee({ ...flatFee, currency })} onValueChange={(totalBudget) => setFlatFee({ ...flatFee, totalBudget })} placeholder={l({ zh: "输入计划用于固定费用合作的总预算", en: "Enter your total flat-fee budget" })} />
                      </Field>
                    </div>
                  )}
                </CompensationBlock>
                <CompensationBlock
                  checked={enabled.commission}
                  onToggle={() => setEnabled({ ...enabled, commission: !enabled.commission })}
                  title={l(L.commission)}
                  description={l({ zh: "提供你的佣金政策和供达人推广的联盟链接。", en: "Provide your commission policy and affiliate link for creators to promote." })}
                  showToggle={false}
                >
                  {enabled.commission && (
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1.5 text-[11px] font-semibold text-ink">{l(L.commissionPolicy)}</div>
                        <p className="mb-2 text-[9.5px] text-muted">{l({ zh: "佣金政策仅供展示，最终结算以你的联盟计划为准。", en: "This is shown for reference only. Final settlement is determined by your affiliate program." })}</p>
                        <div className="grid gap-3 md:grid-cols-2">
                          <ChoiceCard active={commission.mode === "percentage"} onClick={() => setCommission({ ...commission, mode: "percentage" })} title={l({ zh: "按百分比", en: "Percentage" })} description={l({ zh: "按百分比计算每单佣金", en: "Calculate commission as a percentage of each order." })} />
                          <ChoiceCard active={commission.mode === "amount"} onClick={() => setCommission({ ...commission, mode: "amount" })} title={l({ zh: "固定金额", en: "Fixed amount" })} description={l({ zh: "每单结算固定金额", en: "Pay a fixed amount for each order." })} />
                        </div>
                      </div>
                      {commission.mode === "percentage" ? (
                        <Field label={l(L.commissionRate)}><NumberInput value={commission.rate} onChange={(rate) => setCommission({ ...commission, rate })} suffix="%" placeholder={l({ zh: "例如 12", en: "e.g. 12" })} /></Field>
                      ) : (
                        <Field label={l(L.perOrderAmount)}><CurrencyValueInput currency={commission.currency} value={commission.perOrderAmount} onCurrencyChange={(currency) => setCommission({ ...commission, currency })} onValueChange={(perOrderAmount) => setCommission({ ...commission, perOrderAmount })} placeholder={l({ zh: "例如 8", en: "e.g. 8" })} /></Field>
                      )}
                      <Field label={l(L.affiliateLink)} hint={l(L.affiliateHint)}>
                        <Input
                          value={commission.affiliateLink}
                          onChange={(affiliateLink) =>
                            setCommission({ ...commission, affiliateLink })
                          }
                          placeholder="https://"
                          icon={<Link2 className="h-3.5 w-3.5" />}
                        />
                      </Field>
                    </div>
                  )}
                </CompensationBlock>
                <CompensationBlock
                  checked={enabled.products}
                  onToggle={() => setEnabled({ ...enabled, products: !enabled.products })}
                  title={l(L.freeProduct)}
                  description={l({ zh: "添加可提供给达人的产品或礼品卡。", en: "Add products or gift cards you can offer to creators." })}
                  showToggle={false}
                >
                  {enabled.products && (
                    <div className="space-y-4">
                      <Field label={l({ zh: "赠送方式", en: "Offer type" })}>
                        <div className="grid gap-3 md:grid-cols-2">
                          <ChoiceCard active={freeProductMode === "product"} onClick={() => { setFreeProductMode("product"); if (products.length === 0) setProducts([makeProduct()]); }} title={l({ zh: "产品", en: "Product" })} description={l({ zh: "提供产品供达人创作内容", en: "Provide products for creators to make content." })} />
                          <ChoiceCard active={freeProductMode === "gift_card"} onClick={() => { setFreeProductMode("gift_card"); if (giftCards.length === 0) setGiftCards([makeGiftCard()]); }} title={l(L.giftCard)} description={l({ zh: "提供 Gift Card 由达人自行下单", en: "Provide a gift card for creators to place their own order." })} />
                        </div>
                      </Field>
                      {freeProductMode === "product" ? <div className="space-y-3">
                        {products.map((product, index) => (
                          <ProductEditor
                            key={product.id}
                            product={product}
                            index={index}
                            onChange={(next) => setProducts(products.map((item) => (item.id === product.id ? next : item)))}
                            onRemove={() => setProducts(products.filter((item) => item.id !== product.id))}
                          />
                        ))}
                        <button type="button" onClick={() => setProducts([...products, makeProduct()])} className="flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-surface-warm/75 py-2 text-[10.5px] font-medium text-slate transition-colors hover:bg-soft-pink hover:text-brand"><span className="text-[14px] leading-none">+</span>{l(L.addProduct)}</button>
                      </div> : <div className="space-y-3">
                        {giftCards.map((giftCard, index) => <GiftCardEditor key={giftCard.id} giftCard={giftCard} index={index} onChange={(next) => setGiftCards(giftCards.map((card) => card.id === giftCard.id ? next : card))} onRemove={() => setGiftCards(giftCards.filter((card) => card.id !== giftCard.id))} />)}
                        <button type="button" onClick={() => setGiftCards([...giftCards, makeGiftCard()])} className="flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-surface-warm/75 py-2 text-[10.5px] font-medium text-slate transition-colors hover:bg-soft-pink hover:text-brand"><span className="text-[14px] leading-none">+</span>{l({ zh: "添加礼品卡", en: "Add gift card" })}</button>
                      </div>}
                    </div>
                  )}
                </CompensationBlock>
              </FormSection>
            )}

            {activeTab === "details" && (
              <FormSection
                id="campaign-creators"
                icon={<Users className="h-4 w-4" />}
                title={l(L.creatorRequirements)}
                subtitle={l(L.creatorRequirementsSub)}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={l(L.regions)}>
                    <MultiOptionSelect value={requirements.regions} onChange={(regions) => setRequirements({ ...requirements, regions })} options={creatorRegions} placeholder={l({ zh: "选择地区", en: "Select regions" })} />
                  </Field>
                  <Field label={l(L.languages)}>
                    <MultiOptionSelect value={requirements.languages} onChange={(languages) => setRequirements({ ...requirements, languages })} options={creatorLanguages} placeholder={l({ zh: "选择语言", en: "Select languages" })} />
                  </Field>
                  <Field label={l(L.creatorCategories)}>
                    <MultiOptionSelect value={requirements.categories} onChange={(categories) => setRequirements({ ...requirements, categories })} options={creatorCategories} placeholder={l({ zh: "选择类目", en: "Select categories" })} />
                  </Field>
                </div>
                <div className="mt-5 border-t border-border pt-5">
                  <Field label={l(L.deliverables)}>
                    <div className="grid gap-2 md:grid-cols-3">
                      {platforms.map((platform) => {
                        const active = deliverableConfigs.some((item) => item.platform === platform);
                        return <ChoiceCard key={platform} active={active} title={platform} onClick={() => setDeliverableConfigs(active ? deliverableConfigs.filter((item) => item.platform !== platform) : [...deliverableConfigs, { platform, minimumFollowers: 0, contentTypes: "", notes: "" }])} />;
                      })}
                    </div>
                  </Field>
                  {deliverableConfigs.length > 0 && <div className="mt-4 space-y-3">
                    {deliverableConfigs.map((config) => <DeliverableConfiguration key={config.platform} config={config} onChange={(next) => setDeliverableConfigs(deliverableConfigs.map((item) => item.platform === config.platform ? next : item))} />)}
                  </div>}
                </div>
              </FormSection>
            )}

            {activeTab === "details" && (
              <FormSection
                id="campaign-terms"
                icon={<Paperclip className="h-4 w-4" />}
                title={l(L.terms)}
                subtitle={l(L.termsSub)}
              >
                <Field label={l(L.termsConditions)} trailing={<button type="button" onClick={generateTerms} className="inline-flex items-center gap-1 rounded-[5px] px-1.5 py-1 text-[9.5px] font-medium text-brand transition-colors hover:bg-soft-pink"><Sparkles className="h-3 w-3" />{l({ zh: "AI 生成", en: "Generate with AI" })}</button>}>
                  <Textarea value={terms} onChange={setTerms} rows={5} placeholder={l({ zh: "设置本次营销活动的合作细则，例如必须 Link in Bio、不能提及违规内容、内容授权品牌方使用等。", en: "Set collaboration terms for this campaign, such as link-in-bio requirements, prohibited content, or content usage rights for the brand." })} />
                </Field>
                <Field label={l(L.attachments)}>
                  <p className="mb-2 text-[9.5px] leading-4 text-muted">{l({ zh: "你可以把需要提供给创作者的公开材料放在这里，例如 Brief、创作素材等。", en: "Upload materials creators can access, such as briefs or creative assets." })}</p>
                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[10px] border border-dashed border-border-strong bg-surface-warm px-4 py-6 text-[12px] font-medium text-slate transition-colors hover:border-brand/40 hover:text-brand">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white text-muted shadow-card"><Upload className="h-4 w-4" /></span>
                    <span>{attachments.length ? attachments.map((file) => file.name).join(", ") : l({ zh: "上传文件", en: "Upload files" })}</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(event) => setAttachments(Array.from(event.target.files ?? []))}
                    />
                  </label>
                </Field>
              </FormSection>
            )}

            {activeTab === "workflow" && (
              <AIWorkflowConfig
                value={aiWorkflow}
                onChange={setAIWorkflow}
                sectionIds={["workflow-section-1", "workflow-section-2", "workflow-section-3"]}
              />
            )}
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}

function CampaignActions({
  activeTab,
  onSave,
  onPrimary,
  saveLabel,
  nextLabel,
  createLabel,
  compact = false,
}: {
  activeTab: CreateTab;
  onSave: () => void;
  onPrimary: () => void;
  saveLabel: string;
  nextLabel: string;
  createLabel: string;
  compact?: boolean;
}) {
  return <div className="flex shrink-0 gap-2"><Button size={compact ? "sm" : "md"} variant="outline" onClick={onSave}><Save className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />{saveLabel}</Button><Button size={compact ? "sm" : "md"} onClick={onPrimary}>{activeTab === "workflow" ? createLabel : nextLabel}<ArrowRightIcon /></Button></div>;
}

function CreateTabButton({
  step,
  title,
  active,
  complete,
  onClick,
}: {
  step: number;
  title: string;
  active: boolean;
  complete: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-w-0 items-center gap-2.5 px-3 pb-3 pt-2.5 text-left transition-colors sm:min-w-[190px]",
        active ? "text-brand" : "text-slate hover:text-ink",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
          active
            ? "bg-brand text-white"
            : complete
              ? "bg-teal text-white"
              : "border border-border bg-white text-muted",
        )}
      >
        {complete ? "✓" : step}
      </span>
      <span
        className={cn("truncate text-[11.5px] font-semibold", active ? "text-brand" : "text-ink")}
      >
        {title}
      </span>
      <span
        className={cn(
          "absolute inset-x-3 bottom-0 h-[2px] rounded-full",
          active ? "bg-brand" : "bg-transparent",
        )}
      />
    </button>
  );
}

function SectionIndex({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  return (
    <nav aria-label="Section index" className="py-1 pl-1">
      <div className="relative space-y-0.5 before:absolute before:bottom-2 before:left-[6px] before:top-2 before:w-px before:bg-border/80">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveId(item.id);
              document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-[8px] py-2 pl-0.5 pr-2 text-left transition-colors",
              activeId === item.id
                ? "text-ink"
                : "text-muted hover:bg-surface-warm/50 hover:text-slate",
            )}
          >
            <span
              className={cn(
                "relative z-10 h-[9px] w-[9px] flex-shrink-0 rounded-full border-2 transition-colors",
                activeId === item.id
                  ? "border-white bg-navy shadow-[0_0_0_1px_rgba(15,23,42,0.16)]"
                  : "border-white bg-border-strong group-hover:bg-slate",
              )}
            />
            <span
              className={cn(
                "min-w-0 text-[10.5px] leading-4",
                activeId === item.id ? "font-semibold text-ink" : "font-medium text-muted",
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function BriefImportPanel({ files, onFiles }: { files: File[]; onFiles: (files: File[]) => void }) {
  const l = useLoc();
  return (
    <section className="mt-6 overflow-hidden rounded-[16px] border border-brand/25 bg-[linear-gradient(115deg,#fff0f5_0%,#fff8fb_48%,#eefaf8_100%)] shadow-card">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[14px] bg-brand text-white shadow-cta">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold text-navy">{l(L.briefImport)}</h2>
          <p className="mt-1 text-[10.5px] leading-[17px] text-slate">{l(L.briefImportSub)}</p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[9px] bg-brand px-4 text-[11.5px] font-semibold text-white shadow-cta transition-colors hover:bg-brand-hover">
          <FileUp className="h-4 w-4" />
          {files.length ? `${l(L.readyToParse)} · ${files.length}` : l(L.chooseBrief)}
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt"
            className="hidden"
            onChange={(event) => onFiles(Array.from(event.target.files ?? []))}
          />
        </label>
      </div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-brand/10 bg-white/45 px-5 py-3">
          {files.map((file) => (
            <span
              key={`${file.name}-${file.size}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[9.5px] font-medium text-slate shadow-card"
            >
              <FileText className="h-3 w-3 text-brand" />
              {file.name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function FormSection({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-[16px] border border-border bg-surface shadow-card"
    >
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-soft-pink text-brand">
          {icon}
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-navy">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[10px] text-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}
function Field({
  label,
  optional,
  hint,
  trailing,
  children,
}: { label: string; optional?: boolean; hint?: string; trailing?: React.ReactNode; children: React.ReactNode }) {
  const l = useLoc();
  return (
    <div className="block">
      <div className="mb-1.5 flex min-h-4 items-center justify-between gap-3 text-[11px] font-semibold text-ink">
        <span>{label}{optional && <span className="ml-1.5 text-[9.5px] font-medium text-muted">{l({ zh: "可选", en: "Optional" })}</span>}</span>
        {trailing}
      </div>
      {children}
      {hint && <div className="mt-1 text-[9.5px] text-muted">{hint}</div>}
    </div>
  );
}
function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-[8px] border border-border bg-white px-3 text-[12.5px] text-ink outline-none transition-colors focus:border-brand/50",
          icon && "pl-9",
        )}
      />
    </div>
  );
}
function NumberInput({ value, onChange, placeholder, suffix }: { value: number; onChange: (value: number) => void; placeholder?: string; suffix?: string }) {
  return (
    <div className="relative">
      <input type="number" min="0" value={value || ""} placeholder={placeholder} onChange={(event) => onChange(Number(event.target.value))} className="h-10 w-full rounded-[8px] border border-border bg-white px-3 pr-8 text-[12.5px] text-ink outline-none focus:border-brand/50" />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-muted">{suffix}</span>}
    </div>
  );
}
function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
  className = "",
}: { value: string; onChange: (value: string) => void; rows?: number; placeholder?: string; className?: string }) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full resize-y rounded-[8px] border border-border bg-white px-3 py-2.5 text-[12.5px] leading-5 text-ink outline-none focus:border-brand/50 ${className}`}
    />
  );
}
function useDismissOnOutside<T extends HTMLElement>(open: boolean, dismiss: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) dismiss();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [dismiss, open]);
  return ref;
}
function OptionSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder: string }) {
  return <DropdownSelect value={value} onChange={onChange} options={options} placeholder={placeholder} clearable />;
}
function DropdownSelect({ value, onChange, options, placeholder, clearable = false }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder: string; clearable?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useDismissOnOutside<HTMLDivElement>(open, () => setOpen(false));
  const selected = options.find((option) => option.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={cn("flex h-10 w-full items-center rounded-[8px] border border-border bg-white px-3 pr-10 text-left text-[12.5px] outline-none transition-colors hover:border-border-strong", selected ? "text-ink" : "text-muted")}>
        <span>{selected?.label ?? placeholder}</span>
      </button>
      {clearable && selected && !open ? <button type="button" aria-label="Clear selection" onClick={(event) => { event.stopPropagation(); onChange(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[5px] p-0.5 text-muted transition-colors hover:bg-surface-warm hover:text-ink"><X className="h-3.5 w-3.5" /></button> : <ChevronDown className={cn("pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-transform", open && "rotate-180")} />}
      {open && <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-[9px] border border-border bg-white p-1.5 shadow-card">{options.map((option) => <button key={option.value} type="button" onClick={() => { onChange(option.value); setOpen(false); }} className={cn("flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-left text-[11.5px] transition-colors hover:bg-surface-warm", option.value === value && "bg-soft-pink/55 text-brand")}><span>{option.label}</span>{option.value === value && <Check className="h-3.5 w-3.5" />}</button>)}</div>}
    </div>
  );
}
function MultiOptionSelect({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const ref = useDismissOnOutside<HTMLDivElement>(open, () => setOpen(false));
  const selected = splitList(value);
  const label = selected.length ? selected.join(", ") : placeholder;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={cn("flex h-10 w-full items-center gap-3 rounded-[8px] border border-border bg-white px-3 pr-10 text-left text-[12.5px] outline-none transition-colors hover:border-border-strong", selected.length ? "text-ink" : "text-muted")}><span className="truncate">{label}</span></button>
      {selected.length && !open ? <button type="button" aria-label="Clear categories" onClick={(event) => { event.stopPropagation(); onChange(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[5px] p-0.5 text-muted transition-colors hover:bg-surface-warm hover:text-ink"><X className="h-3.5 w-3.5" /></button> : <ChevronDown className={cn("pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-transform", open && "rotate-180")} />}
      {open && <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-[9px] border border-border bg-white p-1.5 shadow-card">{options.map((option) => { const active = selected.includes(option); return <button key={option} type="button" onClick={() => onChange(active ? selected.filter((item) => item !== option).join(", ") : [...selected, option].join(", "))} className={cn("flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[11.5px] transition-colors hover:bg-surface-warm", active && "bg-soft-pink/55 text-brand")}><span className={cn("flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border", active ? "border-brand bg-brand text-white" : "border-border-strong bg-white")}>{active && <Check className="h-3 w-3" />}</span>{option}</button>; })}</div>}
    </div>
  );
}
function DateRangePicker({ startAt, endAt, ongoing, onChange }: { startAt: string; endAt: string; ongoing: boolean; onChange: (startAt: string, endAt: string) => void }) {
  const l = useLoc();
  const [open, setOpen] = useState(false);
  const ref = useDismissOnOutside<HTMLDivElement>(open, () => setOpen(false));
  const [draftStart, setDraftStart] = useState(startAt);
  const [draftEnd, setDraftEnd] = useState(endAt);
  const initialDate = startAt ? new Date(`${startAt}T12:00:00`) : new Date();
  const [month, setMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const dateText = startAt ? `${formatCampaignDate(startAt, l)}${ongoing ? ` — ${l({ zh: "持续进行", en: "ongoing" })}` : endAt ? ` — ${formatCampaignDate(endAt, l)}` : ""}` : l({ zh: "选择活动有效期", en: "Select campaign dates" });
  const chooseDate = (date: string) => {
    if (!draftStart || (draftStart && draftEnd)) { setDraftStart(date); setDraftEnd(""); return; }
    if (date < draftStart) { setDraftEnd(draftStart); setDraftStart(date); } else setDraftEnd(date);
  };
  return <div ref={ref} className="relative">
    <button type="button" onClick={() => { setDraftStart(startAt); setDraftEnd(endAt); setOpen(!open); }} className={cn("flex h-10 w-full items-center justify-between rounded-[8px] border border-border bg-white px-3 text-left text-[12.5px] outline-none transition-colors hover:border-border-strong", startAt ? "text-ink" : "text-muted")}><span className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{dateText}</span><ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} /></button>
    {open && <div className="absolute z-30 mt-1.5 w-[min(100%,520px)] rounded-[12px] border border-border bg-white p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between"><div><p className="text-[12px] font-semibold text-ink">{l({ zh: "活动有效期", en: "Campaign duration" })}</p><p className="mt-0.5 text-[9.5px] text-muted">{ongoing ? l({ zh: "选择开始日期", en: "Select a start date" }) : l({ zh: "选择开始和结束日期", en: "Select a start and end date" })}</p></div><div className="flex gap-1"><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-[6px] p-1 text-slate hover:bg-surface-warm"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-[6px] p-1 text-slate hover:bg-surface-warm"><ChevronRight className="h-4 w-4" /></button></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><CalendarMonth month={month} startAt={draftStart} endAt={draftEnd} onSelect={chooseDate} /><CalendarMonth month={new Date(month.getFullYear(), month.getMonth() + 1, 1)} startAt={draftStart} endAt={draftEnd} onSelect={chooseDate} /></div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-[10px] text-muted">{draftStart ? `${formatCampaignDate(draftStart, l)}${ongoing ? "" : draftEnd ? ` — ${formatCampaignDate(draftEnd, l)}` : ""}` : l({ zh: "请选择日期", en: "Select dates" })}</span><div className="flex gap-2"><Button type="button" size="sm" variant="ghost" disabled={!draftStart && !draftEnd} onClick={() => { setDraftStart(""); setDraftEnd(""); onChange("", ""); }}>{l({ zh: "清空", en: "Clear" })}</Button><Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>{l({ zh: "取消", en: "Cancel" })}</Button><Button type="button" size="sm" disabled={!draftStart || (!ongoing && !draftEnd)} onClick={() => { onChange(draftStart, ongoing ? "" : draftEnd); setOpen(false); }}>{l({ zh: "应用", en: "Apply" })}</Button></div></div>
    </div>}
  </div>;
}
function CalendarMonth({ month, startAt, endAt, onSelect }: { month: Date; startAt: string; endAt: string; onSelect: (date: string) => void }) {
  const l = useLoc();
  const year = month.getFullYear(); const index = month.getMonth();
  const first = new Date(year, index, 1); const offset = first.getDay(); const days = new Date(year, index + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, cell) => { const day = cell - offset + 1; const current = day >= 1 && day <= days; const date = new Date(year, index, current ? day : day < 1 ? day : day); const iso = toDateInput(date); return { day: date.getDate(), current, iso }; });
  const title = new Intl.DateTimeFormat(l({ zh: "zh-CN", en: "en-US" }), { month: "long", year: "numeric" }).format(month);
  return <div><p className="mb-2 text-[11px] font-semibold text-ink">{title}</p><div className="mb-1 grid grid-cols-7 text-center text-[8px] font-semibold uppercase text-muted">{[l({ zh: "日", en: "Su" }), l({ zh: "一", en: "Mo" }), l({ zh: "二", en: "Tu" }), l({ zh: "三", en: "We" }), l({ zh: "四", en: "Th" }), l({ zh: "五", en: "Fr" }), l({ zh: "六", en: "Sa" })].map((day) => <span key={day}>{day}</span>)}</div><div className="grid grid-cols-7 gap-y-0.5">{cells.map(({ day, current, iso }, cell) => { const chosen = iso === startAt || iso === endAt; const within = Boolean(startAt && endAt && iso > startAt && iso < endAt); return <button key={`${iso}-${cell}`} type="button" onClick={() => onSelect(iso)} className={cn("h-7 rounded-[5px] text-[10px] transition-colors", current ? "text-ink hover:bg-surface-warm" : "text-muted/45", within && "rounded-none bg-soft-pink/50", chosen && "bg-ink font-semibold text-white hover:bg-ink")}>{day}</button>; })}</div></div>;
}
function toDateInput(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function formatCampaignDate(value: string, localize: (text: { zh: string; en: string }) => string) { return new Intl.DateTimeFormat(localize({ zh: "zh-CN", en: "en-US" }), { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
function Select({
  value,
  onChange,
  children,
}: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-[8px] border border-border bg-white px-3 text-[12.5px] text-ink outline-none focus:border-brand/50"
    >
      {children}
    </select>
  );
}
function CurrencySelect({
  value,
  onChange,
}: { value: CampaignCurrency; onChange: (value: CampaignCurrency) => void }) {
  return <DropdownSelect value={value} onChange={(next) => onChange(next as CampaignCurrency)} options={currencies.map((currency) => ({ value: currency, label: currency }))} placeholder="USD" />;
}
function CurrencyValueInput({ currency, value, onCurrencyChange, onValueChange, placeholder = "0" }: { currency: CampaignCurrency; value: number; onCurrencyChange: (currency: CampaignCurrency) => void; onValueChange: (value: number) => void; placeholder?: string }) {
  return <div className="grid grid-cols-[120px_1fr] gap-2"><CurrencySelect value={currency} onChange={onCurrencyChange} /><NumberInput value={value} onChange={onValueChange} placeholder={placeholder} /></div>;
}
function ToggleOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className={cn("inline-flex items-center gap-1.5 text-[10px] font-semibold", checked ? "text-brand" : "text-muted")}><span className={cn("flex h-4 w-4 items-center justify-center rounded-[4px] border", checked ? "border-brand bg-brand text-white" : "border-border-strong bg-white")}>{checked && <Check className="h-3 w-3" />}</span>{label}</button>;
}
function MultiSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  const selected = splitList(value);
  return <div className="flex min-h-10 flex-wrap gap-1.5 rounded-[8px] border border-border bg-white p-1.5">{options.map((option) => { const active = selected.includes(option); return <button key={option} type="button" onClick={() => onChange(active ? selected.filter((item) => item !== option).join(", ") : [...selected, option].join(", "))} className={cn("rounded-[6px] px-2.5 py-1 text-[10.5px] font-medium transition-colors", active ? "bg-soft-pink text-brand" : "bg-surface-warm text-slate hover:text-ink")}>{active && <Check className="mr-1 inline h-3 w-3" />}{option}</button>; })}</div>;
}
function SelectableOptions({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  const selected = splitList(value);
  return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{options.map((option) => { const active = selected.includes(option); return <button key={option} type="button" onClick={() => onChange(active ? selected.filter((item) => item !== option).join(", ") : [...selected, option].join(", "))} className={cn("flex min-h-12 items-center gap-2 rounded-[9px] border px-3 text-left text-[11px] font-semibold transition-colors", active ? "border-brand/40 bg-soft-pink/40 text-brand" : "border-border bg-white text-slate hover:border-border-strong")}>{active ? <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-brand text-white"><Check className="h-3 w-3" /></span> : <span className="h-4 w-4 rounded-[4px] border border-border-strong" />}{option}</button>; })}</div>;
}
function DeliverableConfiguration({ config, onChange }: { config: DeliverableConfig; onChange: (config: DeliverableConfig) => void }) {
  const l = useLoc();
  return <div className="rounded-[10px] border border-border bg-surface-warm/35 p-3">
    <div className="mb-3 flex items-center gap-2"><span className="flex h-6 min-w-6 items-center justify-center rounded-[7px] bg-white px-2 text-[10.5px] font-semibold text-ink shadow-card">{config.platform}</span></div>
    <div className="grid gap-3 md:grid-cols-2">
      <Field label={l(L.minimumFollowers)}><NumberInput value={config.minimumFollowers} onChange={(minimumFollowers) => onChange({ ...config, minimumFollowers })} placeholder={l({ zh: "例如：10,000", en: "e.g. 10,000" })} /></Field>
      <Field label={l(L.contentTypes)}><MultiOptionSelect value={config.contentTypes} onChange={(contentTypes) => onChange({ ...config, contentTypes })} options={deliverableTypes[config.platform]} placeholder={l({ zh: "选择内容类型", en: "Select content types" })} /></Field>
    </div>
    <div className="mt-3"><Field label={l(L.requirementsNotes)}><Textarea value={config.notes} onChange={(notes) => onChange({ ...config, notes })} rows={2} placeholder={l({ zh: "例如：视频需大于 15 秒；产品需在画面中明显露出", en: "e.g. Video must be longer than 15 seconds; product must be clearly visible." })} /></Field></div>
  </div>;
}
function ChoiceCard({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description?: string }) {
  return <button type="button" onClick={onClick} className={cn("rounded-[10px] border p-3 text-left transition-colors", active ? "border-brand/35 bg-soft-pink/35" : "border-border bg-white hover:border-border-strong")}><div className="flex items-center justify-between gap-2"><span className="text-[11px] font-semibold text-ink">{title}</span>{active && <Check className="h-3.5 w-3.5 text-brand" />}</div>{description && <p className="mt-1 text-[9.5px] leading-4 text-muted">{description}</p>}</button>;
}
function CompensationGuide({ icon, title, description, active, onClick }: { icon: React.ReactNode; title: string; description: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("relative h-full min-h-[112px] rounded-[10px] border p-3 text-left transition-colors", active ? "border-brand/40 bg-soft-pink/45" : "border-border bg-surface-warm/60 hover:border-border-strong")}><span className={cn("mb-2 flex h-7 w-7 items-center justify-center rounded-[8px] bg-white text-brand shadow-card", active && "ring-1 ring-brand/15")}>{icon}</span><div className="flex items-center justify-between gap-2"><span className="text-[11px] font-semibold text-ink">{title}</span>{active && <Check className="h-3.5 w-3.5 text-brand" />}</div><p className="mt-1 text-[9.5px] leading-4 text-muted">{description}</p></button>;
}
function ImageUpload({ value, fallback, onChange, label, description, muted = false, compact = false }: { value?: string; fallback?: string; onChange: (image: string) => void; label: string; description?: string; muted?: boolean; compact?: boolean }) {
  const l = useLoc();
  return <label className={cn("flex cursor-pointer items-center gap-3 rounded-[10px] border border-dashed border-border-strong bg-surface-warm/55 p-3 transition-colors hover:border-brand/45", compact && "p-2")}><div className={cn("flex items-center justify-center overflow-hidden rounded-[8px]", compact ? "h-9 w-12" : "h-14 w-20", !value && "bg-white text-muted")}>{value ? <img src={value} alt="" className="h-full w-full object-cover" /> : fallback ? <span style={getBrandCoverTheme(fallback)} className="flex h-full w-full items-center justify-center px-1 text-center text-[9px] font-bold leading-3">{fallback}</span> : <ImageIcon className="h-4 w-4" />}</div><span className="min-w-0 flex-1"><span className={cn("block text-[11px] font-semibold", muted ? "text-muted" : "text-ink")}>{value ? l(L.replaceImage) : label}</span><span className="mt-0.5 block text-[9.5px] text-muted">{description ?? "PNG, JPG or WebP"}</span></span><Upload className="h-4 w-4 text-muted" /><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(onChange); }} /></label>;
}
function CompensationBlock({
  checked,
  onToggle,
  title,
  description,
  showToggle = true,
  children,
}: { checked: boolean; onToggle: () => void; title: string; description?: string; showToggle?: boolean; children: React.ReactNode }) {
  if (!checked && !showToggle) return null;
  return (
    <div className="border-t border-border pt-5">
      {showToggle ? <button type="button" onClick={onToggle} className="flex w-full items-center gap-2.5 text-left"><span className={cn("flex h-4 w-4 items-center justify-center rounded border", checked ? "border-brand bg-brand text-white" : "border-border-strong bg-white")}>{checked && <span className="text-[10px]">✓</span>}</span><span className="text-[11.5px] font-semibold text-ink">{title}</span></button> : <div className="text-[12px] font-semibold text-ink">{title}</div>}
      {description && <p className="mt-1.5 text-[9.5px] leading-4 text-muted">{description}</p>}
      {checked && <div className="mt-5">{children}</div>}
    </div>
  );
}
function ProductEditor({
  product,
  index,
  onChange,
  onRemove,
}: {
  product: CampaignProduct;
  index: number;
  onChange: (product: CampaignProduct) => void;
  onRemove: () => void;
}) {
  const l = useLoc();
  return (
    <div className="rounded-[10px] border border-border bg-white p-3">
      <div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-medium text-muted">Product {index + 1}</span><button type="button" onClick={onRemove} className="text-muted hover:text-brand"><Trash2 className="h-4 w-4" /></button></div>
      <div className="flex items-stretch gap-4">
        <ProductImageUpload value={product.image} fallback={product.name} onChange={(image) => onChange({ ...product, image })} />
        <div className="flex min-h-[304px] min-w-0 flex-1 flex-col">
          <div className="grid gap-2 md:grid-cols-2"><Field label={l(L.productName)}><Input value={product.name} onChange={(name) => onChange({ ...product, name })} placeholder={l({ zh: "例如：夏季礼盒", en: "e.g. Summer gift set" })} /></Field><Field label={l(L.value)}><CurrencyValueInput currency={product.currency} value={product.value} onCurrencyChange={(currency) => onChange({ ...product, currency })} onValueChange={(value) => onChange({ ...product, value })} placeholder={l({ zh: "例如：45", en: "e.g. 45" })} /></Field></div>
          <div className="mt-2.5"><Field label={l(L.productLink)}><Input value={product.productLink ?? ""} onChange={(productLink) => onChange({ ...product, productLink })} placeholder="https://" /></Field></div>
          <div className="mt-2.5 flex min-h-0 flex-1 flex-col">
            <div className="mb-1.5 flex min-h-4 items-center gap-3 text-[11px] font-semibold text-ink"><span>{l({ zh: "描述", en: "Description" })}<span className="ml-1.5 text-[9.5px] font-medium text-muted">{l({ zh: "可选", en: "Optional" })}</span></span></div>
            <Textarea className="min-h-0 flex-1" value={product.description ?? ""} onChange={(description) => onChange({ ...product, description })} rows={2} placeholder={l({ zh: "简要说明产品、卖点或使用方式…", en: "Describe the product, its key benefits, or how to use it…" })} />
          </div>
        </div>
      </div>
    </div>
  );
}
function GiftCardEditor({ giftCard, index, onChange, onRemove }: { giftCard: CampaignGiftCard; index: number; onChange: (giftCard: CampaignGiftCard) => void; onRemove: () => void }) {
  const l = useLoc();
  return <div className="rounded-[10px] border border-border bg-white p-3"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-medium text-muted">Gift card {index + 1}</span><button type="button" onClick={onRemove} className="text-muted hover:text-brand"><Trash2 className="h-4 w-4" /></button></div><div className="flex items-stretch gap-4"><GiftCardImageUpload value={giftCard.image} fallback={giftCard.name} onChange={(image) => onChange({ ...giftCard, image })} /><div className="flex min-h-[255px] min-w-0 flex-1 flex-col"><Field label={l(L.giftCardName)}><Input value={giftCard.name} onChange={(name) => onChange({ ...giftCard, name })} placeholder={l({ zh: "例如：品牌礼品卡", en: "e.g. Brand gift card" })} /></Field><div className="mt-2.5"><Field label={l(L.value)}><CurrencyValueInput currency={giftCard.currency} value={giftCard.value} onCurrencyChange={(currency) => onChange({ ...giftCard, currency })} onValueChange={(value) => onChange({ ...giftCard, value })} placeholder={l({ zh: "例如：50", en: "e.g. 50" })} /></Field></div><div className="mt-2.5 flex min-h-0 flex-1 flex-col"><div className="mb-1.5 flex min-h-4 items-center gap-3 text-[11px] font-semibold text-ink"><span>{l({ zh: "描述", en: "Description" })}<span className="ml-1.5 text-[9.5px] font-medium text-muted">{l({ zh: "可选", en: "Optional" })}</span></span></div><Textarea className="min-h-0 flex-1" value={giftCard.description ?? ""} onChange={(description) => onChange({ ...giftCard, description })} rows={2} placeholder={l({ zh: "说明礼品卡适用范围或使用方式…", en: "Describe how or where this gift card can be used…" })} /></div></div></div></div>;
}
function ProductImageUpload({ value, fallback, onChange }: { value?: string; fallback?: string; onChange: (image: string) => void }) {
  return <label className="relative flex h-[304px] w-[228px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-surface-warm text-muted transition-colors hover:border-brand/45">{value ? <img src={value} alt="" className="h-full w-full object-cover" /> : fallback ? <span style={getBrandCoverTheme(fallback)} className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] font-bold leading-4">{fallback}</span> : <ImageIcon className="h-5 w-5" />}<span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-[6px] bg-white shadow-card"><Upload className="h-3.5 w-3.5" /></span><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(onChange); }} /></label>;
}
function GiftCardImageUpload({ value, fallback, onChange }: { value?: string; fallback?: string; onChange: (image: string) => void }) {
  return <label className="relative flex h-[255px] w-[340px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[8px] border border-dashed border-border-strong bg-surface-warm text-muted transition-colors hover:border-brand/45">{value ? <img src={value} alt="" className="h-full w-full object-cover" /> : fallback ? <span style={getBrandCoverTheme(fallback)} className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] font-bold leading-4">{fallback}</span> : <ImageIcon className="h-5 w-5" />}<span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-[6px] bg-white shadow-card"><Upload className="h-3.5 w-3.5" /></span><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(onChange); }} /></label>;
}
function ArrowRightIcon() {
  return <span aria-hidden>→</span>;
}
