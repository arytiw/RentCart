'use client';

import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

const Logo = () => {
  const router = useRouter();

  return ( 
    <div
      onClick={() => router.push('/')}
      className="hidden md:flex items-center gap-2 cursor-pointer font-bold text-3xl text-alibaba-black hover:text-alibaba-gray-800 transition-colors drop-shadow-md"
    >
      <FaShoppingCart size={32} className="text-alibaba-black" />
      <span>RentCart</span>
    </div>
   );
}
 
export default Logo;
