'use client';

import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister 
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import { useState, useEffect } from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  rows?: number;
  placeholder?: string;
  noValidation?: boolean; // For fields like price, quantity that should skip text validation
}

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
  const isTextarea = type === "textarea";
  const isNumericField = type === "number" || formatPrice;
  
  // Skip validation for numeric fields or when noValidation is true
  const shouldValidate = !isNumericField && !noValidation && (type === "text" || type === "textarea");

  // Regex for text validation: cannot start with number, must contain alphabets, minimal special characters
  const textRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
  const textareaRegex = /^[a-zA-Z][a-zA-Z0-9\s.,!?'-]*$/; // Allow basic punctuation for longer texts

  const validateInput = (value: string) => {
    if (!shouldValidate || !value.trim()) {
      setValidationError("");
      return true;
    }

    const regex = isTextarea ? textareaRegex : textRegex;
    
    if (!regex.test(value.trim())) {
      if (isTextarea) {
        setValidationError("Text cannot start with a number, must contain alphabets, and minimal special characters allowed");
      } else {
        setValidationError("Text cannot start with a number, must contain alphabets, and no special characters allowed");
      }
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (shouldValidate) {
      validateInput(e.target.value);
    }
  };
  
  return (
    <div className="w-full relative">
      {formatPrice && !isTextarea && (
        <span
          className="
            text-gray-700
            absolute
            top-5
            left-3
            text-lg
            font-semibold
            z-20
          "
        >
          ₹
        </span>
      )}
      {isTextarea ? (
        <textarea
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder={placeholder || " "}
          rows={rows || 3}
          onChange={handleInputChange}
          className={`
            peer
            w-full
            p-4
            pt-6 
            font-medium 
            bg-white
            border-2
            rounded-xl
            outline-none
            transition-all
            duration-300
            disabled:opacity-70
            disabled:cursor-not-allowed
            resize-none
            shadow-sm
            hover:shadow-md
            focus:shadow-lg
            placeholder:text-gray-400
            ${errors[id] || validationError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            ${errors[id] || validationError ? 'focus:border-red-500' : 'focus:border-orange-500'}
          `}
        />
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder={placeholder || " "}
          type={type}
          onChange={handleInputChange}
          className={`
            peer
            w-full
            p-4
            pt-6 
            font-medium 
            bg-white
            border-2
            rounded-xl
            outline-none
            transition-all
            duration-300
            disabled:opacity-70
            disabled:cursor-not-allowed
            shadow-sm
            hover:shadow-md
            focus:shadow-lg
            placeholder:text-gray-400
            ${formatPrice ? 'pl-10' : 'pl-4'}
            ${errors[id] || validationError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            ${errors[id] || validationError ? 'focus:border-red-500' : 'focus:border-orange-500'}
          `}
        />
      )}
      <label 
        className={`
          absolute 
          text-sm
          duration-300
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          ${formatPrice && !isTextarea ? 'left-10' : 'left-4'}
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75
          peer-focus:-translate-y-4
          font-medium
          ${errors[id] || validationError ? 'text-red-500' : 'text-gray-500'}
        `}
      >
        {label}
      </label>
      {validationError && (
        <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-sm shadow-lg animate-in slide-in-from-top-2 duration-300">
          {validationError}
        </div>
      )}
    </div>
   );
}
 
export default Input;