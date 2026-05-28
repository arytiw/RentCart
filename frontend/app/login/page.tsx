"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUser } from "@/app/providers/UserProvider";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, API_CONFIG } from "@/app/config/api";

import Input from "../components/inputs/Input";
import Button from "../components/Button";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useUser();

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
          router.push("/");
        } else {
          toast.error("Invalid response from server");
        }
      } else if (response.status === 401) {
        toast.error("Invalid credentials");
      } else {
        const errorText = await response.text();
        toast.error(`Login failed: ${errorText}`);
      }
    } catch {
      setIsLoading(false);
      toast.error("Login failed. Please check your connection.");
    }
  };

  return (
    <div className="min-h-[88vh] -mt-16 grid lg:grid-cols-2 bg-cream" data-testid="login-page">
      {/* Left brand panel */}
      <aside className="hidden lg:flex relative bg-ink text-white p-12 overflow-hidden">
        <div className="absolute inset-0 bg-radial-brand" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-brand/25 blur-3xl" />
        <div className="absolute top-1/4 -left-12 h-44 w-44 rounded-full bg-brand/10 blur-2xl" />

        <div className="relative max-w-md self-center">
          <div className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
                <path d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.55h8.2a2 2 0 0 0 1.96-1.6L21 8H6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="20" r="1.4" fill="currentColor" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display font-bold text-2xl tracking-tighter2">
              Rent<span className="text-brand">Cart</span>
            </span>
          </div>

          <h1 className="font-display font-semibold text-5xl tracking-tightest leading-[0.95] mt-14">
            Rent <span className="text-brand">anything.</span>
            <br /> Anytime.
          </h1>
          <p className="mt-4 text-ink-300 max-w-sm leading-relaxed">
            Premium peer-to-peer rentals. Verified items, instant booking, and a community you can trust.
          </p>

          <ul className="mt-10 space-y-3 text-sm">
            <li className="flex items-center gap-3 text-ink-200">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <FaShieldAlt size={12} className="text-brand" />
              </span>
              Verified items & secure payments
            </li>
            <li className="flex items-center gap-3 text-ink-200">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <FaClock size={12} className="text-brand" />
              </span>
              24/7 instant booking
            </li>
            <li className="flex items-center gap-3 text-ink-200">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10">
                <FaUsers size={12} className="text-brand" />
              </span>
              Trusted community of renters
            </li>
          </ul>

          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            {[
              ["10K+", "Happy users"],
              ["50K+", "Items rented"],
              ["99%", "Satisfaction"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display font-bold text-2xl text-white">{v}</div>
                <div className="text-[11px] uppercase tracking-wider text-ink-400 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right form */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.55h8.2a2 2 0 0 0 1.96-1.6L21 8H6"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="font-display font-bold text-lg text-ink">
              Rent<span className="text-brand">Cart</span>
            </span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-2">
            Account
          </p>
          <h2 className="font-display font-semibold text-3xl text-ink tracking-tighter2">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Sign in to continue with RentCart.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required noValidation />
            <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required noValidation />

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm font-semibold text-brand hover:text-brand-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            <div className="pt-1">
              <Button disabled={isLoading} label={isLoading ? "Signing in…" : "Sign in"} type="submit" onClick={() => {}} data-testid="login-page-submit" />
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-cream text-[11px] text-ink-400 uppercase tracking-widest font-semibold">
                or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toast("Google sign-in coming soon!")}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 hover:border-ink hover:bg-cream-200 text-sm font-medium text-ink transition-all"
            >
              <FcGoogle size={18} /> Google
            </button>
            <button
              onClick={() => toast("GitHub sign-in coming soon!")}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 hover:border-ink hover:bg-cream-200 text-sm font-medium text-ink transition-all"
            >
              <AiFillGithub size={18} /> GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500">
            First time on RentCart?{" "}
            <Link href="/register" className="font-semibold text-brand hover:text-brand-600 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
