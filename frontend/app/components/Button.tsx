'use client';

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType,
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled, 
  outline,
  small,
  icon: Icon,
}) => {
  return ( 
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        transition-all
        duration-200
        w-full
        font-semibold
        shadow-sm
        hover:shadow-md
        transform
        hover:scale-[1.02]
        active:scale-[0.98]
        ${outline 
          ? 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white' 
          : 'bg-orange-500 border-2 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600'
        }
        ${small ? 'text-sm py-2 px-4' : 'text-md py-3 px-6'}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
      `}
    >
      {Icon && (
        <Icon
          size={small ? 18 : 24}
          className="
            absolute
            left-4
            top-1/2
            transform
            -translate-y-1/2
          "
        />
      )}
      <span className={Icon ? 'ml-8' : ''}>
        {label}
      </span>
    </button>
   );
}
 
export default Button;