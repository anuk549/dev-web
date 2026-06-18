/**
 * SchemaEditor Component
 * Allows users to define database tables and their fields
 */

import type { PageSpec, CrudKey, FieldSpec } from "@/src/types/quote";
import { FIELD_TYPES } from "@/src/constants";

interface SchemaEditorProps {
  pages: PageSpec[];
  activePageIdx: number;
  activePage: PageSpec;
  setActivePageIdx: (idx: number) => void;
  handleAddPage: () => void;
  handleRemovePage: (idx: number, event: React.MouseEvent) => void;
  updatePage: (idx: number, patch: Partial<PageSpec>) => void;
  handleCrudToggle: (pageIdx: number, key: CrudKey) => void;
  handleAddField: (pageIdx: number) => void;
  handleRemoveField: (pageIdx: number, fieldIdx: number) => void;
  updateField: (pageIdx: number, fieldIdx: number, patch: Partial<FieldSpec>) => void;
}

export function SchemaEditor({
  pages,
  activePageIdx,
  activePage,
  setActivePageIdx,
  handleAddPage,
  handleRemovePage,
  updatePage,
  handleCrudToggle,
  handleAddField,
  handleRemoveField,
  updateField,
}: SchemaEditorProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)]">
      {/* Table List Sidebar */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Tables</p>
          <button
            type="button"
            onClick={handleAddPage}
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white"
          >
            <i className="ti ti-plus" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto xl:block xl:space-y-2">
          {pages.map((page, idx) => (
            <div
              key={`${page.topic}-${idx}`}
              className={`min-w-40 rounded-2xl border bg-white/60 p-2 xl:w-full ${
                activePageIdx === idx
                  ? "border-teal-300 bg-white shadow-sm"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActivePageIdx(idx)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm font-black text-slate-950">
                    {page.topic || `Table ${idx + 1}`}
                  </span>
                  <span className="mt-2 block text-xs font-bold text-slate-400">
                    {page.fields.length} attributes
                  </span>
                </button>
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(event) => handleRemovePage(idx, event)}
                    aria-label={`Remove ${page.topic || `Table ${idx + 1}`}`}
                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <i className="ti ti-x text-xs" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Editor */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block">
            <span className="form-label">Table name</span>
            <input
              value={activePage.topic}
              onChange={(e) => updatePage(activePageIdx, { topic: e.target.value })}
              className="form-input mt-2"
              placeholder="Products"
            />
          </label>
          <div>
            <span className="form-label">Actions</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["create", "read", "update", "delete", "search"] as CrudKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCrudToggle(activePageIdx, key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wide ${
                    activePage[key]
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {key === "create"
                    ? "C"
                    : key === "read"
                    ? "R"
                    : key === "update"
                    ? "U"
                    : key === "delete"
                    ? "D"
                    : "S"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fields List */}
        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Attributes
            </p>
            <button
              type="button"
              onClick={() => handleAddField(activePageIdx)}
              className="btn-secondary px-3 py-2 text-xs"
            >
              <i className="ti ti-plus" /> Attribute
            </button>
          </div>
          <div className="space-y-2">
            {activePage.fields.map((field, idx) => (
              <div
                key={idx}
                className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 md:grid-cols-[minmax(0,1fr)_160px_44px]"
              >
                <input
                  value={field.label}
                  onChange={(e) => updateField(activePageIdx, idx, { label: e.target.value })}
                  className="form-input"
                  placeholder="field_name"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(activePageIdx, idx, { type: e.target.value })}
                  className="form-input"
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveField(activePageIdx, idx)}
                  className="grid h-11 w-full place-items-center rounded-xl text-rose-500 hover:bg-rose-50"
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}