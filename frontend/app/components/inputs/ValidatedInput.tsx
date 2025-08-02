'use client';

import React, { useState, useEffect } from 'react';
import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface ValidatedInputProps {
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
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  validationType?: 'title' | 'description' | 'usagePolicy';
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
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
  setValue,
  watch,
  validationType,
}) => {
  const [validationError, setValidationError] = useState("");
  const currentValue = watch(id) || "";
  const isTextarea = type === "textarea";

  // Regex patterns - consistent with other components
  const titleRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
  const descriptionRegex = /^[a-zA-Z0-9\s.,!?'"()-]*$/;

  const validateInput = (value: string) => {
    if (!value.trim()) {
      setValidationError("");
      return true;
    }

    if (validationType === 'title') {
      // Title validation: 5-50 characters, no special chars, can't start with number, must have alphabets
      if (value.trim().length < 5) {
        setValidationError("Title must be at least 5 characters long");
        return false;
      }
      if (value.trim().length > 50) {
        setValidationError("Title cannot exceed 50 characters");
        return false;
      }
      if (!titleRegex.test(value.trim())) {
        setValidationError("Title cannot start with a number, must contain alphabets, and no special characters allowed");
        return false;
      }
    } else if (validationType === 'description') {
      // Description validation: 10-150 words, more lenient character validation
      const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      if (wordCount < 10) {
        setValidationError("Description must contain at least 10 words");
        return false;
      }
      if (wordCount > 150) {
        setValidationError("Description cannot exceed 150 words");
        return false;
      }
      if (!descriptionRegex.test(value.trim())) {
        setValidationError("Description contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed.");
        return false;
      }
    } else if (validationType === 'usagePolicy') {
      // Usage policy validation: same as description but optional
      if (value.trim()) {
        const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
        if (wordCount < 10) {
          setValidationError("Usage policy must contain at least 10 words if provided");
          return false;
        }
        if (wordCount > 150) {
          setValidationError("Usage policy cannot exceed 150 words");
          return false;
        }
        if (!descriptionRegex.test(value.trim())) {
          setValidationError("Usage policy cannot start with a number, must contain alphabets, and minimal special characters allowed");
          return false;
        }
      }
    }

    setValidationError("");
    return true;
  };

  useEffect(() => {
    if (validationType && currentValue) {
      validateInput(currentValue);
    }
  }, [currentValue, validationType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValue(id, value, { shouldDirty: true, shouldTouch: true });
    
    if (validationType) {
      validateInput(value);
    }
  };

  return (
    <div className="w-full relative">
      {formatPrice && !isTextarea && (
        <span
          className="
            text-alibaba-gray-700
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
            bg-white/80
            backdrop-blur-sm
            border-2
            rounded-xl
            outline-none
            transition-all
            duration-300
            disabled:opacity-70
            disabled:cursor-not-allowed
            resize-none
            shadow-lg
            hover:shadow-xl
            placeholder:text-alibaba-gray-400
            ${errors[id] || validationError ? 'border-red-500 bg-red-50/50' : 'border-alibaba-gray-200'}
            ${errors[id] || validationError ? 'focus:border-red-500' : 'focus:border-alibaba-orange'}
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
            bg-white/80
            backdrop-blur-sm
            border-2
            rounded-xl
            outline-none
            transition-all
            duration-300
            disabled:opacity-70
            disabled:cursor-not-allowed
            shadow-lg
            hover:shadow-xl
            placeholder:text-alibaba-gray-400
            ${formatPrice ? 'pl-10' : 'pl-4'}
            ${errors[id] || validationError ? 'border-red-500 bg-red-50/50' : 'border-alibaba-gray-200'}
            ${errors[id] || validationError ? 'focus:border-red-500' : 'focus:border-alibaba-orange'}
          `}
        />
      )}
      <label 
        className={`
          absolute 
          text-md
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
          ${errors[id] || validationError ? 'text-red-500' : 'text-alibaba-gray-500'}
        `}
      >
        {label}
      </label>
      {validationError && (
        <div className="mt-2 p-3 bg-red-100/90 backdrop-blur-sm border border-red-300 rounded-xl text-red-700 text-sm shadow-lg animate-in slide-in-from-top-2 duration-300">
          {validationError}
        </div>
      )}
    </div>
   );
}
 
export default ValidatedInput;
