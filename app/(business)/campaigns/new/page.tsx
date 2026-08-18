"use client";

import { ArrowLeft, FileText, ImageIcon, Link2, PackagePlus, Paperclip, Save, Trash2, Users, WalletCards } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign, CampaignCurrency, CampaignGoal, CampaignProduct, CampaignStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const L = {
  back: { zh: "返回 Campaigns", en: "Back to Campaigns" },
  title: { zh: "新建 Campaign", en: "Create campaign" },
  subtitle: { zh: "先定义完整 Campaign，达人搜索和建联会基于这里的条件运行。", en: "Define the campaign first. Creator discovery and outreach will run from these requirements." },
  basic: { zh: "基础信息", en: "Basic information" },
  basicSub: { zh: "Campaign 的品牌、目标和基础范围", en: "Brand, goal, and core campaign scope" },
  brand: { zh: "品牌", en: "Brand" },
  campaignName: { zh: "Campaign 名称", en: "Campaign name" },
  description: { zh: "描述（可选）", en: "Description (optional)" },
  goal: { zh: "目标", en: "Goal" },
  category: { zh: "品类", en: "Category" },
  duration: { zh: "Campaign 周期", en: "Campaign duration" },
  startDate: { zh: "开始日期", en: "Start date" },
  endDate: { zh: "结束日期", en: "End date" },
  image: { zh: "Campaign 图片（可选）", en: "Campaign image (optional)" },
  imageHint: { zh: "先使用图片 URL，后续可接入文件上传。", en: "Use an image URL for now; file upload can be connected later." },
  compensation: { zh: "合作报酬", en: "Compensation" },
  compensationSub: { zh: "可同时启用多种达人合作激励", en: "Enable one or multiple creator compensation types" },
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
  productImage: { zh: "图片链接", en: "Image URL" },
  productLink: { zh: "产品链接", en: "Product link" },
  giftCardName: { zh: "礼品卡名称", en: "Gift card name" },
  creatorRequirements: { zh: "达人要求", en: "Creator requirements" },
  creatorRequirementsSub: { zh: "用于后续 Search 的达人筛选条件", en: "Creator filters used by the Search workflow" },
  regions: { zh: "达人地区", en: "Creator region" },
  languages: { zh: "语言", en: "Language" },
  creatorCategories: { zh: "达人品类", en: "Creator category" },
  minimumFollowers: { zh: "最低粉丝数", en: "Minimum followers" },
  contentTypes: { zh: "内容类型 / 交付物", en: "Content type / deliverable" },
  commaHint: { zh: "多个选项用逗号分隔", en: "Separate multiple values with commas" },
  terms: { zh: "条款与附件", en: "Terms & attachments" },
  termsSub: { zh: "合作条款和 Campaign 相关文件", en: "Collaboration terms and campaign files" },
  termsConditions: { zh: "合作条款", en: "Terms & conditions" },
  attachments: { zh: "附件", en: "Attachment" },
  saveDraft: { zh: "保存草稿", en: "Save draft" },
  create: { zh: "创建并开始 Campaign", en: "Create and start campaign" },
  required: { zh: "请填写品牌、Campaign 名称和日期。", en: "Brand, campaign name, and dates are required." },
} as const;

const goals: CampaignGoal[] = ["brand_awareness", "content_production", "conversion_sales", "engagement"];
const goalLabels: Record<CampaignGoal, { zh: string; en: string }> = {
  brand_awareness: { zh: "品牌认知", en: "Brand awareness" },
  content_production: { zh: "内容生产", en: "Content production" },
  conversion_sales: { zh: "转化 / 销售", en: "Conversion / sales" },
  engagement: { zh: "互动增长", en: "Engagement" },
};
const currencies: CampaignCurrency[] = ["USD", "CNY", "EUR", "GBP"];
const splitList = (value: string) => value.split(/[,，]/).map((item) => item.trim()).filter(Boolean);
const today = () => new Date().toISOString().slice(0, 10);
const inThirtyDays = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const makeProduct = (): CampaignProduct => ({ id: `product-${Math.random().toString(36).slice(2, 9)}`, name: "", currency: "USD", value: 0 });

