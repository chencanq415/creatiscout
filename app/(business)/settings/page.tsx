"use client";

import { Bell, Check, CreditCard, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/lib/account/auth-store";
import { useLoc } from "@/lib/i18n/use-i18n";

const L = {
  title: { zh: "账户设置", en: "Account Settings" }, subtitle: { zh: "管理个人资料、工作区和通知偏好。", en: "Manage your profile, workspace, and notification preferences." },
  profile: { zh: "个人资料", en: "Profile" }, workspace: { zh: "工作区与套餐", en: "Workspace & plan" }, notifications: { zh: "通知偏好", en: "Notification preferences" },
  name: { zh: "姓名", en: "Name" }, email: { zh: "邮箱", en: "Email" }, workspaceName: { zh: "工作区名称", en: "Workspace name" }, save: { zh: "保存修改", en: "Save changes" }, saved: { zh: "已保存", en: "Saved" },
  plan: { zh: "当前套餐", en: "Current plan" }, trial: { zh: "Plus 试用中", en: "Plus trial" }, upgrade: { zh: "管理套餐", en: "Manage plan" },
  emailNotices: { zh: "邮件通知", en: "Email notifications" }, emailNoticesHint: { zh: "当达人回复、需要审核或付款时发送邮件提醒。", en: "Receive an email when a creator replies or an approval and payment need attention." },
  aiNotices: { zh: "AI 推进提醒", en: "AI workflow updates" }, aiNoticesHint: { zh: "当 AI 完成匹配、建联或生成新的建议时通知我。", en: "Notify me when AI completes matching, outreach, or generates a recommendation." },
  security: { zh: "账户安全", en: "Account security" }, securityHint: { zh: "使用邮箱登录。需要修改密码时，可在登录页使用“忘记密码”。", en: "You sign in with email. Use “Forgot password” on the sign-in page to reset it." },
} as const;

export default function SettingsPage() {
  const l = useLoc(); const currentUser = useAuthStore((state) => state.currentUser); const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [workspaceName, setWorkspaceName] = useState(""); const [saved, setSaved] = useState(false); const [emailNotices, setEmailNotices] = useState(true); const [aiNotices, setAiNotices] = useState(true);
  useEffect(() => { setName(currentUser?.name ?? "Alex Morgan"); setEmail(currentUser?.email ?? "demo@creatiscout.ai"); setWorkspaceName(currentUser?.workspaceName ?? "Demo Workspace"); }, [currentUser]);
  const save = () => { updateCurrentUser({ name: name.trim() || "Alex Morgan", email: email.trim() || "demo@creatiscout.ai", workspaceName: workspaceName.trim() || "Demo Workspace" }); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };
  return <main className="min-h-full bg-surface px-6 py-6 lg:px-8"><div className="mx-auto max-w-[980px]"><header><h1 className="text-[30px] font-bold tracking-[-0.035em] text-navy">{l(L.title)}</h1><p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p></header><div className="mt-6 space-y-5">
    <SettingsCard icon={<UserRound className="h-4 w-4" />} title={l(L.profile)}><div className="grid gap-4 sm:grid-cols-2"><Field label={l(L.name)} value={name} onChange={setName} /><Field label={l(L.email)} value={email} onChange={setEmail} /></div><div className="mt-4"><Field label={l(L.workspaceName)} value={workspaceName} onChange={setWorkspaceName} /></div><div className="mt-5 flex justify-end"><button type="button" onClick={save} className="inline-flex h-9 items-center gap-1.5 rounded-control bg-brand px-3.5 text-[11px] font-semibold text-white shadow-cta hover:bg-brand-hover">{saved ? <Check className="h-3.5 w-3.5" /> : null}{saved ? l(L.saved) : l(L.save)}</button></div></SettingsCard>
    <div className="grid gap-5 lg:grid-cols-2"><SettingsCard icon={<CreditCard className="h-4 w-4" />} title={l(L.workspace)}><div className="rounded-[10px] bg-surface-warm p-3.5"><p className="text-[10px] text-muted">{l(L.plan)}</p><p className="mt-1 text-[13px] font-semibold text-ink">{currentUser?.employeePlan === "plus" ? l(L.trial) : "Free"}</p><button type="button" className="mt-3 text-[10.5px] font-semibold text-brand hover:text-brand-hover">{l(L.upgrade)} →</button></div></SettingsCard><SettingsCard icon={<ShieldCheck className="h-4 w-4" />} title={l(L.security)}><p className="text-[11px] leading-relaxed text-slate">{l(L.securityHint)}</p></SettingsCard></div>
    <SettingsCard icon={<Bell className="h-4 w-4" />} title={l(L.notifications)}><ToggleRow title={l(L.emailNotices)} hint={l(L.emailNoticesHint)} checked={emailNotices} onCheckedChange={setEmailNotices} /><ToggleRow title={l(L.aiNotices)} hint={l(L.aiNoticesHint)} checked={aiNotices} onCheckedChange={setAiNotices} /></SettingsCard>
  </div></div></main>;
}
function SettingsCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) { return <section className="rounded-[14px] border border-border bg-surface p-5"><div className="mb-5 flex items-center gap-2"><span className="text-slate">{icon}</span><h2 className="text-[14px] font-semibold text-ink">{title}</h2></div>{children}</section>; }
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-[10.5px] font-medium text-slate">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-9 w-full rounded-control border border-border bg-surface px-3 text-[11px] text-ink outline-none transition-colors focus:border-brand" /></label>; }
function ToggleRow({ title, hint, checked, onCheckedChange }: { title: string; hint: string; checked: boolean; onCheckedChange: (value: boolean) => void }) { return <div className="flex items-center justify-between gap-6 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0"><div><p className="text-[11.5px] font-semibold text-ink">{title}</p><p className="mt-1 max-w-[620px] text-[10.5px] leading-relaxed text-slate">{hint}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>; }
