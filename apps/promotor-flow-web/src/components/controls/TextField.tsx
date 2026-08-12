"use client";

import { forwardRef } from "react";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: React.ReactNode;
  className?: string;
}

/**
 * TextField component (design.md §23)
 * Single column, labels above input, min 44px height, inline validation errors.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, placeholder, value, onChange, required, error, className }, ref) => {
    return (
      <div className="pf-field">
        <label className="pf-field-label">
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          type="text"
          className={`pf-input ${error ? "pf-input--error" : ""} ${className || ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {error && (
          <span className="pf-field-error" id={`${label}-error`} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
