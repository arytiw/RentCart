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

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const { setUser, setToken } = useUser();

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
  });

  // Clear field errors when user starts typing
  const clearFieldError = (fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Validation functions
  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (username.length > 50) {
      return "Username must be less than 50 characters";
    }
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const validateFirstName = (firstName: string): string | null => {
    if (!firstName.trim()) {
      return "First name is required";
    }
    if (!/^[A-Za-z][A-Za-z\s]*$/.test(firstName)) {
      return "First name must contain only letters and spaces, and start with a letter";
    }
    if (firstName.length > 50) {
      return "First name must be less than 50 characters";
    }
    return null;
  };

  const validateLastName = (lastName: string): string | null => {
    if (lastName.trim()) {
      if (!/^[A-Za-z][A-Za-z ]{0,29}$/.test(lastName)) {
        return "Last name must be up to 30 characters, only letters and spaces, and start with a letter";
      }
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 100) {
      return "Password must be less than 100 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validatePhoneNumber = (phoneNumber: string): string | null => {
    if (phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        return "Please enter a valid phone number";
      }
    }
    return null;
  };

  const validateGender = (gender: string): string | null => {
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return "Gender must be Male, Female, or Other";
    }
    return null;
  };

  const validateDateOfBirth = (dateOfBirth: string): string | null => {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        return "Date of birth cannot be in the future";
      }
      if (age < 13) {
        return "You must be at least 13 years old to register";
      }
      if (age > 120) {
        return "Please enter a valid date of birth";
      }
    }
    return null;
  };

  const validateAddress = (addressData: any): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};
    const hasAnyAddressInfo = addressData.addressLine1 || addressData.addressLine2 || 
                             addressData.city || addressData.state || 
                             addressData.country || addressData.postalCode;

    if (hasAnyAddressInfo) {
      // If user provides any address info, validate all required fields
      if (!addressData.addressLine1?.trim()) {
        errors.addressLine1 = "Address Line 1 is required when providing address information";
      }
      if (!addressData.addressLine2?.trim()) {
        errors.addressLine2 = "Address Line 2 is required when providing address information";
      }
      if (!addressData.city?.trim()) {
        errors.city = "City is required when providing address information";
      }
      if (!addressData.state?.trim()) {
        errors.state = "State is required when providing address information";
      }
      if (!addressData.country?.trim()) {
        errors.country = "Country is required when providing address information";
      }
      if (!addressData.postalCode?.trim()) {
        errors.postalCode = "Postal Code is required when providing address information";
      }
    }

    return errors;
  };
  
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setFieldErrors({});

    // Validate all fields
    const errors: {[key: string]: string} = {};

    // Username validation
    const usernameError = validateUsername(data.username);
    if (usernameError) errors.username = usernameError;

    // First name validation
    const firstNameError = validateFirstName(data.firstName);
    if (firstNameError) errors.firstName = firstNameError;

    // Last name validation
    const lastNameError = validateLastName(data.lastName);
    if (lastNameError) errors.lastName = lastNameError;

    // Email validation
    const emailError = validateEmail(data.emailId);
    if (emailError) errors.emailId = emailError;

    // Password validation
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Phone number validation
    const phoneError = validatePhoneNumber(data.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    // Gender validation
    const genderError = validateGender(data.gender);
    if (genderError) errors.gender = genderError;

    // Date of birth validation
    const dobError = validateDateOfBirth(data.dateOfBirth);
    if (dobError) errors.dateOfBirth = dobError;

    // Address validation
    const addressErrors = validateAddress(data);
    Object.assign(errors, addressErrors);

    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      toast.error('Please fix the errors in the form');
      return;
    }

    // Build payload
    const payload: any = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName || '',
      emailId: data.emailId,
      password: data.password,
      phoneNumber: data.phoneNumber || '',
      gender: data.gender || '',
      dateOfBirth: data.dateOfBirth || ''
    };

    // Only include address if user provided address information
    const hasAddressInfo = data.addressLine1 || data.addressLine2 || data.city || data.state || data.country || data.postalCode;
    if (hasAddressInfo) {
      payload.address = {
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        postalCode: data.postalCode || ''
      };
    }

    try {
      const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.REGISTER);
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
          toast.success('Account created successfully!');
          router.refresh();
          router.push('/'); // Redirect to home page
        } else {
          toast.error('Invalid response from server');
        }
      } else {
        try {
          const errorData = await response.json();

          if (errorData.fieldErrors) {
            Object.entries(errorData.fieldErrors).forEach(([field, message]) => {
              setFieldErrors(prev => ({ ...prev, [field as string]: message as string }));
            });
            toast.error('Please fix the errors in the form');
          } else {
            toast.error(errorData.message || "Registration failed.");
          }
        } catch (parseError) {
          // If JSON parsing fails, fall back to text response
          const errorText = await response.text();
          toast.error(`Registration failed: ${errorText}`);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      toast.error('Enter Unique Email Id.');
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
                Join the Future of Renting
              </h2>
              
              <p className="text-sm mb-6 leading-relaxed opacity-90">
                Create your account and start exploring thousands of quality items. 
                Join our trusted community of renters and item owners.
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
                  Create your account to get started.
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Account
                </h2>
              </div>

              {/* Register Form */}
              <div className="flex flex-col gap-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          id="firstName"
                          label="First Name *"
                          disabled={isLoading}
                          register={register}  
                          errors={errors}
                          required
                          noValidation={true}
                        />
                        {fieldErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          id="lastName"
                          label="Last Name"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          noValidation={true}
                        />
                        {fieldErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Input
                        id="username"
                        label="Username *"
                        disabled={isLoading}
                        register={register}  
                        errors={errors}
                        required
                        noValidation={true}
                      />
                      {fieldErrors.username && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        id="emailId"
                        label="Email *"
                        type="email"
                        disabled={isLoading}
                        register={register}  
                        errors={errors}
                        required
                        noValidation={true}
                      />
                      {fieldErrors.emailId && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.emailId}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        id="phoneNumber"
                        label="Phone Number"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        noValidation={true}
                      />
                      {fieldErrors.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          {...register('gender')}
                          disabled={isLoading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {fieldErrors.gender && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>
                        )}
                      </div>
                      
                      <div>
                        <Input
                          id="dateOfBirth"
                          label="Date of Birth"
                          type="date"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          noValidation={true}
                        />
                        {fieldErrors.dateOfBirth && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.dateOfBirth}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Input
                        id="password"
                        label="Password *"
                        type="password"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        noValidation={true}
                      />
                      {fieldErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        id="confirmPassword"
                        label="Confirm Password *"
                        type="password"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        noValidation={true}
                      />
                      {fieldErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                    
                    {/* Address Section - Optional */}
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information (Optional)</h3>
                      
                      <div>
                        <Input
                          id="addressLine1"
                          label="Address Line 1"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          noValidation={true}
                        />
                        {fieldErrors.addressLine1 && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.addressLine1}</p>
                        )}
                      </div>
                      
                      <div>
                        <Input
                          id="addressLine2"
                          label="Address Line 2"
                          disabled={isLoading}
                          register={register}
                          errors={errors}
                          required
                          noValidation={true}
                        />
                        {fieldErrors.addressLine2 && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.addressLine2}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            id="city"
                            label="City"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            noValidation={true}
                          />
                          {fieldErrors.city && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <Input
                            id="state"
                            label="State"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            noValidation={true}
                          />
                          {fieldErrors.state && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            id="country"
                            label="Country"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            noValidation={true}
                          />
                          {fieldErrors.country && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.country}</p>
                          )}
                        </div>
                        
                        <div>
                          <Input
                            id="postalCode"
                            label="Postal Code"
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            noValidation={true}
                          />
                          {fieldErrors.postalCode && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.postalCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Continue Button */}
                  <div className="pt-4">
                    <Button 
                      disabled={isLoading} 
                      label="Create Account" 
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
                    onClick={() => toast.error('Google sign-in coming soon!')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
                  >
                    <FcGoogle size={20} />
                    Continue with Google
                  </button>
                  <button 
                    onClick={() => toast.error('Github sign-in coming soon!')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
                  >
                    <AiFillGithub size={20} />
                    Continue with Github
                  </button>
                </div>
                
                <div className="text-gray-500 text-center mt-4 font-medium">
                  <p className="text-sm">Already have an account?
                    <Link 
                      href="/login"
                      className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
                    > 
                      Sign in
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

export default RegisterPage; 