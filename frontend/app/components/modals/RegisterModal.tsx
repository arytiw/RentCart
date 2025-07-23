'use client';

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Heading from "../Heading";

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
      postalCode: ""
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    // Validate required fields
    const requiredFields = ["username", "emailId", "password", "phoneNumber", "firstName"];
    for (const field of requiredFields) {
      if (!formData[field as keyof Omit<typeof formData, 'address'>]) {
        setErrorMessage(`Please fill in ${field === "emailId" ? "email" : field}.`);
        setIsLoading(false);
        return;
      }
    }

    if (!validateEmail(formData.emailId)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!validatePhone(formData.phoneNumber)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
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
        address: formData.address
      };

      console.log("Sending registration payload:", payload);
      
      const response = await axios.post('http://localhost:8081/auth/register', payload);
      console.log("Registration response:", response);
      
      toast.success('Registration successful! Please login.');
      setIsLoading(false);
      registerModal.onClose();
      // Small delay to ensure modal closes before opening login
      setTimeout(() => {
        loginModal.onOpen();
      }, 100);
    } catch (error: any) {
      console.error("Registration Error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      setIsLoading(false);
      
      if (error.response && error.response.status === 409) {
        setErrorMessage('Email already registered.');
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else if (error.message) {
        setErrorMessage(`Network error: ${error.message}`);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
      
      // Force re-render to show error message
      setTimeout(() => {
        setErrorMessage(prev => prev);
      }, 100);
    }
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const requiredFields = [
    "username",
    "emailId",
    "password",
    "phoneNumber",
    "firstName"
  ];

  const bodyContent = (
    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
      <Heading
        title="Welcome to RentCart"
        subtitle="Create an account!"
      />
      {errorMessage && (
        <div className="text-red-500 text-sm mb-2 p-3 bg-red-50 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Main fields */}
        {[
          "username",
          "emailId",
          "password",
          "phoneNumber",
          "firstName",
          "lastName"
        ].map((field) => (
          <div key={field} className="flex flex-col gap-2">
            <label htmlFor={field} className="text-sm font-medium text-gray-700">
              {field === "emailId" ? "Email" : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              name={field}
              value={formData[field as keyof Omit<typeof formData, 'address'>]}
              onChange={handleChange}
              required={requiredFields.includes(field)}
              pattern={field === "phoneNumber" ? "\\d{10}" : undefined}
              maxLength={field === "phoneNumber" ? 10 : undefined}
              title={field === "phoneNumber" ? "Phone number must be exactly 10 digits" : ""}
              disabled={isLoading}
              className="
                w-full
                px-3
                py-2
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-rose-500
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            />
          </div>
        ))}

        {/* Gender dropdown */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isLoading}
            className="
              w-full
              px-3
              py-2
              border
              border-gray-300
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-rose-500
              focus:border-transparent
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of birth */}
        <div className="flex flex-col gap-2">
          <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={isLoading}
            className="
              w-full
              px-3
              py-2
              border
              border-gray-300
              rounded-md
              focus:outline-none
              focus:ring-2
              focus:ring-rose-500
              focus:border-transparent
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Address fields */}
        {["addressLine1", "addressLine2", "city", "state", "country", "postalCode"].map((field) => (
          <div key={field} className="flex flex-col gap-2">
            <label htmlFor={field} className="text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData.address[field as keyof typeof formData.address]}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-3
                py-2
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-rose-500
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            />
          </div>
        ))}
      </form>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Already have an account?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Log in</span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
