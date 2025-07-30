'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";

import ClientOnly from "./ClientOnly";

interface HeartButtonProps {
  listingId: string
  currentUser?: SafeUser | null
}

const HeartButton: React.FC<HeartButtonProps> = ({ 
  listingId,
  currentUser
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser
  });

  return (
    <div 
      onClick={toggleFavorite}
      className="
        relative
        hover:opacity-80
        transition-all
        duration-200
        cursor-pointer
        transform
        hover:scale-110
        active:scale-95
        p-2
        bg-white/20
        backdrop-blur-sm
        rounded-full
        border
        border-white/30
        hover:bg-white/30
        hover:border-white/50
        shadow-lg
        hover:shadow-xl
      "
    >
      <AiOutlineHeart
        size={24}
        className="
          fill-white
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1/2
          drop-shadow-lg
        "
      />
      <AiFillHeart
        size={20}
        className={
          hasFavorited 
            ? 'fill-red-500 drop-shadow-lg relative z-10' 
            : 'fill-transparent drop-shadow-md relative z-10'
        }
      />
    </div>
   );
}

export default HeartButton;