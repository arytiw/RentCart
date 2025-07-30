// @ts-nocheck
"use client";

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { SafeUser } from "@/app/types";
import { useUser } from '@/app/providers/UserProvider';

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push('/listings/new');
  }, [router, user]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
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
          Rent your stuff
        </div>
        <div
          onClick={toggleOpen}
          className="
          p-3
          md:py-2.5
          md:px-4
          border-2
          border-white 
          flex 
          flex-row 
          items-center
          hover:bg-alibaba-orange-dark
          hover:border-alibaba-orange-dark
          hover:shadow-lg
          transform
          hover:scale-105
          gap-3 
          rounded-lg
          cursor-pointer
          bg-white
          transition-all
          duration-200
          shadow-md
          hover:shadow-xl
          "
        >
          <AiOutlineMenu className="text-alibaba-black" />
          <div className="hidden md:block">
            <Avatar src={user?.image} />
          </div>
          {user && (
            <span className="ml-2 font-semibold text-alibaba-black">
              {user.firstName || user.username || user.emailId}
            </span>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-xl
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
            border-2
            border-alibaba-gray-200
          "
        >
          <div className="flex flex-col cursor-pointer">
            {user ? (
              <>
                <MenuItem
                  label="My Dashboard"
                  onClick={() => router.push("/dashboard")}
                />
                <MenuItem
                  label="My favorites"
                  onClick={() => router.push("/favorites")}
                />
                <MenuItem label="Rent your stuff" onClick={() => router.push("/listings/new")} />
                <MenuItem label="Change Password" onClick={() => router.push("/auth/change-password")} />
                <hr className="border-alibaba-gray-200" />
                <MenuItem label="Logout" onClick={logout} />
              </>
            ) : (
              <>
                <MenuItem label="Login" onClick={() => router.push("/auth/login")} />
                <MenuItem label="Sign up" onClick={() => router.push("/auth/register")} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
