import { useState } from "react";
import { useLocation } from "wouter";
import { Zap, Check, ArrowRight, Timer, Target, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    workspaceName: "Personal Cockpit",
    role: "engineer",
    cadence: "25",
    dailyTarget: 4,
    firstTask: "Complete inaugural deep work session",
  });

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save onboarding preferences into localStorage
      localStorage.setItem("pace_onboarding_completed", "true");
      localStorage.setItem("pace_daily_target", String(data.dailyTarget));
      setLocation("/pomodoro");
    }
  };

  return (
    <AuthLayout
      title="Welcome to pace."
      subtitle={`Step ${step} of 3: Tailor your cognitive focus environment.`}
      backTo="/pomodoro"
    >
      <div className="space-y-6 font-sans">
        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "bg-greptile-green" : "bg-surface-raised border border-border"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Role & Workspace */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                Workspace Name
              </label>
              <input
                type="text"
                value={data.workspaceName}
                onChange={(e) => setData({ ...data, workspaceName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                Primary Creative Persona
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: "engineer", label: "Software Engineer" },
                  { id: "founder", label: "Founder / Executive" },
                  { id: "creator", label: "Designer / Writer" },
                  { id: "student", label: "Researcher / Student" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setData({ ...data, role: item.id })}
                    className={`p-2.5 rounded-[4px] border text-left transition-all ${
                      data.role === item.id
                        ? "border-greptile-green bg-greptile-green/10 text-greptile-green font-bold"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Focus Cadence */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                Preferred Focus Rhythm
              </label>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { id: "25", title: "Standard 25 / 5m Interval", desc: "Classic Pomodoro cycle. Ideal for high context-switching days." },
                  { id: "50", title: "Deep Flow 50 / 10m Interval", desc: "Extended focus sprint. Ideal for systems engineering and writing." },
                  { id: "90", title: "Ultradian 90 / 20m Rhythm", desc: "Deep biological rhythm for intensive creative creation." },
                ].map((cad) => (
                  <button
                    type="button"
                    key={cad.id}
                    onClick={() => setData({ ...data, cadence: cad.id })}
                    className={`w-full p-3 rounded-[4px] border text-left transition-all ${
                      data.cadence === cad.id
                        ? "border-greptile-green bg-greptile-green/10 text-greptile-green"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="font-bold text-foreground">{cad.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{cad.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Daily Target & First Task */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                Daily Focus Session Target
              </label>
              <div className="flex items-center gap-3">
                {[2, 4, 6, 8].map((target) => (
                  <button
                    type="button"
                    key={target}
                    onClick={() => setData({ ...data, dailyTarget: target })}
                    className={`flex-1 py-2 rounded-[4px] border font-mono text-xs font-bold transition-all ${
                      data.dailyTarget === target
                        ? "border-greptile-green bg-greptile-green text-black"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {target} Cycles
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                First High-Priority Task
              </label>
              <input
                type="text"
                value={data.firstTask}
                onChange={(e) => setData({ ...data, firstTask: e.target.value })}
                placeholder="e.g. Architect PostgreSQL database schema"
                className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3 py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={nextStep}
            className="px-5 py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.3)]"
          >
            {step === 3 ? "Launch Workspace" : "Continue"} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
