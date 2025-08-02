import { SafeUser } from "@/app/types";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
}) => {
  return ( 
    <div className="fixed w-full bg-alibaba-orange z-50 shadow-lg">
      <div
        className="
          py-4 
          border-b-[2px]
          border-alibaba-black
          shadow-sm
        "
      >
      <Container>
        <div 
          className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
        >
          <Logo />
          <Search />
          <div className="flex items-center gap-3">
            <a 
              href="/items" 
              className="
                hidden 
                md:block 
                text-sm 
                font-semibold 
                py-2
                px-5 
                rounded-lg
                text-white
                bg-alibaba-black
                border-2
                border-white
                hover:bg-alibaba-gray-800
                hover:border-alibaba-gray-800
                hover:shadow-lg
                transform
                hover:scale-105
                transition-all
                duration-200
                cursor-pointer
                shadow-md
                hover:shadow-xl
              "
            >
              Browse Items
            </a>
            <a 
              href="/support-chat" 
              className="
                hidden 
                md:block 
                text-sm 
                font-semibold 
                py-2
                px-5 
                rounded-lg
                text-white
                bg-alibaba-black
                border-2
                border-white
                hover:bg-alibaba-gray-800
                hover:border-alibaba-gray-800
                hover:shadow-lg
                transform
                hover:scale-105
                transition-all
                duration-200
                cursor-pointer
                shadow-md
                hover:shadow-xl
              "
            >
              Support
            </a>
            <UserMenu />
          </div>
        </div>
      </Container>
    </div>
  </div>
  );
}


export default Navbar;