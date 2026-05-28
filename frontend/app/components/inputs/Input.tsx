"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/app/lib/cn";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  rows?: number;
  placeholder?: string;
  noValidation?: boolean;
}

/**
 * Premium floating-label input. Supports text, password (with toggle),
 * number (with ₹ prefix), and textarea.
 */
const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  rows,
  placeholder,
  noValidation = false,
}) => {
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === "textarea";
  const isPassword = type === "password";
  const isNumericField = type === "number" || formatPrice;

  const shouldValidate =
    !isNumericField && !noValidation && (type === "text" || type === "textarea");

  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
  const textareaRegex = /^[a-zA-Z][a-zA-Z0-9\s.,!?'-]*$/;

  const validateInput = (value: string) => {
    if (!shouldValidate || !value.trim()) {
      setValidationError("");
      return true;
    }
    const regex = isTextarea ? textareaRegex : textRegex;
    if (!regex.test(value.trim())) {
      setValidationError(
        isTextarea
          ? "Text cannot start with a number and only minimal punctuation is allowed."
          : "Text cannot start with a number and special characters aren't allowed."
      );
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (shouldValidate) validateInput(e.target.value);
  };

  const hasError = !!errors[id] || !!validationError;

  const baseField = cn(
    "peer w-full bg-white border rounded-xl outline-none transition-all duration-200",
    "px-4 pt-5 pb-2 font-medium text-ink placeholder:text-transparent",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    isTextarea ? "resize-none" : "",
    formatPrice && !isTextarea ? "pl-9" : "",
    isPassword ? "pr-10" : "",
    hasError
      ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
      : "border-ink-200 hover:border-ink-300 focus:border-brand focus:shadow-ring-brand"
  );

  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full relative" data-testid={`input-${id}`}>
      {formatPrice && !isTextarea && (
        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-ink-500 font-medium pointer-events-none z-10">
          ₹
        </span>
      )}

      {isTextarea ? (
        <textarea
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          rows={rows || 3}
          onChange={handleInputChange}
          className={baseField}
        />
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          type={resolvedType}
          onChange={handleInputChange}
          className={baseField}
        />
      )}

      <label
        htmlFor={id}
        className={cn(
          "absolute text-sm font-medium duration-200 transform z-0 origin-[0] pointer-events-none",
          "-translate-y-2.5 top-3.5 scale-75",
          "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4",
          "peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:top-3.5",
          formatPrice && !isTextarea ? "left-9 peer-placeholder-shown:left-9" : "left-4",
          hasError ? "text-red-500" : "text-ink-400 peer-focus:text-brand"
        )}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:text-ink hover:bg-ink/5 transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      )}

      {validationError && (
        <div className="mt-2 text-xs text-red-600 font-medium" role="alert">
          {validationError}
        </div>
      )}
    </div>
  );
};

export default Input;
