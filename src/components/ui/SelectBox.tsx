/**
 * SelectBox Component
 * A styled select dropdown with label
 */

interface SelectBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SelectBox({ label, value, onChange, options }: SelectBoxProps) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input mt-2">
        {options.map((option, idx) => (
          <option key={`${option}-${idx}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}