// @ts-nocheck
"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useUser } from "@/app/providers/UserProvider";
import ForgotPasswordModal from "./ForgotPasswordModal";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, API_CONFIG } from "@/app/config/api";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Button from "../Button";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useUser();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const payload = { emailId: data.email, password: data.password };

    try {
      const url = buildUrl("AUTH_SERVICE", API_CONFIG.ENDPOINTS.LOGIN);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setIsLoading(false);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        let token;
        if (contentType && contentType.includes("application/json")) {
          const jsonResponse = await response.json();
          token = jsonResponse.token || jsonResponse;
        } else {
          token = await response.text();
        }
        if (token) {
          setToken(token);
          const fullUser = await getCurrentUser(token);
          setUser(fullUser);
          toast.success("Welcome back!");
          router.refresh();
          loginModal.onClose();
        } else {
          toast.error("Invalid response from server");
        }
      } else if (response.status === 401) {
        toast.error("Invalid credentials");
      } else {
        const errorText = await response.text();
        toast.error(`Login failed: ${errorText}`);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Login failed. Please check your connection.");
    }
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-5" data-testid="login-modal-body">
      <p className="text-sm text-ink-500 -mt-3">
        Sign in to your account to continue renting and listing.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          noValidation
        />
        <Input
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          noValidation
        />

        <div className="text-right">
          <button
            type="button"
            className="text-sm font-semibold text-brand hover:text-brand-600 transition-colors"
            onClick={() => setShowForgotPassword(true)}
            data-testid="login-forgot-password"
          >
            Forgot password?
          </button>
        </div>

        <div className="pt-2">
          <Button
            disabled={isLoading}
            label={isLoading ? "Signing in…" : "Sign in"}
            type="submit"
            onClick={() => {}}
            data-testid="login-submit"
          />
        </div>
      </form>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-ink-400 uppercase tracking-widest font-semibold">
            or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => toast("Google sign-in coming soon!")}
          className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 hover:border-ink hover:bg-cream-200 text-sm font-medium text-ink transition-all"
        >
          <FcGoogle size={18} />
          Google
        </button>
        <button
          onClick={() => toast("GitHub sign-in coming soon!")}
          className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 hover:border-ink hover:bg-cream-200 text-sm font-medium text-ink transition-all"
        >
          <AiFillGithub size={18} />
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-ink-500 mt-2">
        First time using RentCart?{" "}
        <button
          onClick={onToggle}
          className="font-semibold text-brand hover:text-brand-600 transition-colors"
          data-testid="login-switch-to-register"
        >
          Create an account
        </button>
      </p>
    </div>
  );

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        title="Welcome back"
        actionLabel=""
        onClose={loginModal.onClose}
        onSubmit={() => {}}
        body={bodyContent}
        footer={footerContent}
        isAuthModal
      />
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginModal;
