'use client';

import { useState } from 'react';

export type LocationValue = {
  label: string;
  value: string;
}

interface LocationInputProps {
  value?: LocationValue;
  onChange: (value: LocationValue) => void;
  placeholder?: string;
  onValidationChange?: (hasError: boolean) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your location",
  onValidationChange
}) => {
  const [inputValue, setInputValue] = useState(value?.label || '');
  const [locationError, setLocationError] = useState("");

  // Regex for location validation: cannot start with number, must contain alphabets, no special characters allowed anywhere
  const locationRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;

  const validateLocation = (value: string) => {
    if (!value.trim()) {
      setLocationError("");
      onValidationChange?.(false);
      return true;
    }

    if (!locationRegex.test(value.trim())) {
      setLocationError("Location cannot start with a number, must contain alphabets, and no special characters allowed");
      onValidationChange?.(true);
      return false;
    }

    setLocationError("");
    onValidationChange?.(false);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const isValid = validateLocation(newValue);
    
    // Update the parent component only if valid or empty
    if (isValid || !newValue.trim()) {
      onChange({
        label: newValue,
        value: newValue
      });
    }
  };

  return ( 
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`
          w-full
          p-4
          text-lg
          border-2
          rounded-xl
          focus:outline-none
          ${locationError ? 'border-red-500 bg-red-50/50' : 'border-alibaba-gray-200 focus:border-alibaba-orange bg-white/80'}
          backdrop-blur-sm
          transition-all
          duration-300
          disabled:opacity-70
          disabled:cursor-not-allowed
          shadow-lg
          hover:shadow-xl
          placeholder:text-alibaba-gray-400
          font-medium
        `}
      />
      {locationError && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-100/90 backdrop-blur-sm border border-red-300 rounded-xl text-red-700 text-sm z-10 w-full shadow-lg animate-in slide-in-from-top-2 duration-300">
          {locationError}
        </div>
      )}
    </div>
   );
}
 
export default LocationInput;