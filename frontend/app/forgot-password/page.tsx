'use client';

import { useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { FaShoppingCart, FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { buildUrl, API_CONFIG } from "@/app/config/api";

import Input from "../components/inputs/Input";
import Button from "../components/Button";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      email: ''
    },
  });
  
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const payload = {
      email: data.email
    };

    try {
      const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.FORGOT_PASSWORD);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      setIsLoading(false);
      
      if (response.ok) {
        setEmailSent(true);
        toast.success('Password reset email sent successfully!');
      } else {
        const errorText = await response.text();
        toast.error(`Failed to send reset email: ${errorText}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset email. Please check your connection.');
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <FaShoppingCart size={28} className="text-orange-500" />
                <h1 className="text-xl font-bold text-gray-900">RentCart</h1>
              </div>
              
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 text-sm">
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                >
                  Back to Login
                </Link>
                <p className="text-gray-500 text-sm">
                  Didn't receive the email? 
                  <button 
                    onClick={() => setEmailSent(false)}
                    className="text-orange-600 hover:text-orange-700 ml-1 font-medium hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
          
          {/* Left Side - RentCart Information */}
          <div className="
            hidden
            lg:flex
            lg:w-1/2
            bg-gradient-to-br from-orange-500 to-orange-600
            flex-col
            justify-center
            items-center
            text-white
            p-8
            relative
            overflow-hidden
          ">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-12 left-12 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-20 right-12 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center max-w-sm">
              <div className="flex items-center justify-center gap-3 mb-6">
                <FaShoppingCart size={36} className="text-white" />
                <h1 className="text-3xl font-bold">RentCart</h1>
              </div>
              
              <h2 className="text-xl font-bold mb-4">
                Reset Your Password
              </h2>
              
              <p className="text-sm mb-6 leading-relaxed opacity-90">
                Don't worry! It happens to the best of us. Enter your email address 
                and we'll send you a link to reset your password.
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaShieldAlt size={18} className="text-orange-200" />
                  <span className="text-left text-sm">Secure Password Reset Process</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock size={18} className="text-orange-200" />
                  <span className="text-left text-sm">Quick Email Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUsers size={18} className="text-orange-200" />
                  <span className="text-left text-sm">24/7 Support Available</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-xs opacity-80">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-xs opacity-80">Items Rented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-xs opacity-80">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="
            w-full
            lg:w-1/2
            flex
            flex-col
            justify-center
            p-6
            lg:p-8
            relative
            max-h-full
            overflow-y-auto
          ">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <FaShoppingCart size={28} className="text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">RentCart</h1>
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Enter your email to reset your password.
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Forgot Password
                </h2>
              </div>

              {/* Forgot Password Form */}
              <div className="flex flex-col gap-6">
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
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      disabled={isLoading} 
                      label="Send Reset Link" 
                      onClick={() => {}} // Empty onClick since form handles submission
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="text-gray-500 text-center mt-6 font-medium">
                <p className="text-sm">Remember your password?
                  <Link 
                    href="/login"
                    className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
                  > 
                    Back to login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 