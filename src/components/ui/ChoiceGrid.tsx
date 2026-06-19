/**
 * ChoiceGrid Component
 * A grid of selectable options with icons and descriptions
 */

import type { ChoiceItem } from "@/src/types/quote";

interface ChoiceGridProps {
  items: ChoiceItem[];
  value: string | null;
  onSelect: (value: string) => void;
  clearError?: () => void;
  cols?: string;
  defaultSelect?: boolean;
}

export function ChoiceGrid({
  items,
  value,
  onSelect,
  clearError,
  cols = "sm:grid-cols-2",
  defaultSelect = false,
}: ChoiceGridProps) {
  // Auto-select first item if defaultSelect is true and no value is selected
  const selectedValue = value || (defaultSelect && items.length > 0 ? items[0].name : null);
  const activeValue = selectedValue;

  const handleClick = (name: string) => {
    onSelect(name);
    if (clearError) {
      clearError();
    }
  };

  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((item) => {
        const active = activeValue === item.name;
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => handleClick(item.name)}
            className={`option-card text-left ${active ? "is-active" : ""}`}
          >
            <span className="flex items-start justify-between gap-3">
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${
                  active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                <i className={`ti ${item.icon}`} />
              </span>
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border ${
                  active
                    ? "border-teal-500 bg-teal-500 text-white"
                    : "border-slate-200 text-transparent"
                }`}
              >
                <i className="ti ti-check text-sm" />
              </span>
            </span>
            <span className="mt-6 block text-lg font-black text-slate-950">
              {item.name}
            </span>
            <span className="mt-2 block text-sm leading-6 text-slate-500">
              {item.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}