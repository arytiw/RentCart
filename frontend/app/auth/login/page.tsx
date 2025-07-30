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
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUser } from '@/app/providers/UserProvider';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { buildUrl, API_CONFIG } from "@/app/config/api";

import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";
import Container from "@/app/components/Container";

const LoginPage = () => {
  const router = useRouter();
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
          const fullUser = await getCurrentUser(token);
          setUser(fullUser);
          toast.success('Logged in successfully');
          router.push('/');
          router.refresh();
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
    <Container>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
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
                  <Link
                    href="/auth/forgot-password"
                    className="text-orange-600 cursor-pointer text-sm hover:underline font-medium hover:text-orange-700 transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  disabled={isLoading} 
                  label="Continue" 
                  onClick={() => {}}
                />
              </div>
            </form>

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
                  type="button"
                  onClick={() => toast('Google sign-in coming soon!', { icon: 'ℹ️' })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
                >
                  <FcGoogle size={20} />
                  Continue with Google
                </button>
                <button 
                  type="button"
                  onClick={() => toast('Github sign-in coming soon!', { icon: 'ℹ️' })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
                >
                  <AiFillGithub size={20} />
                  Continue with Github
                </button>
              </div>
              
              <div className="text-gray-500 text-center mt-4 font-medium">
                <p className="text-sm">First time using RentCart?
                  <Link 
                    href="/auth/register"
                    className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
                  > Create an account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
