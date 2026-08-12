import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
};

/** Uncontrolled text input with optional label/hint/error. Labels are always
    wired via htmlFor when present (design.md §41). Server-component safe. */
export function Input({ label, hint, error, id, name, required, className, ...rest }: InputProps) {
  const fieldId = id ?? (name ? `field-${name}` : undefined);
  return (
    <div className="pc-field">
      {label ? (
        <label className="pc-field-label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <input
        id={fieldId}
        name={name}
        required={required}
        className={["pc-input", error ? "pc-input--error" : "", className].filter(Boolean).join(" ")}
        {...rest}
      />
      {error ? <p className="pc-field-error">{error}</p> : hint ? <p className="pc-field-hint">{hint}</p> : null}
    </div>
  );
}
