'use client';

import Image from "next/image";
import { FaUser } from "react-icons/fa";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  if (!src) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        <FaUser className="text-gray-600 text-sm" />
      </div>
    );
  }

  return ( 
    <Image 
      className="rounded-full" 
      height="30" 
      width="30" 
      alt="Avatar" 
      src={src}
    />
   );
}
 
export default Avatar;