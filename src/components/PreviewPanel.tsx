/**
 * PreviewPanel Component
 * Shows a simple preview/summary of all selections before proceeding to contact step
 */

import type { PageSpec, RelationSpec, ModuleItem } from "@/src/types/quote";

interface PreviewPanelProps {
  frontend: string | null;
  devLanguage: string | null;
  backend: string | null;
  database: string | null;
  features: {
    login: boolean;
    encrypt: boolean;
    jwt: boolean;
    admin: boolean;
    email: boolean;
    upload: boolean;
    search: boolean;
    fk: boolean;
  };
  modules: ModuleItem[];
  pages: PageSpec[];
  relations: RelationSpec[];
  total: number;
  days: number;
}

export function PreviewPanel({
  frontend,
  devLanguage,
  backend,
  database,
  features,
  modules,
  pages,
  relations,
  days,
}: PreviewPanelProps) {
  const featureItems = [
    { label: "Login & Register", active: features.login, icon: "ti-user-check" },
    { label: "Password Encryption", active: features.encrypt, icon: "ti-shield-lock" },
    { label: "JWT Tokens", active: features.jwt, icon: "ti-key" },
    { label: "Admin Dashboard", active: features.admin, icon: "ti-dashboard" },
    { label: "Email Automation", active: features.email, icon: "ti-mail" },
    { label: "File Uploads", active: features.upload, icon: "ti-cloud-upload" },
    { label: "Search Feature", active: features.search, icon: "ti-search" },
    { label: "Foreign Key Relations", active: features.fk, icon: "ti-git-fork" },
  ];

  return (
    <div className="space-y-6">
      {/* Tech Stack Preview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-700">
            1
          </span>
          <h3 className="text-lg font-black text-slate-950">Technology Stack</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Frontend", value: frontend },
            { label: "Language", value: devLanguage },
            { label: "Backend", value: backend },
            { label: "Database", value: database },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-black text-slate-950">{item.value || "Not selected"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-700">
            2
          </span>
          <h3 className="text-lg font-black text-slate-950">Selected Features</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {featureItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-xl p-3 ${
                item.active
                  ? "bg-teal-50 border border-teal-200"
                  : "bg-slate-50 border border-slate-100 opacity-50"
              }`}
            >
              <i
                className={`ti ${item.icon} text-sm ${
                  item.active ? "text-teal-600" : "text-slate-400"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  item.active ? "text-teal-800" : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
              {item.active && (
                <i className="ti ti-check ml-auto text-teal-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schema/Tables Preview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-700">
            3
          </span>
          <h3 className="text-lg font-black text-slate-950">Database Tables</h3>
        </div>
        <div className="space-y-3">
          {pages.map((page, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-black text-slate-950">{page.topic || `Table ${idx + 1}`}</h4>
                <div className="flex gap-1">
                  {page.create && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                      C
                    </span>
                  )}
                  {page.read && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase text-blue-700">
                      R
                    </span>
                  )}
                  {page.update && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">
                      U
                    </span>
                  )}
                  {page.delete && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase text-rose-700">
                      D
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {page.fields.map((field, fieldIdx) => (
                  <span
                    key={fieldIdx}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200"
                  >
                    {field.label || "field"}: <span className="text-teal-600">{field.type}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relations Preview */}
      {relations.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-700">
              4
            </span>
            <h3 className="text-lg font-black text-slate-950">Table Relationships</h3>
          </div>
          <div className="space-y-2">
            {relations.map((rel, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <span className="font-black text-slate-950">{rel.sourceTable}</span>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-700">
                  {rel.relationType}
                </span>
                <span className="font-black text-slate-950">{rel.targetTable}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Timeline */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
              Estimated Delivery
            </p>
            <p className="mt-1 text-3xl font-black">
              {days}-{days + 2} working days
            </p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/20">
            <i className="ti ti-clock text-2xl text-teal-400" />
          </div>
        </div>
      </div>
    </div>
  );
}