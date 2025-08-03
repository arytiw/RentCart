'use client';

import { IconType } from "react-icons";

interface CategoryBoxProps {
  icon: IconType,
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
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
        ${selected ? 'border-alibaba-orange bg-alibaba-orange/5 shadow-lg' : 'border-alibaba-gray-200 bg-white'}
      `}
    >
      <Icon size={32} className={`${selected ? 'text-alibaba-orange' : 'text-alibaba-gray-600'}`} />
      <div className={`font-semibold text-center ${selected ? 'text-alibaba-orange' : 'text-alibaba-black'}`}>
        {label}
      </div>
    </div>
   );
}
 
export default CategoryBox;