"use client";
import { Plus, Sparkles } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLoc } from "@/lib/i18n/use-i18n";
import { getEmployee } from "@/lib/mock/employees";

const L = {
  title: { zh: "技能", en: "Skills" },
  addSkill: { zh: "添加技能", en: "Add Skill" },
  mastered: { zh: "已掌握 · 调用 24 次", en: "Mastered · invoked 24 times" },
} as const;

export default function SkillsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const e = getEmployee(id);
  const l = useLoc();
  return (
    <div className="space-y-5 p-7 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">{l(L.title)}</h2>
        <Button>
          <Plus className="h-3.5 w-3.5" /> {l(L.addSkill)}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {e?.skills.map((s) => (
          <div
            key={s.en}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft-pink">
              <Sparkles className="h-4 w-4 text-brand-strong" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-ink">{l(s)}</div>
              <div className="text-[11px] text-muted">{l(L.mastered)}</div>
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </div>
    </div>
  );
}
