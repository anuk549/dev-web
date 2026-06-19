/**
 * Sidebar Component
 * Navigation sidebar showing step progress and allowing step navigation
 */

import { STEP_ITEMS } from "@/src/constants";

interface SidebarProps {
  currentStep: number;
  maxStepReached: number;
  progressPercent: number;
  onStepClick: (step: number) => void;
}

export function Sidebar({
  currentStep,
  maxStepReached,
  progressPercent,
  onStepClick,
}: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:flex-1">
      <div className="surface-panel sticky top-24 p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Progress
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <nav className="space-y-2">
          {STEP_ITEMS.map((item) => {
            const active = currentStep === item.idx;
            const done = currentStep > item.idx;
            const accessible = item.idx <= maxStepReached;

            return (
              <button
                key={item.idx}
                type="button"
                disabled={!accessible}
                onClick={() => onStepClick(item.idx)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10"
                    : accessible
                    ? "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                    : "border-transparent bg-slate-50 text-slate-300"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl ${
                    active ? "bg-white/10" : done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100"
                  }`}
                >
                  <i className={`ti ${done ? "ti-check" : item.icon}`} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold">{item.label}</span>
                  <span
                    className={`block text-xs ${active ? "text-white/55" : "text-slate-400"}`}
                  >
                    Step {item.idx}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}