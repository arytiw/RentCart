"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import { cn } from "@/app/lib/cn";

const fieldBase =
  "w-full bg-white border border-ink-200 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-400 outline-none transition-all duration-200 hover:border-ink-300 focus:border-brand focus:shadow-ring-brand disabled:opacity-60";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    emailId: "",
    password: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const textFields = ["username", "firstName", "lastName"];
    if (textFields.includes(name) && value.trim()) {
      const textRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
      if (!textRegex.test(value.trim())) {
        setErrorMessage(
          `${name} must start with a letter and contain no special characters`
        );
        return;
      }
    }

    if (name in formData.address && value.trim()) {
      const addressRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
      if (!addressRegex.test(value.trim())) {
        setErrorMessage(
          "Address fields must start with a letter and contain no special characters"
        );
        return;
      }
    }

    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errorMessage) setErrorMessage("");
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (
      !formData.username ||
      !formData.emailId ||
      !formData.password ||
      !formData.phoneNumber ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.gender ||
      !formData.dateOfBirth
    ) {
      setErrorMessage("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(formData.emailId)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!validatePhone(formData.phoneNumber)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        emailId: formData.emailId,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      };

      await axios.post("http://localhost:8081/auth/register", payload);
      toast.success("Account created. Please sign in!");
      setIsLoading(false);
      registerModal.onClose();
      setTimeout(() => loginModal.onOpen(), 100);
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.status === 409) {
        setErrorMessage("Email already registered.");
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data) {
        setErrorMessage(String(error.response.data));
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const Field = ({
    name,
    label,
    type = "text",
    options,
  }: {
    name: string;
    label: string;
    type?: string;
    options?: string[];
  }) => {
    const value = (formData as any)[name] ?? (formData.address as any)[name] ?? "";
    if (options) {
      return (
        <div>
          <label className="block text-xs font-semibold text-ink-500 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
          <select
            name={name}
            value={value}
            onChange={handleChange}
            disabled={isLoading}
            className={cn(fieldBase, "appearance-none")}
          >
            <option value="">Select…</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt[0] + opt.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <div>
        <label className="block text-xs font-semibold text-ink-500 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={isLoading}
          className={fieldBase}
          data-testid={`register-field-${name}`}
        />
      </div>
    );
  };

  const bodyContent = (
    <div className="flex flex-col gap-5 max-h-[55vh] overflow-y-auto pr-1" data-testid="register-modal-body">
      <p className="text-sm text-ink-500 -mt-3">
        A few quick details to get you started.
      </p>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      <div className="rounded-2xl border border-ink-100 bg-cream-100/40 p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">
          Personal
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field name="firstName" label="First name *" />
          <Field name="lastName" label="Last name *" />
          <Field name="username" label="Username *" />
          <Field name="emailId" label="Email *" type="email" />
          <Field name="password" label="Password *" type="password" />
          <Field name="phoneNumber" label="Phone *" type="tel" />
          <Field name="gender" label="Gender *" options={["MALE", "FEMALE", "OTHER"]} />
          <Field name="dateOfBirth" label="Date of birth *" type="date" />
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-cream-100/40 p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">
          Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ["addressLine1", "Address line 1"],
            ["addressLine2", "Address line 2"],
            ["city", "City"],
            ["state", "State"],
            ["country", "Country"],
            ["postalCode", "Postal code"],
          ].map(([n, l]) => (
            <Field key={n} name={n} label={l} />
          ))}
        </div>
      </div>
    </div>
  );

  const footerContent = (
    <p className="text-center text-sm text-ink-500 mt-4">
      Already have an account?{" "}
      <button
        onClick={onToggle}
        className="font-semibold text-brand hover:text-brand-600 transition-colors"
      >
        Sign in
      </button>
    </p>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Create your account"
      actionLabel={isLoading ? "Creating…" : "Continue"}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit}
      body={bodyContent}
      footer={footerContent}
      isAuthModal
    />
  );
};

export default RegisterModal;
