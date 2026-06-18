/**
 * SummaryPanel Component
 * Displays a summary of the configured project (stack, modules, tables, relations)
 */

import type { PageSpec, RelationSpec, ModuleItem } from "@/src/types/quote";

interface SummaryPanelProps {
  frontend: string | null;
  devLanguage: string | null;
  backend: string | null;
  database: string | null;
  modules: ModuleItem[];
  pages: PageSpec[];
  fk: boolean;
  relations: RelationSpec[];
  total: number;
  days: number;
  compact?: boolean;
}

export function SummaryPanel({
  frontend,
  devLanguage,
  backend,
  database,
  modules,
  pages,
  fk,
  relations,
  days,
  compact = false,
}: SummaryPanelProps) {
  return (
    <div className={`${compact ? "" : "surface-panel sticky top-24"} p-4`}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        Project summary
      </p>

      {/* Delivery Timeline */}
      <div className="mt-3 rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-xl font-black">Custom Quote</p>
        <p className="mt-1 text-sm font-bold text-teal-200">
          {days}-{days + 2} working days
        </p>
      </div>

      {/* Tech Stack */}
      <div className="mt-4 grid gap-3">
        {[
          ["Frontend", frontend || "Not selected"],
          ["Language", devLanguage || "Not selected"],
          ["Backend", backend || "Not selected"],
          ["Database", database || "Not selected"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      {/* Active Modules */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          Modules
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {modules.length ? (
            modules.map((module) => (
              <span
                key={module.label}
                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700"
              >
                {module.label}
              </span>
            ))
          ) : (
            <span className="text-sm font-bold text-slate-400">None selected</span>
          )}
        </div>
      </div>

      {/* Tables & Joins */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
            Tables
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">{pages.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
            Joins
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">{fk ? relations.length : 0}</p>
        </div>
      </div>
    </div>
  );
}