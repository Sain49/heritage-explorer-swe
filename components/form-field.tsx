// reusable form field with label, input/textarea, and error message

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "textarea";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  rows = 5,
}: FormFieldProps) {
  const inputClassName = `w-full px-4 py-3 border bg-white focus:outline-none transition-colors duration-200 ${
    error
      ? "border-red-800 focus:border-red-800"
      : "border-stone-400 focus:border-stone-800"
  }`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-stone-800 mb-2 uppercase tracking-wide"
      >
        {label} {required && <span className="text-red-800">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${inputClassName} resize-none`}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          required={required}
        />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-900 border-l-2 border-red-800 pl-3">
          {error}
        </p>
      )}
    </div>
  );
}
