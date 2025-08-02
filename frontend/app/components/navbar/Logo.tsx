'use client';

import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

const Logo = () => {
  const router = useRouter();

  return ( 
    <div
      onClick={() => router.push('/')}
      className="hidden md:flex items-center gap-2 cursor-pointer font-bold text-3xl text-red-600 hover:text-red-700 transition-colors drop-shadow-md"
    >
      <FaShoppingCart size={32} className="text-red-600" />
      <span>RentCart</span>
    </div>
   );
}
 
export default Logo;
