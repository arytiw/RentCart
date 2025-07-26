'use client';

import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return ( 
    <div
      onClick={() => router.push('/')}
      className="hidden md:block cursor-pointer font-bold text-3xl text-violet-500 hover:text-rose-600 transition-colors"
    >
      RentCart
    </div>
   );
}
 
export default Logo;