export default function NewCampaignPage() {
  const l = useLoc();
  const router = useRouter();
  const addCampaign = useUIStore((state) => state.addCampaign);
  const [error, setError] = useState("");
  const [basic, setBasic] = useState({ brand: "", name: "", description: "", goal: "brand_awareness" as CampaignGoal, category: "", startAt: today(), endAt: inThirtyDays(), image: "" });
  const [enabled, setEnabled] = useState({ flatFee: true, commission: false, products: false, giftCard: false });
  const [flatFee, setFlatFee] = useState({ currency: "USD" as CampaignCurrency, minFee: 0, maxFee: 0, totalBudget: 0 });
  const [commission, setCommission] = useState({ rate: 0, affiliateLink: "" });
  const [products, setProducts] = useState<CampaignProduct[]>([makeProduct()]);
  const [giftCard, setGiftCard] = useState({ name: "", currency: "USD" as CampaignCurrency, value: 0, description: "" });
  const [requirements, setRequirements] = useState({ regions: "", languages: "", categories: "", minimumFollowers: 0, contentTypes: "" });
  const [terms, setTerms] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  function submit(status: CampaignStatus) {
    if (!basic.brand.trim() || !basic.name.trim() || !basic.startAt || !basic.endAt) {
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
      endAt: basic.endAt,
      ownerId: "lucy",
      proposed: 0,
      collaborating: 0,
      delivered: 0,
      budget: enabled.flatFee ? flatFee.totalBudget : 0,
      spent: 0,
      platforms: splitList(requirements.contentTypes),
      briefSummary: { zh: basic.description || basic.name, en: basic.description || basic.name },
      compensation: {
        flatFee: enabled.flatFee ? flatFee : undefined,
        commission: enabled.commission ? commission : undefined,
        freeProducts: enabled.products ? products.filter((product) => product.name.trim()) : [],
        giftCard: enabled.giftCard ? giftCard : undefined,
      },
      creatorRequirements: {
        regions: splitList(requirements.regions),
        languages: splitList(requirements.languages),
        categories: splitList(requirements.categories),
        minimumFollowers: requirements.minimumFollowers,
        contentTypes: splitList(requirements.contentTypes),
      },
      termsAndConditions: terms || undefined,
      attachments: attachments.map((file) => ({ id: `attachment-${Math.random().toString(36).slice(2, 9)}`, name: file.name, size: file.size })),
      client: { zh: basic.brand, en: basic.brand },
      toggles: { poolFirst: true, sampling: enabled.products, adCode: true },
      automation: "full",
      step: "brief",
      updatedAt: new Date().toISOString(),
    };
    addCampaign(campaign);
    router.push(`/campaigns/${campaign.id}`);
  }

  return (
    <div className="min-h-full bg-page px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-[1080px]">
        <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate hover:text-ink"><ArrowLeft className="h-4 w-4" />{l(L.back)}</Link>
        <div className="mt-4 flex items-start justify-between gap-6">
          <div><h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1><p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p></div>
          <div className="flex gap-2"><Button variant="outline" onClick={() => submit("draft")}><Save className="h-4 w-4" />{l(L.saveDraft)}</Button><Button onClick={() => submit("active")}>{l(L.create)}<ArrowRightIcon /></Button></div>
        </div>
        {error && <div className="mt-4 rounded-[10px] border border-brand/25 bg-soft-pink px-4 py-3 text-[12px] font-medium text-brand-strong">{error}</div>}

        <div className="mt-6 space-y-5">
          <FormSection icon={<FileText className="h-4 w-4" />} title={l(L.basic)} subtitle={l(L.basicSub)}>
            <div className="grid gap-4 md:grid-cols-2"><Field label={l(L.brand)} required><Input value={basic.brand} onChange={(value) => setBasic({ ...basic, brand: value })} /></Field><Field label={l(L.campaignName)} required><Input value={basic.name} onChange={(value) => setBasic({ ...basic, name: value })} /></Field></div>
            <Field label={l(L.description)}><Textarea value={basic.description} onChange={(value) => setBasic({ ...basic, description: value })} /></Field>
            <div className="grid gap-4 md:grid-cols-2"><Field label={l(L.goal)}><Select value={basic.goal} onChange={(value) => setBasic({ ...basic, goal: value as CampaignGoal })}>{goals.map((goal) => <option key={goal} value={goal}>{l(goalLabels[goal])}</option>)}</Select></Field><Field label={l(L.category)}><Input value={basic.category} onChange={(value) => setBasic({ ...basic, category: value })} placeholder="Beauty, Fashion, Gaming…" /></Field></div>
            <Field label={l(L.duration)} required><div className="grid gap-3 md:grid-cols-2"><Input type="date" value={basic.startAt} onChange={(value) => setBasic({ ...basic, startAt: value })} /><Input type="date" value={basic.endAt} onChange={(value) => setBasic({ ...basic, endAt: value })} /></div></Field>
            <Field label={l(L.image)} hint={l(L.imageHint)}><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-surface-warm text-muted">{basic.image ? <img src={basic.image} alt="" className="h-11 w-11 rounded-[9px] object-cover" /> : <ImageIcon className="h-4 w-4" />}</div><div className="flex-1"><Input value={basic.image} onChange={(value) => setBasic({ ...basic, image: value })} placeholder="https://…" /></div></div></Field>
          </FormSection>

          <FormSection icon={<WalletCards className="h-4 w-4" />} title={l(L.compensation)} subtitle={l(L.compensationSub)}>
            <CompensationBlock checked={enabled.flatFee} onToggle={() => setEnabled({ ...enabled, flatFee: !enabled.flatFee })} title={l(L.flatFee)}>{enabled.flatFee && <div className="grid gap-3 md:grid-cols-4"><Field label={l(L.currency)}><CurrencySelect value={flatFee.currency} onChange={(currency) => setFlatFee({ ...flatFee, currency })} /></Field><Field label={l(L.minFee)}><NumberInput value={flatFee.minFee} onChange={(minFee) => setFlatFee({ ...flatFee, minFee })} /></Field><Field label={l(L.maxFee)}><NumberInput value={flatFee.maxFee} onChange={(maxFee) => setFlatFee({ ...flatFee, maxFee })} /></Field><Field label={l(L.totalBudget)}><NumberInput value={flatFee.totalBudget} onChange={(totalBudget) => setFlatFee({ ...flatFee, totalBudget })} /></Field></div>}</CompensationBlock>
            <CompensationBlock checked={enabled.commission} onToggle={() => setEnabled({ ...enabled, commission: !enabled.commission })} title={l(L.commission)}>{enabled.commission && <div className="grid gap-3 md:grid-cols-2"><Field label={l(L.commissionRate)}><NumberInput value={commission.rate} onChange={(rate) => setCommission({ ...commission, rate })} /></Field><Field label={l(L.affiliateLink)}><Input value={commission.affiliateLink} onChange={(affiliateLink) => setCommission({ ...commission, affiliateLink })} icon={<Link2 className="h-3.5 w-3.5" />} /></Field></div>}</CompensationBlock>
            <CompensationBlock checked={enabled.products} onToggle={() => setEnabled({ ...enabled, products: !enabled.products })} title={l(L.freeProduct)}>{enabled.products && <div className="space-y-3">{products.map((product, index) => <ProductEditor key={product.id} product={product} index={index} onChange={(next) => setProducts(products.map((item) => item.id === product.id ? next : item))} onRemove={() => setProducts(products.filter((item) => item.id !== product.id))} />)}<Button variant="outline" size="sm" onClick={() => setProducts([...products, makeProduct()])}><PackagePlus className="h-4 w-4" />{l(L.addProduct)}</Button></div>}</CompensationBlock>
            <CompensationBlock checked={enabled.giftCard} onToggle={() => setEnabled({ ...enabled, giftCard: !enabled.giftCard })} title={l(L.giftCard)}>{enabled.giftCard && <div className="grid gap-3 md:grid-cols-3"><Field label={l(L.giftCardName)}><Input value={giftCard.name} onChange={(name) => setGiftCard({ ...giftCard, name })} /></Field><Field label={l(L.currency)}><CurrencySelect value={giftCard.currency} onChange={(currency) => setGiftCard({ ...giftCard, currency })} /></Field><Field label={l(L.value)}><NumberInput value={giftCard.value} onChange={(value) => setGiftCard({ ...giftCard, value })} /></Field><div className="md:col-span-3"><Field label={l(L.description)}><Input value={giftCard.description} onChange={(description) => setGiftCard({ ...giftCard, description })} /></Field></div></div>}</CompensationBlock>
          </FormSection>

          <FormSection icon={<Users className="h-4 w-4" />} title={l(L.creatorRequirements)} subtitle={l(L.creatorRequirementsSub)}>
            <div className="grid gap-4 md:grid-cols-2"><Field label={l(L.regions)} hint={l(L.commaHint)}><Input value={requirements.regions} onChange={(regions) => setRequirements({ ...requirements, regions })} placeholder="United States, Canada" /></Field><Field label={l(L.languages)} hint={l(L.commaHint)}><Input value={requirements.languages} onChange={(languages) => setRequirements({ ...requirements, languages })} placeholder="English, Spanish" /></Field><Field label={l(L.creatorCategories)} hint={l(L.commaHint)}><Input value={requirements.categories} onChange={(categories) => setRequirements({ ...requirements, categories })} placeholder="Beauty, Skincare" /></Field><Field label={l(L.minimumFollowers)}><NumberInput value={requirements.minimumFollowers} onChange={(minimumFollowers) => setRequirements({ ...requirements, minimumFollowers })} /></Field></div>
            <Field label={l(L.contentTypes)} hint={l(L.commaHint)}><Input value={requirements.contentTypes} onChange={(contentTypes) => setRequirements({ ...requirements, contentTypes })} placeholder="TikTok Video, Instagram Reel, RedNote Post" /></Field>
          </FormSection>

          <FormSection icon={<Paperclip className="h-4 w-4" />} title={l(L.terms)} subtitle={l(L.termsSub)}>
            <Field label={l(L.termsConditions)}><Textarea value={terms} onChange={setTerms} rows={5} /></Field>
            <Field label={l(L.attachments)}><label className="flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-dashed border-border-strong bg-surface-warm px-4 py-6 text-[12px] font-medium text-slate hover:border-brand/40 hover:text-brand"><Paperclip className="h-4 w-4" />{attachments.length ? attachments.map((file) => file.name).join(", ") : l(L.attachments)}<input type="file" multiple className="hidden" onChange={(event) => setAttachments(Array.from(event.target.files ?? []))} /></label></Field>
          </FormSection>
        </div>

        <div className="mt-6 flex justify-end gap-2 pb-10"><Button variant="outline" onClick={() => submit("draft")}><Save className="h-4 w-4" />{l(L.saveDraft)}</Button><Button onClick={() => submit("active")}>{l(L.create)}<ArrowRightIcon /></Button></div>
      </div>
    </div>
  );
}

