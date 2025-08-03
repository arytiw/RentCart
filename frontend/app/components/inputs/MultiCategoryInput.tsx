'use client';

import { IconType } from "react-icons";
import { FaCheck } from "react-icons/fa";

interface MultiCategoryInputProps {
  icon: IconType;
  label: string;
  selected: boolean;
  onClick: (value: string) => void;
}

const MultiCategoryInput: React.FC<MultiCategoryInputProps> = ({
  icon: Icon,
  label,
  selected,
  onClick
}) => {
  return ( 
    <div
      onClick={() => onClick(label)}
      className={`
        rounded-xl
        border-2
        p-6
        flex
        flex-col
        gap-4
        hover:border-alibaba-orange
        hover:shadow-lg
        hover:scale-105
        transform
        transition-all
        duration-200
        cursor-pointer
        relative
        ${selected ? 'border-alibaba-orange bg-alibaba-orange/5 shadow-lg' : 'border-alibaba-gray-200 bg-white'}
      `}
    >
      {/* Checkbox indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-alibaba-orange rounded-full flex items-center justify-center">
          <FaCheck size={12} className="text-white" />
        </div>
      )}
      
      <Icon size={32} className={`${selected ? 'text-alibaba-orange' : 'text-alibaba-gray-600'}`} />
      <div className={`font-semibold text-center ${selected ? 'text-alibaba-orange' : 'text-alibaba-black'}`}>
        {label}
      </div>
    </div>
   );
}
 
export default MultiCategoryInput; 