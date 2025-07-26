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
    <div className="fixed w-full bg-white z-10 shadow-md">
      <div
        className="
          py-4 
          border-b-[2px]
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
          <div className="flex items-center gap-4">
            <a 
              href="/items" 
              className="
                hidden 
                md:block 
                text-sm 
                font-semibold 
                py-3 
                px-4 
                rounded-full 
                hover:bg-neutral-100 
                transition 
                cursor-pointer
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
                py-3 
                px-4 
                rounded-full 
                hover:bg-neutral-100 
                transition 
                cursor-pointer
              "
            >
              Support
            </a>
            <UserMenu currentUser={currentUser} />
          </div>
        </div>
      </Container>
    </div>
  </div>
  );
}


export default Navbar;