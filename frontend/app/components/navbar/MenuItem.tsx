'use client';

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  label
}) => {
  return ( 
    <div 
      onClick={onClick} 
      className="
        px-4 
        py-3 
        hover:bg-alibaba-orange/10
        hover:text-alibaba-orange
        transition-all
        duration-200
        font-semibold
        text-alibaba-black
        cursor-pointer
        border-l-4
        border-transparent
        hover:border-l-alibaba-orange
      "
    >
      {label}
    </div>
   );
}
 
export default MenuItem;