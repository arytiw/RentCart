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
      "
    >
      <AiOutlineHeart
        size={32}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
          drop-shadow-lg
        "
      />
      <AiFillHeart
        size={28}
        className={
          hasFavorited 
            ? 'fill-red-500 drop-shadow-lg' 
            : 'fill-white/80 drop-shadow-md'
        }
      />
    </div>
   );
}

export default HeartButton;