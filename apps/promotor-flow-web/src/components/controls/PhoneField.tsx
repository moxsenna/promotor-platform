"use client";

import { forwardRef, useState, useEffect } from "react";
import { normalizePhone } from "@promotor/platform-core";

interface PhoneFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: React.ReactNode;
}

/**
 * PhoneField component (design.md §23, integration contract §9)
 * Input displays Indonesian format, stores E.164 format.
 * Uses platform-core for normalization.
 */
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ label, placeholder, value, onChange, required, error }, ref) => {
    // Internal display value (Indonesian format)
    const [displayValue, setDisplayValue] = useState(value || "");

    useEffect(() => {
      // When external value changes (E.164), update display
      if (value && value.startsWith("+")) {
        setDisplayValue(formatPhoneForDisplay(value));
      } else if (value) {
        setDisplayValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);

      // Normalize to E.164 when valid phone number
      if (newValue.trim()) {
        try {
          const normalized = normalizePhone(newValue);
          onChange?.(normalized);
        } catch {
          // Keep raw value if not valid phone number yet
          onChange?.(newValue);
        }
      } else {
        onChange?.("");
      }
    };

    return (
      <div className="pf-field">
        <label className="pf-field-label">
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          type="tel"
          className={`pf-input ${error ? "pf-input--error" : ""}`}
          placeholder={placeholder || "0812 1234 5678"}
          value={displayValue}
          onChange={handleChange}
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

PhoneField.displayName = "PhoneField";

// Helper: Format E.164 for Indonesian display
function formatPhoneForDisplay(e164: string): string {
  // Remove + and country code
  const cleaned = e164.replace(/^\+62/, "");
  // Insert spaces after first digit and then every 4 digits
  return `0${cleaned}`.replace(/(\d{1})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}
