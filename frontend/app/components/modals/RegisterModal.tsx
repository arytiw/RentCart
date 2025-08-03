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

    // Validation for text fields that should not start with numbers or contain special characters
    const textFields = ['username', 'firstName', 'lastName'];
    if (textFields.includes(name) && value.trim()) {
      const textRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
      if (!textRegex.test(value.trim())) {
        setErrorMessage(`${name} cannot start with a number, must contain alphabets, and no special characters allowed`);
        return; // Don't update the form data if validation fails
      }
    }

    // Validation for address fields
    if (name in formData.address && value.trim()) {
      const addressRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
      if (!addressRegex.test(value.trim())) {
        setErrorMessage(`Address field cannot start with a number, must contain alphabets, and no special characters allowed`);
        return; // Don't update the form data if validation fails
      }
    }

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

    // Validation
    if (!formData.username || !formData.emailId || !formData.password || !formData.phoneNumber || !formData.firstName || !formData.lastName || !formData.gender || !formData.dateOfBirth) {
      setErrorMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(formData.emailId)) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!validatePhone(formData.phoneNumber)) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
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

  const bodyContent = (
    <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto pr-2">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-alibaba-black mb-2">
          Join RentCart
        </h2>
        <p className="text-alibaba-gray-600 mb-4 text-base">
          Create your account to start renting
        </p>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shadow-lg">
          {errorMessage}
        </div>
      )}
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-xs font-medium text-gray-700">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="emailId" className="text-xs font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="emailId"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="phoneNumber" className="text-xs font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className="text-xs font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="lastName" className="text-xs font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="gender" className="text-xs font-medium text-gray-700">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isLoading}
              className="
                w-full
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="dateOfBirth" className="text-xs font-medium text-gray-700">
              Date of Birth *
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
                px-2
                py-1.5
                border
                border-gray-300
                rounded-md
                focus:outline-none
                focus:ring-2
                focus:ring-alibaba-orange
                focus:border-transparent
                disabled:opacity-70
                disabled:cursor-not-allowed
                text-sm
              "
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t pt-3">
          <h3 className="text-sm font-semibold mb-3">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["addressLine1", "addressLine2", "city", "state", "country", "postalCode"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={field} className="text-xs font-medium text-gray-700">
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
                    px-2
                    py-1.5
                    border
                    border-gray-300
                    rounded-md
                    focus:outline-none
                    focus:ring-2
                    focus:ring-alibaba-orange
                    focus:border-transparent
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    text-sm
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </form>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div 
        className="
          text-alibaba-gray-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Already have an account?
          <span 
            onClick={onToggle} 
            className="
              text-alibaba-black
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
      isAuthModal={true}
    />
  );
};

export default RegisterModal;