function FormSection({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) { return <section className="rounded-[16px] border border-border bg-surface shadow-card"><div className="flex items-center gap-3 border-b border-border px-5 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-soft-pink text-brand">{icon}</div><div><h2 className="text-[15px] font-bold text-navy">{title}</h2><p className="mt-0.5 text-[10.5px] text-muted">{subtitle}</p></div></div><div className="space-y-4 p-5">{children}</div></section>; }
function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) { return <label className="block"><div className="mb-1.5 text-[11px] font-semibold text-ink">{label}{required && <span className="ml-1 text-brand">*</span>}</div>{children}{hint && <div className="mt-1 text-[9.5px] text-muted">{hint}</div>}</label>; }
function Input({ value, onChange, type = "text", placeholder, icon }: { value: string; onChange: (value: string) => void; type?: string; placeholder?: string; icon?: React.ReactNode }) { return <div className="relative">{icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={cn("h-10 w-full rounded-[8px] border border-border bg-white px-3 text-[12.5px] text-ink outline-none transition-colors focus:border-brand/50", icon && "pl-9")} /></div>; }
function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) { return <input type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-10 w-full rounded-[8px] border border-border bg-white px-3 text-[12.5px] text-ink outline-none focus:border-brand/50" />; }
function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (value: string) => void; rows?: number }) { return <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-[8px] border border-border bg-white px-3 py-2.5 text-[12.5px] leading-5 text-ink outline-none focus:border-brand/50" />; }
function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-[8px] border border-border bg-white px-3 text-[12.5px] text-ink outline-none focus:border-brand/50">{children}</select>; }
function CurrencySelect({ value, onChange }: { value: CampaignCurrency; onChange: (value: CampaignCurrency) => void }) { return <Select value={value} onChange={(next) => onChange(next as CampaignCurrency)}>{currencies.map((currency) => <option key={currency}>{currency}</option>)}</Select>; }
function CompensationBlock({ checked, onToggle, title, children }: { checked: boolean; onToggle: () => void; title: string; children: React.ReactNode }) { return <div className={cn("rounded-[11px] border p-4", checked ? "border-brand/25 bg-soft-pink/25" : "border-border")}><button type="button" onClick={onToggle} className="flex w-full items-center gap-2.5 text-left"><span className={cn("flex h-4 w-4 items-center justify-center rounded border", checked ? "border-brand bg-brand text-white" : "border-border-strong bg-white")}>{checked && <span className="text-[10px]">✓</span>}</span><span className="text-[12.5px] font-semibold text-ink">{title}</span></button>{checked && <div className="mt-4 border-t border-border/70 pt-4">{children}</div>}</div>; }
function ProductEditor({ product, index, onChange, onRemove }: { product: CampaignProduct; index: number; onChange: (product: CampaignProduct) => void; onRemove: () => void }) { const l = useLoc(); return <div className="rounded-[10px] border border-border bg-white p-4"><div className="mb-3 flex items-center justify-between"><span className="text-[11px] font-semibold text-muted">Product {index + 1}</span><button type="button" onClick={onRemove} className="text-muted hover:text-brand"><Trash2 className="h-4 w-4" /></button></div><div className="grid gap-3 md:grid-cols-3"><Field label={l(L.productName)}><Input value={product.name} onChange={(name) => onChange({ ...product, name })} /></Field><Field label={l(L.currency)}><CurrencySelect value={product.currency} onChange={(currency) => onChange({ ...product, currency })} /></Field><Field label={l(L.value)}><NumberInput value={product.value} onChange={(value) => onChange({ ...product, value })} /></Field><Field label={l(L.productImage)}><Input value={product.image ?? ""} onChange={(image) => onChange({ ...product, image })} /></Field><Field label={l(L.productLink)}><Input value={product.productLink ?? ""} onChange={(productLink) => onChange({ ...product, productLink })} /></Field><Field label={l(L.description)}><Input value={product.description ?? ""} onChange={(description) => onChange({ ...product, description })} /></Field></div></div>; }
function ArrowRightIcon() { return <span aria-hidden>→</span>; }
