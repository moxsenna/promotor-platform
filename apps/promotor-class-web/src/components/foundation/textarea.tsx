import type { ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea"> & {
  label?: string;
  hint?: string;
  error?: string;
};

/** Uncontrolled textarea with optional label/hint/error. Server-component safe. */
export function Textarea({ label, hint, error, id, name, required, className, ...rest }: TextareaProps) {
  const fieldId = id ?? (name ? `field-${name}` : undefined);
  return (
    <div className="pc-field">
      {label ? (
        <label className="pc-field-label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        name={name}
        required={required}
        className={["pc-textarea", error ? "pc-input--error" : "", className].filter(Boolean).join(" ")}
        {...rest}
      />
      {error ? <p className="pc-field-error">{error}</p> : hint ? <p className="pc-field-hint">{hint}</p> : null}
    </div>
  );
}
