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

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const { setUser, setToken } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "", firstName: "", lastName: "",
      emailId: "", password: "", confirmPassword: "",
      phoneNumber: "", gender: "", dateOfBirth: "",
      addressLine1: "", addressLine2: "", city: "", state: "", country: "", postalCode: "",
    },
  });

  // ---------- validators (preserved from original) ----------
  const v = {
    username: (val: string) =>
      !val?.trim() ? "Username is required"
      : val.length < 3 ? "Username must be at least 3 characters"
      : val.length > 50 ? "Username must be less than 50 characters"
      : !/^[A-Za-z0-9_]+$/.test(val) ? "Only letters, numbers, and underscores"
      : null,
    firstName: (val: string) =>
      !val?.trim() ? "First name is required"
      : !/^[A-Za-z][A-Za-z\s]*$/.test(val) ? "Only letters and spaces"
      : val.length > 50 ? "Must be less than 50 characters"
      : null,
    lastName: (val: string) =>
      val?.trim() && !/^[A-Za-z][A-Za-z ]{0,29}$/.test(val) ? "Up to 30 letters/spaces" : null,
    emailId: (val: string) =>
      !val?.trim() ? "Email is required"
      : !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val) ? "Enter a valid email"
      : null,
    password: (val: string) =>
      !val ? "Password is required"
      : val.length < 8 ? "At least 8 characters"
      : !/(?=.*[a-z])/.test(val) ? "Add a lowercase letter"
      : !/(?=.*[A-Z])/.test(val) ? "Add an uppercase letter"
      : !/(?=.*\d)/.test(val) ? "Add a number"
      : null,
    phoneNumber: (val: string) =>
      val?.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/\s/g, "")) ? "Enter a valid phone" : null,
    gender: (val: string) =>
      val && !["Male", "Female", "Other"].includes(val) ? "Choose Male, Female, or Other" : null,
    dateOfBirth: (val: string) => {
      if (!val) return null;
      const today = new Date(), bd = new Date(val);
      const age = today.getFullYear() - bd.getFullYear();
      if (bd > today) return "Date can't be in the future";
      if (age < 13) return "You must be at least 13";
      if (age > 120) return "Enter a valid DOB";
      return null;
    },
  } as const;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setFieldErrors({});
    const errs: { [k: string]: string } = {};

    (Object.keys(v) as (keyof typeof v)[]).forEach((k) => {
      const e = v[k](data[k] as string);
      if (e) errs[k] = e;
    });
    if (data.password !== data.confirmPassword) errs.confirmPassword = "Passwords don't match";

    const hasAddress = data.addressLine1 || data.addressLine2 || data.city || data.state || data.country || data.postalCode;
    if (hasAddress) {
      ["addressLine1", "addressLine2", "city", "state", "country", "postalCode"].forEach((f) => {
        if (!data[f]?.trim()) errs[f] = "Required when adding address";
      });
    }

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setIsLoading(false);
      toast.error("Please fix the errors below");
      return;
    }

    const payload: any = {
      username: data.username, firstName: data.firstName, lastName: data.lastName || "",
      emailId: data.emailId, password: data.password,
      phoneNumber: data.phoneNumber || "", gender: data.gender || "", dateOfBirth: data.dateOfBirth || "",
    };
    if (hasAddress) {
      payload.address = {
        addressLine1: data.addressLine1 || "", addressLine2: data.addressLine2 || "",
        city: data.city || "", state: data.state || "",
        country: data.country || "", postalCode: data.postalCode || "",
      };
    }

    try {
      const url = buildUrl("AUTH_SERVICE", API_CONFIG.ENDPOINTS.REGISTER);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setIsLoading(false);

      if (response.ok) {
        const ct = response.headers.get("content-type");
        let token;
        if (ct && ct.includes("application/json")) {
          const j = await response.json(); token = j.token || j;
        } else token = await response.text();

        if (token) {
          setToken(token);
          const fullUser = await getCurrentUser(token);
          setUser(fullUser);
          toast.success("Account created!");
          router.refresh();
          router.push("/");
        } else toast.error("Invalid response from server");
      } else {
        try {
          const errData = await response.json();
          if (errData.fieldErrors) {
            Object.entries(errData.fieldErrors).forEach(([field, message]) =>
              setFieldErrors((p) => ({ ...p, [field]: message as string }))
            );
            toast.error("Please fix the errors below");
          } else {
            toast.error(errData.message || "Registration failed.");
          }
        } catch {
          toast.error("Registration failed.");
        }
      }
    } catch {
      setIsLoading(false);
      toast.error("Network error. Try again.");
    }
  };

  const ErrLine: React.FC<{ name: string }> = ({ name }) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors[name]}</p>
    ) : null;

  return (
    <div className="min-h-[88vh] -mt-16 grid lg:grid-cols-2 bg-cream" data-testid="register-page">
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
            Start <span className="text-brand">renting.</span>
            <br /> Start earning.
          </h1>
          <p className="mt-4 text-ink-300 max-w-sm leading-relaxed">
            Join thousands of users on India's premium rental marketplace.
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
        </div>
      </aside>

      {/* Right form */}
      <main className="flex items-start lg:items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl">
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
            New here
          </p>
          <h2 className="font-display font-semibold text-3xl text-ink tracking-tighter2">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            A few details to get started.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" data-testid="register-page-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Input id="firstName" label="First name *" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="firstName" /></div>
              <div><Input id="lastName" label="Last name" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="lastName" /></div>
            </div>
            <div><Input id="username" label="Username *" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="username" /></div>
            <div><Input id="emailId" label="Email *" type="email" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="emailId" /></div>
            <div><Input id="phoneNumber" label="Phone" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="phoneNumber" /></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-500 mb-1.5 uppercase tracking-wider">Gender</label>
                <select
                  {...register("gender")}
                  disabled={isLoading}
                  className="w-full bg-white border border-ink-200 rounded-xl px-3.5 py-3 text-sm text-ink outline-none transition-all duration-200 hover:border-ink-300 focus:border-brand focus:shadow-ring-brand appearance-none"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ErrLine name="gender" />
              </div>
              <div><Input id="dateOfBirth" label="Date of birth" type="date" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="dateOfBirth" /></div>
            </div>

            <div><Input id="password" label="Password *" type="password" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="password" /></div>
            <div><Input id="confirmPassword" label="Confirm password *" type="password" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="confirmPassword" /></div>

            <details className="rounded-2xl border border-ink-100 bg-cream-100/40 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink-700 select-none">
                Add address <span className="text-ink-400 font-normal">(optional)</span>
              </summary>
              <div className="mt-4 space-y-4">
                <div><Input id="addressLine1" label="Address line 1" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="addressLine1" /></div>
                <div><Input id="addressLine2" label="Address line 2" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="addressLine2" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Input id="city" label="City" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="city" /></div>
                  <div><Input id="state" label="State" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="state" /></div>
                  <div><Input id="country" label="Country" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="country" /></div>
                  <div><Input id="postalCode" label="Postal code" disabled={isLoading} register={register} errors={errors} required noValidation /><ErrLine name="postalCode" /></div>
                </div>
              </div>
            </details>

            <div className="pt-1">
              <Button disabled={isLoading} label={isLoading ? "Creating…" : "Create account"} type="submit" onClick={() => {}} data-testid="register-page-submit" />
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
            <button onClick={() => toast("Google sign-in coming soon!")} className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 hover:border-ink hover:bg-cream-200 text-sm font-medium text-ink transition-all">
              <FcGoogle size={18} /> Google
            </button>
            <button onClick={() => toast("GitHub sign-in coming soon!")} className="inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-ink-200 hover:border-ink hover:bg-cream-200 text-sm font-medium text-ink transition-all">
              <AiFillGithub size={18} /> GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand hover:text-brand-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
