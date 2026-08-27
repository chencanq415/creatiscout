"use client";

import { type AccountRole, useAuthHydrated, useAuthStore } from "@/lib/account/auth-store";
import { EMPLOYEE_PLAN_KEY, PLUS_TRIAL_KEY } from "@/lib/account/trial";
import { useI18nStore, useLoc } from "@/lib/i18n/use-i18n";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Globe2, LoaderCircle, LockKeyhole, Mail, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

type Mode = "login" | "signup" | "forgot";
type SignupStep = "email" | "code" | "success";

const L = {
  brandLine: { zh: "让每一次达人合作，都更简单、更聪明。", en: "Make every creator collaboration simpler and smarter." },
  brandSub: { zh: "从精准匹配到合作交付，在一个工作台持续推进。", en: "Move from precise matching to campaign delivery in one workspace." },
  demo: { zh: "体验 Demo", en: "Demo" },
  signIn: { zh: "登录", en: "Sign in" },
  signInTitle: { zh: "欢迎回来", en: "Welcome back" },
  signInSub: { zh: "登录你的 CreatiScout 账号继续工作。", en: "Sign in to your CreatiScout account to continue." },
  brand: { zh: "品牌方", en: "For Brand" },
  creator: { zh: "创作者", en: "For Creator" },
  email: { zh: "邮箱", en: "Email" },
  emailPlaceholder: { zh: "请输入邮箱", en: "you@company.com" },
  password: { zh: "密码", en: "Password" },
  passwordPlaceholder: { zh: "请输入密码", en: "Enter your password" },
  forgot: { zh: "忘记密码？", en: "Forgot password?" },
  noAccount: { zh: "还没有账号？", en: "Don't have an account?" },
  haveAccount: { zh: "已经有账号？", en: "Already have an account?" },
  signup: { zh: "注册", en: "Sign up" },
  or: { zh: "或者", en: "or" },
  googleSignIn: { zh: "使用 Google 登录", en: "Continue with Google" },
  googleSignUp: { zh: "使用 Google 注册", en: "Sign up with Google" },
  createTitle: { zh: "创建你的账号", en: "Create your account" },
  createSub: { zh: "使用邮箱验证码，几秒钟即可开始。", en: "Get started in seconds with an email verification code." },
  sendCode: { zh: "发送验证码", en: "Send verification code" },
  codeTitle: { zh: "查看你的邮箱", en: "Check your inbox" },
  codeSub: { zh: "我们已将 6 位验证码发送至", en: "We sent a 6-digit verification code to" },
  code: { zh: "验证码", en: "Verification code" },
  codePlaceholder: { zh: "输入 6 位验证码", en: "Enter 6-digit code" },
  verify: { zh: "验证并创建账号", en: "Verify and create account" },
  resend: { zh: "重新发送", en: "Resend code" },
  mockCode: { zh: "Demo 验证码：246810", en: "Demo verification code: 246810" },
  successTitle: { zh: "注册成功", en: "You're all set" },
  successSub: { zh: "账号已创建，正在进入 CreatiScout…", en: "Your account is ready. Taking you to CreatiScout…" },
  invalidLogin: { zh: "邮箱或密码不正确，请重试。", en: "Incorrect email or password." },
  invalidEmail: { zh: "请输入有效的邮箱地址。", en: "Enter a valid email address." },
  invalidCode: { zh: "验证码不正确，请输入 246810。", en: "Incorrect code. Enter 246810." },
  exists: { zh: "该邮箱已注册，请直接登录。", en: "This email is already registered. Sign in instead." },
  required: { zh: "请填写邮箱和密码。", en: "Enter your email and password." },
  resetTitle: { zh: "重置密码", en: "Reset your password" },
  resetSub: { zh: "输入注册邮箱，我们会向你发送验证码。", en: "Enter your account email and we'll send you a verification code." },
  resetCodeTitle: { zh: "验证你的身份", en: "Verify your identity" },
  resetCodeSub: { zh: "输入发送至以下邮箱的 6 位验证码", en: "Enter the 6-digit code sent to" },
  continue: { zh: "继续", en: "Continue" },
  newPasswordTitle: { zh: "设置新密码", en: "Set a new password" },
  newPasswordSub: { zh: "新密码至少需要 6 位字符。", en: "Your new password must contain at least 6 characters." },
  newPassword: { zh: "新密码", en: "New password" },
  confirmPassword: { zh: "确认新密码", en: "Confirm new password" },
  confirmPasswordPlaceholder: { zh: "再次输入新密码", en: "Enter your new password again" },
  resetAction: { zh: "重置密码", en: "Reset password" },
  resetSuccessTitle: { zh: "密码已重置", en: "Password reset" },
  resetSuccessSub: { zh: "现在可以使用新密码登录了。", en: "You can now sign in with your new password." },
  backToLogin: { zh: "返回登录", en: "Back to sign in" },
  accountNotFound: { zh: "没有找到该邮箱对应的账号。", en: "We couldn't find an account with this email." },
  passwordShort: { zh: "密码至少需要 6 位字符。", en: "Password must contain at least 6 characters." },
  passwordMismatch: { zh: "两次输入的密码不一致。", en: "The passwords do not match." },
} as const;

