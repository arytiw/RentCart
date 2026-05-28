// @ts-nocheck
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiLogOut, FiUser, FiPackage, FiPlusCircle, FiKey } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { useUser } from "@/app/providers/UserProvider";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";
import ChangePasswordModal from "../modals/ChangePasswordModal";

const UserMenu: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), []);

  const onRent = useCallback(() => {
    if (!user) return router.push("/login");
    router.push("/rent");
  }, [router, user]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const displayName =
    user?.firstName || user?.username || user?.emailId?.split("@")[0] || "Menu";

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <button
          onClick={onRent}
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full bg-brand text-white hover:bg-brand-600 hover:shadow-glow transition-all duration-200 active:scale-[0.98]"
          data-testid="nav-rent-cta"
        >
          <FiPlusCircle size={16} />
          List item
        </button>

        <button
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="inline-flex items-center gap-2 px-2 py-1.5 md:pl-2 md:pr-3 rounded-full border border-ink-200 bg-white hover:border-ink-300 hover:shadow-softer transition-all duration-200 active:scale-[0.98]"
          data-testid="user-menu-toggle"
        >
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full hover:bg-ink/5">
            <AiOutlineMenu className="text-ink-600" size={16} />
          </span>
          <span className="hidden md:block">
            <Avatar src={user?.image} />
          </span>
          {user && (
            <span className="hidden md:block text-sm font-medium text-ink pr-1 max-w-[120px] truncate">
              {displayName}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-64 origin-top-right rounded-2xl bg-white border border-ink-100 shadow-lift overflow-hidden animate-fade-in-up"
          data-testid="user-menu-dropdown"
        >
          {user ? (
            <>
              <div className="px-4 py-3 bg-cream-100/60 border-b border-ink-100">
                <p className="text-xs uppercase tracking-wider text-ink-400 font-medium">
                  Signed in as
                </p>
                <p className="text-sm font-semibold text-ink truncate mt-0.5">
                  {user.emailId || user.email || displayName}
                </p>
              </div>
              <div className="py-1.5">
                <MenuItem
                  label="My Dashboard"
                  icon={<FiUser size={16} />}
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard");
                  }}
                />
                <MenuItem
                  label="Rental Bookings"
                  icon={<FiPackage size={16} />}
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/rental-bookings");
                  }}
                />
                <MenuItem
                  label="List your item"
                  icon={<FiPlusCircle size={16} />}
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/rent");
                  }}
                />
                <MenuItem
                  label="Change Password"
                  icon={<FiKey size={16} />}
                  onClick={() => {
                    setIsOpen(false);
                    setShowChangePassword(true);
                  }}
                />
                <div className="my-1 border-t border-ink-100" />
                <MenuItem
                  label="Logout"
                  icon={<FiLogOut size={16} />}
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  danger
                />
              </div>
            </>
          ) : (
            <div className="py-1.5">
              <MenuItem
                label="Login"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
              />
              <MenuItem
                label="Create an account"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/register");
                }}
              />
            </div>
          )}
        </div>
      )}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        email={user?.emailId || ""}
      />
    </div>
  );
};

export default UserMenu;
