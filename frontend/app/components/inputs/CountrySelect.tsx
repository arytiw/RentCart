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
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your location"
}) => {
  const [inputValue, setInputValue] = useState(value?.label || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update the parent component
    onChange({
      label: newValue,
      value: newValue
    });
  };

  return ( 
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="
          w-full
          p-3
          text-lg
          border-2
          rounded-md
          focus:outline-none
          focus:border-black
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
        "
      />
    </div>
   );
}
 
export default LocationInput;