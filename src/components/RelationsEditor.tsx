/**
 * RelationsEditor Component
 * Allows users to define relationships between database tables
 */

import type { PageSpec, RelationSpec } from "@/src/types/quote";
import { RELATION_TYPES } from "@/src/constants";
import { ToggleCard, SelectBox } from "@/src/components/ui";

interface RelationsEditorProps {
  fk: boolean;
  setFk: (value: boolean) => void;
  pages: PageSpec[];
  relations: RelationSpec[];
  sourceTable: string;
  targetTable: string;
  relationType: string;
  setSourceTable: (value: string) => void;
  setTargetTable: (value: string) => void;
  setRelationType: (value: string) => void;
  setValidationError: (value: string | null) => void;
  setRelations: React.Dispatch<React.SetStateAction<RelationSpec[]>>;
}

export function RelationsEditor({
  fk,
  setFk,
  pages,
  relations,
  sourceTable,
  targetTable,
  relationType,
  setSourceTable,
  setTargetTable,
  setRelationType,
  setValidationError,
  setRelations,
}: RelationsEditorProps) {
  const tableOptions = pages.map((p) => p.topic || "Untitled");
  const selectedSource = tableOptions.includes(sourceTable)
    ? sourceTable
    : tableOptions[0] || "";
  const selectedTarget = tableOptions.includes(targetTable)
    ? targetTable
    : tableOptions[Math.min(1, tableOptions.length - 1)] || "";

  const handleAddRelation = () => {
    if (selectedSource === selectedTarget) {
      setValidationError("A table cannot relate to itself in this basic setup.");
      return;
    }

    const exists = relations.some(
      (relation) =>
        relation.sourceTable === selectedSource &&
        relation.targetTable === selectedTarget &&
        relation.relationType === relationType
    );

    if (exists) {
      setValidationError("This relationship is already added.");
      return;
    }

    setValidationError(null);
    setRelations((prev) => [
      ...prev,
      { sourceTable: selectedSource, relationType, targetTable: selectedTarget },
    ]);
  };

  return (
    <div className="space-y-4">
      <ToggleCard
        label="Enable table relationships"
        desc="Foreign key constraints"
        active={fk}
        set={setFk}
        icon="ti-git-fork"
      />

      {fk && (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectBox
              label="Source model"
              value={selectedSource}
              onChange={setSourceTable}
              options={tableOptions}
            />
            <SelectBox
              label="Relation"
              value={relationType}
              onChange={setRelationType}
              options={RELATION_TYPES}
            />
            <SelectBox
              label="Target model"
              value={selectedTarget}
              onChange={setTargetTable}
              options={tableOptions}
            />
          </div>

          <button type="button" onClick={handleAddRelation} className="btn-primary">
            <i className="ti ti-plus" /> Add relationship
          </button>

          <div className="space-y-2">
            {relations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
                No relationships added yet.
              </div>
            ) : (
              relations.map((relation, idx) => (
                <div
                  key={`${relation.sourceTable}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-sm font-black text-slate-800">
                    {relation.sourceTable}{" "}
                    <span className="text-teal-600">{relation.relationType}</span>{" "}
                    {relation.targetTable}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setRelations((prev) => prev.filter((_, relIdx) => relIdx !== idx))
                    }
                    className="grid h-9 w-9 place-items-center rounded-full text-rose-500 hover:bg-rose-50"
                  >
                    <i className="ti ti-trash" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}