/**
 * TextInput Component
 * A styled text input field with label and optional error message
 */

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  error?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  error,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="form-label">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input mt-2 ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
        placeholder={placeholder}
        required={required}
      />
      {error && (
        <span className="mt-1 block text-xs font-bold text-rose-600">
          <i className="ti ti-alert-circle mr-1" />
          {error}
        </span>
      )}
    </label>
  );
}
