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
import Link from "next/link";

import { useUser } from '@/app/providers/UserProvider';
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
          router.push('/'); // Redirect to home page
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
                Welcome to the Future of Renting
              </h2>
              
              <p className="text-sm mb-6 leading-relaxed opacity-90">
                Join thousands of users who trust RentCart for their rental needs. 
                Quality items, instant booking, and secure transactions.
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaShieldAlt size={18} className="text-orange-200" />
                  <span className="text-left text-sm">100% Verified Items & Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock size={18} className="text-orange-200" />
                  <span className="text-left text-sm">24/7 Instant Booking Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUsers size={18} className="text-orange-200" />
                  <span className="text-left text-sm">Trusted Community of Renters</span>
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
                  Welcome back! Please enter your details.
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </h2>
              </div>

              {/* Login Form */}
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
                      <Link
                        href="/forgot-password"
                        className="text-orange-600 cursor-pointer text-sm hover:underline font-medium hover:text-orange-700 transition-colors duration-200"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <Button 
                      disabled={isLoading} 
                      label="Continue" 
                      onClick={() => {}} // Empty onClick since form handles submission
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
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
                    <Link 
                      href="/register"
                      className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
                    > 
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 