const DEMO_CODE = "246810";

export default function LoginPage() {
  const l = useLoc();
  const router = useRouter();
  const locale = useI18nStore((state) => state.locale);
  const setLocale = useI18nStore((state) => state.setLocale);
  const hydrated = useAuthHydrated();
  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const loginDemo = useAuthStore((state) => state.loginDemo);
  const register = useAuthStore((state) => state.register);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const setEmployeePlan = useAuthStore((state) => state.setEmployeePlan);
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<AccountRole>("brand");
  const [signupStep, setSignupStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && currentUser && mode === "login") {
      router.replace(currentUser.employeePlan ? "/campaigns" : "/campaigns?onboarding=1");
    }
  }, [currentUser, hydrated, mode, router]);

  const resetMessages = () => { setError(null); setNotice(null); };
  const openSignup = () => { setMode("signup"); setSignupStep("email"); setCode(""); resetMessages(); };
  const openLogin = () => { setMode("login"); setSignupStep("email"); setCode(""); resetMessages(); };
  const openForgot = () => { setMode("forgot"); resetMessages(); };
  const enterProduct = (needsPlan = true) => {
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(needsPlan ? "/campaigns?onboarding=1" : next || "/campaigns");
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); resetMessages();
    if (!email.trim() || !password) { setError(l(L.required)); return; }
    setSubmitting(true);
    window.setTimeout(() => {
      const result = login(email, password);
      if (!result.ok) { setError(l(L.invalidLogin)); setSubmitting(false); return; }
      const user = useAuthStore.getState().currentUser;
      enterProduct(!user?.employeePlan);
    }, 300);
  };

  const sendCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); resetMessages();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError(l(L.invalidEmail)); return; }
    setSubmitting(true);
    window.setTimeout(() => { setSubmitting(false); setSignupStep("code"); setNotice(l(L.mockCode)); }, 350);
  };

  const verifyCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null);
    if (code.trim() !== DEMO_CODE) { setError(l(L.invalidCode)); return; }
    setSubmitting(true);
    const emailName = email.split("@")[0].replace(/[._-]+/g, " ").trim() || "New user";
    const result = register({
      name: emailName,
      workspaceName: role === "brand" ? `${emailName} Workspace` : `${emailName} Creator Space`,
      email,
      password: `verified-${DEMO_CODE}`,
      role,
    });
    if (!result.ok) { setError(l(L.exists)); setSubmitting(false); return; }
    window.localStorage.removeItem(EMPLOYEE_PLAN_KEY);
    window.localStorage.removeItem(PLUS_TRIAL_KEY);
    setSignupStep("success");
    window.setTimeout(() => enterProduct(true), 900);
  };

  const handleGoogle = () => { resetMessages(); loginWithGoogle(role); enterProduct(true); };
  const useDemo = () => {
    resetMessages();
    loginDemo();
    window.localStorage.setItem(EMPLOYEE_PLAN_KEY, "plus");
    setEmployeePlan("plus");
    enterProduct(false);
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] lg:grid lg:grid-cols-[minmax(430px,1fr)_minmax(520px,1fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#f4eee8] lg:block">
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/auth/login-product-hero-v4.png`} alt="Creator campaign workspace" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafbfc]/95" />
        <div className="absolute left-10 top-9 flex items-center gap-2.5 rounded-full bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/logo.png`} alt="CreatiScout" className="h-8 w-8 object-contain" />
          <span className="text-[17px] font-bold tracking-[-0.025em] text-navy">CreatiScout</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-10 text-navy xl:p-14">
          <h1 className="max-w-[500px] text-[34px] font-bold leading-[1.12] tracking-[-0.045em] xl:text-[40px]">{l(L.brandLine)}</h1>
          <p className="mt-4 max-w-[460px] text-[13px] leading-6 text-slate">{l(L.brandSub)}</p>
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center bg-white px-5 py-24 sm:px-10 lg:px-14">
        <div className="absolute left-5 top-5 flex items-center gap-2 lg:hidden">
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/logo.png`} alt="CreatiScout" className="h-8 w-8 object-contain" />
          <span className="text-[17px] font-bold text-navy">CreatiScout</span>
        </div>
        <div className="absolute right-5 top-5 flex items-center gap-2 sm:right-8 sm:top-7">
          <button type="button" onClick={() => setLocale(locale === "zh" ? "en" : "zh")} className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-3.5 text-[11px] font-semibold text-slate transition hover:border-border-strong hover:text-ink">
            <Globe2 className="h-3.5 w-3.5" />{locale === "zh" ? "English" : "中文"}
          </button>
          <button type="button" onClick={useDemo} className="inline-flex h-9 items-center gap-2 rounded-full bg-navy px-4 text-[11px] font-semibold text-white transition hover:bg-[#352b55]">
            <PlayCircle className="h-3.5 w-3.5" />{l(L.demo)}
          </button>
        </div>

        <div className="w-full max-w-[420px]">
          {mode === "forgot" ? (
            <ForgotPasswordPanel
              initialEmail={email}
              onBack={openLogin}
              onComplete={(resetEmail) => { setEmail(resetEmail); openLogin(); }}
            />
          ) : (
            <>
          {mode === "signup" && signupStep === "code" && (
            <button type="button" onClick={() => { setSignupStep("email"); resetMessages(); }} className="mb-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" /> {email}
            </button>
          )}
          {signupStep !== "success" && (
            <>
              <h2 className="text-[30px] font-bold tracking-[-0.04em] text-navy sm:text-[34px]">{l(mode === "login" ? L.signInTitle : signupStep === "code" ? L.codeTitle : L.createTitle)}</h2>
              <p className="mt-2 text-[12.5px] leading-5 text-slate">
                {mode === "login" ? l(L.signInSub) : signupStep === "code" ? <>{l(L.codeSub)} <span className="font-semibold text-ink">{email}</span></> : l(L.createSub)}
              </p>
              <div className="mt-7 grid grid-cols-2 rounded-[12px] bg-surface-warm p-1">
                {(["brand", "creator"] as AccountRole[]).map((item) => (
                  <button key={item} type="button" onClick={() => { setRole(item); resetMessages(); }} className={`h-10 rounded-[9px] text-[12px] font-semibold transition ${role === item ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink"}`}>
                    {l(item === "brand" ? L.brand : L.creator)}
                  </button>
                ))}
              </div>
            </>
          )}

          {signupStep === "success" ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f7f3] text-teal-text"><Check className="h-7 w-7" /></div>
              <h2 className="mt-6 text-[32px] font-bold tracking-[-0.04em] text-navy">{l(L.successTitle)}</h2>
              <p className="mt-2 text-[12.5px] text-slate">{l(L.successSub)}</p>
              <LoaderCircle className="mx-auto mt-6 h-4 w-4 animate-spin text-brand" />
            </div>
          ) : mode === "login" ? (
            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <Field label={l(L.email)} icon={<Mail className="h-4 w-4" />}>
                <input aria-label={l(L.email)} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={l(L.emailPlaceholder)} autoComplete="email" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-muted" />
              </Field>
              <div>
                <div className="mb-1.5 flex items-center justify-between"><span className="text-[11px] font-semibold text-ink">{l(L.password)}</span><button type="button" onClick={openForgot} className="text-[10.5px] font-semibold text-brand hover:underline">{l(L.forgot)}</button></div>
                <div className="flex h-11 items-center gap-2.5 rounded-[10px] border border-border bg-white px-3 transition focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/10">
                  <LockKeyhole className="h-4 w-4 flex-shrink-0 text-muted" />
                  <input aria-label={l(L.password)} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={l(L.passwordPlaceholder)} autoComplete="current-password" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-muted" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-muted hover:text-ink">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <Feedback error={error} notice={notice} />
              <PrimaryButton loading={submitting}>{l(L.signIn)} <ArrowRight className="h-4 w-4" /></PrimaryButton>
            </form>
          ) : signupStep === "email" ? (
            <form onSubmit={sendCode} className="mt-7 space-y-4">
              <Field label={l(L.email)} icon={<Mail className="h-4 w-4" />}>
                <input aria-label={l(L.email)} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={l(L.emailPlaceholder)} autoComplete="email" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-muted" />
              </Field>
              <Feedback error={error} notice={notice} />
              <PrimaryButton loading={submitting}>{l(L.sendCode)} <ArrowRight className="h-4 w-4" /></PrimaryButton>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="mt-7 space-y-4">
              <Field label={l(L.code)} icon={<LockKeyhole className="h-4 w-4" />}>
                <input aria-label={l(L.code)} inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={l(L.codePlaceholder)} className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-semibold tracking-[0.18em] text-ink placeholder:text-[12px] placeholder:font-normal placeholder:tracking-normal placeholder:text-muted" />
              </Field>
              <Feedback error={error} notice={notice} />
              <PrimaryButton loading={submitting}>{l(L.verify)} <ArrowRight className="h-4 w-4" /></PrimaryButton>
              <button type="button" onClick={() => { setCode(""); setNotice(l(L.mockCode)); }} className="w-full text-center text-[10.5px] font-semibold text-brand hover:underline">{l(L.resend)}</button>
            </form>
          )}

          {signupStep !== "success" && (
            <>
              <div className="my-6 flex items-center gap-3 text-[9.5px] font-medium uppercase tracking-[0.12em] text-muted"><span className="h-px flex-1 bg-border" /> {l(L.or)} <span className="h-px flex-1 bg-border" /></div>
              <button type="button" onClick={handleGoogle} className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-border bg-white text-[11.5px] font-semibold text-ink transition hover:border-border-strong hover:bg-surface-warm/50"><GoogleMark />{l(mode === "login" ? L.googleSignIn : L.googleSignUp)}</button>
              <p className="mt-6 text-center text-[11px] text-slate">{l(mode === "login" ? L.noAccount : L.haveAccount)}{" "}<button type="button" onClick={mode === "login" ? openSignup : openLogin} className="font-semibold text-brand hover:underline">{l(mode === "login" ? L.signup : L.signIn)}</button></p>
            </>
          )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

type ResetStep = "email" | "code" | "password" | "success";

function ForgotPasswordPanel({
  initialEmail,
  onBack,
  onComplete,
}: {
  initialEmail: string;
  onBack: () => void;
  onComplete: (email: string) => void;
}) {
  const l = useLoc();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [step, setStep] = useState<ResetStep>("email");
  const [resetEmail, setResetEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const sendResetCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(resetEmail.trim())) {
      setError(l(L.invalidEmail));
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setStep("code");
      setNotice(l(L.mockCode));
    }, 350);
  };

  const confirmResetCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (resetCode !== DEMO_CODE) {
      setError(l(L.invalidCode));
      return;
    }
    setNotice(null);
    setStep("password");
  };

  const saveNewPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (newPassword.length < 6) {
      setError(l(L.passwordShort));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(l(L.passwordMismatch));
      return;
    }
    setSubmitting(true);
    const result = resetPassword(resetEmail, newPassword);
    if (!result.ok) {
      setSubmitting(false);
      setError(l(L.accountNotFound));
      return;
    }
    setSubmitting(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7f7f3] text-teal-text"><Check className="h-7 w-7" /></div>
        <h2 className="mt-6 text-[32px] font-bold tracking-[-0.04em] text-navy">{l(L.resetSuccessTitle)}</h2>
        <p className="mt-2 text-[12.5px] text-slate">{l(L.resetSuccessSub)}</p>
        <button type="button" onClick={() => onComplete(resetEmail)} className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-brand text-[12px] font-semibold text-white shadow-cta transition hover:bg-brand-hover">
          {l(L.backToLogin)} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const title = step === "email" ? L.resetTitle : step === "code" ? L.resetCodeTitle : L.newPasswordTitle;
  const description = step === "email" ? l(L.resetSub) : step === "code" ? <>{l(L.resetCodeSub)} <span className="font-semibold text-ink">{resetEmail}</span></> : l(L.newPasswordSub);

  return (
    <>
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> {l(L.backToLogin)}</button>
      <h2 className="text-[30px] font-bold tracking-[-0.04em] text-navy sm:text-[34px]">{l(title)}</h2>
      <p className="mt-2 text-[12.5px] leading-5 text-slate">{description}</p>

      {step === "email" ? (
        <form onSubmit={sendResetCode} className="mt-7 space-y-4">
          <Field label={l(L.email)} icon={<Mail className="h-4 w-4" />}>
            <input aria-label={l(L.email)} type="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} placeholder={l(L.emailPlaceholder)} autoComplete="email" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-muted" />
          </Field>
          <Feedback error={error} notice={notice} />
          <PrimaryButton loading={submitting}>{l(L.sendCode)} <ArrowRight className="h-4 w-4" /></PrimaryButton>
        </form>
      ) : step === "code" ? (
        <form onSubmit={confirmResetCode} className="mt-7 space-y-4">
          <Field label={l(L.code)} icon={<LockKeyhole className="h-4 w-4" />}>
            <input aria-label={l(L.code)} inputMode="numeric" value={resetCode} onChange={(event) => setResetCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={l(L.codePlaceholder)} className="h-full min-w-0 flex-1 bg-transparent text-[13px] font-semibold tracking-[0.18em] text-ink placeholder:text-[12px] placeholder:font-normal placeholder:tracking-normal placeholder:text-muted" />
          </Field>
          <Feedback error={error} notice={notice} />
          <PrimaryButton loading={submitting}>{l(L.continue)} <ArrowRight className="h-4 w-4" /></PrimaryButton>
          <button type="button" onClick={() => { setResetCode(""); setNotice(l(L.mockCode)); }} className="w-full text-center text-[10.5px] font-semibold text-brand hover:underline">{l(L.resend)}</button>
        </form>
      ) : (
        <form onSubmit={saveNewPassword} className="mt-7 space-y-4">
          <PasswordField label={l(L.newPassword)} value={newPassword} onChange={setNewPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder={l(L.passwordPlaceholder)} />
          <PasswordField label={l(L.confirmPassword)} value={confirmPassword} onChange={setConfirmPassword} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder={l(L.confirmPasswordPlaceholder)} />
          <Feedback error={error} notice={notice} />
          <PrimaryButton loading={submitting}>{l(L.resetAction)} <ArrowRight className="h-4 w-4" /></PrimaryButton>
        </form>
      )}
    </>
  );
}

function PasswordField({ label, value, onChange, visible, onToggle, placeholder }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; placeholder: string }) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold text-ink">{label}</span>
      <div className="flex h-11 items-center gap-2.5 rounded-[10px] border border-border bg-white px-3 transition focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/10">
        <LockKeyhole className="h-4 w-4 flex-shrink-0 text-muted" />
        <input aria-label={label} type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="new-password" className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-muted" />
        <button type="button" onClick={onToggle} aria-label={visible ? "Hide password" : "Show password"} className="text-muted hover:text-ink">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return <div className="block"><span className="mb-1.5 block text-[11px] font-semibold text-ink">{label}</span><span className="flex h-11 items-center gap-2.5 rounded-[10px] border border-border bg-white px-3 transition focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/10"><span className="flex-shrink-0 text-muted">{icon}</span>{children}</span></div>;
}

function PrimaryButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return <button type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-brand text-[12px] font-semibold text-white shadow-cta transition hover:bg-brand-hover disabled:opacity-70">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : children}</button>;
}

function Feedback({ error, notice }: { error: string | null; notice: string | null }) {
  if (!error && !notice) return null;
  return <div role={error ? "alert" : "status"} className={`rounded-[9px] border px-3 py-2.5 text-[10.5px] font-medium ${error ? "border-brand/15 bg-soft-pink text-brand" : "border-teal/20 bg-[#f1faf8] text-teal-text"}`}>{error || notice}</div>;
}

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.04H12v3.86h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.34Z" /><path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.58A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.39 13.9A6 6 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.52H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.58Z" /><path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.82 1.5l2.88-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.58C7.18 7.73 9.39 5.97 12 5.97Z" /></svg>;
}
