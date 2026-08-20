export const EMPLOYEE_PLAN_KEY = "creatiscout.employee.plan.v2";
export const PLUS_TRIAL_KEY = "creatiscout.account.plus-trial.v1";
export const PLUS_TRIAL_DAYS = 14;

export type PlusTrial = {
  plan: "plus";
  startedAt: string;
  endsAt: string;
};

export function getOrCreatePlusTrial(now = new Date()): PlusTrial | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(PLUS_TRIAL_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as PlusTrial;
      if (parsed.plan === "plus" && parsed.startedAt && parsed.endsAt) {
        const currentPlan = window.localStorage.getItem(EMPLOYEE_PLAN_KEY);
        const expired = new Date(parsed.endsAt).getTime() <= now.getTime();
        if (!currentPlan) window.localStorage.setItem(EMPLOYEE_PLAN_KEY, expired ? "free" : "plus");
        if (expired && currentPlan === "plus")
          window.localStorage.setItem(EMPLOYEE_PLAN_KEY, "free");
        return parsed;
      }
    } catch {
      // Replace malformed local trial state below.
    }
  }
  const endsAt = new Date(now);
  endsAt.setDate(endsAt.getDate() + PLUS_TRIAL_DAYS);
  const trial: PlusTrial = {
    plan: "plus",
    startedAt: now.toISOString(),
    endsAt: endsAt.toISOString(),
  };
  window.localStorage.setItem(PLUS_TRIAL_KEY, JSON.stringify(trial));
  window.localStorage.setItem(EMPLOYEE_PLAN_KEY, "plus");
  return trial;
}

export function getTrialDaysRemaining(trial: PlusTrial, now = new Date()) {
  return Math.max(0, Math.ceil((new Date(trial.endsAt).getTime() - now.getTime()) / 86_400_000));
}
