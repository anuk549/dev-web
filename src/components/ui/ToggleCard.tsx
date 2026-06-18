/**
 * ToggleCard Component
 * A card with a toggle switch for enabling/disabling features
 */

interface ToggleCardProps {
  label: string;
  desc: string;
  active: boolean;
  set: (value: boolean) => void;
  icon: string;
}

export function ToggleCard({ label, desc, active, set, icon }: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={() => set(!active)}
      className={`option-card flex items-center justify-between gap-4 text-left ${
        active ? "is-active" : ""
      }`}
    >
      <span className="flex items-center gap-4">
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${
            active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          <i className={`ti ${icon}`} />
        </span>
        <span>
          <span className="block font-black text-slate-950">{label}</span>
          <span className="mt-1 block text-sm font-bold text-slate-400">{desc}</span>
        </span>
      </span>
      <span
        className={`relative h-7 w-12 rounded-full transition ${
          active ? "bg-teal-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            active ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}