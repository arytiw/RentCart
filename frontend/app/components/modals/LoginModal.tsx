// @ts-nocheck
'use client';

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { FaShoppingCart, FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useUser } from '@/app/providers/UserProvider';
import ForgotPasswordModal from './ForgotPasswordModal';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, API_CONFIG } from "@/app/config/api";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
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
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });
  
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    // Try both emailId and username for login, fallback to emailId
    const payload = {
      emailId: data.email,
      password: data.password
    };

    try {
      const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.LOGIN);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      setIsLoading(false);
      
      if (response.ok) {
        // Handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        let token;
        
        if (contentType && contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          token = jsonResponse.token || jsonResponse;
        } else {
          token = await response.text();
        }
        
        if (token) {
          setToken(token);
          // Fetch the full user profile
          const fullUser = await getCurrentUser(token);
          setUser(fullUser);
          toast.success('Logged in successfully');
          router.refresh();
          loginModal.onClose();
        } else {
          toast.error('Invalid response from server');
        }
      } else if (response.status === 401) {
        toast.error('Invalid credentials');
      } else {
        const errorText = await response.text();
        toast.error(`Login failed: ${errorText}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      toast.error('Login failed. Please check your connection.');
    }
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-base">
          Sign in to your RentCart account
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Input
            id="email"
            label="Email"
            disabled={isLoading}
            register={register}  
            errors={errors}
            required
            noValidation={true}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            noValidation={true}
          />
          <div className="text-right">
            <span
              className="text-orange-600 cursor-pointer text-sm hover:underline font-medium hover:text-orange-700 transition-colors duration-200"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </span>
          </div>
        </div>
        
        {/* Continue Button - Now properly positioned */}
        <div className="pt-4">
          <Button 
            disabled={isLoading} 
            label="Continue" 
            onClick={() => {}} // Empty onClick since form handles submission
          />
        </div>
      </form>
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={() => toast.info('Google sign-in coming soon!')}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
        <button 
          onClick={() => toast.info('Github sign-in coming soon!')}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
        >
          <AiFillGithub size={20} />
          Continue with Github
        </button>
      </div>
      
      <div className="text-gray-500 text-center mt-4 font-medium">
        <p className="text-sm">First time using RentCart?
          <span 
            onClick={onToggle} 
            className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
          > Create an account</span>
        </p>
      </div>
    </div>
  )

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        title="Welcome Back"
        actionLabel="" // Remove actionLabel to prevent duplicate button
        onClose={loginModal.onClose}
        onSubmit={() => {}} // Empty onSubmit since form handles submission
        body={bodyContent}
        footer={footerContent}
        isAuthModal={true}
      />
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
}

export default LoginModal;
