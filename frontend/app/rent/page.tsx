'use client';

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaShoppingCart, FaUpload, FaMapMarkerAlt, FaTag, FaInfoCircle, FaImages, FaEdit, FaStar, FaRupeeSign, FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";
import Link from "next/link";

import { useUser } from '@/app/providers/UserProvider';

import Counter from "../components/inputs/Counter";
import CategoryInput from "../components/inputs/CategoryInput";
import { categories } from "../components/navbar/Categories";
import ImageUpload from "../components/inputs/ImageUpload";
import Input from "../components/inputs/Input";
import ValidatedInput from "../components/inputs/ValidatedInput";
import Heading from "../components/Heading";
import Button from "../components/Button";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  FEATURES = 5,
}

const RentPage = () => {
  const router = useRouter();
  const { token, user: currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: "",
      itemCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
      securityDeposit: 0,
      usagePolicy: "",
      type: "RENT"
    },
  });

  const location = watch("location");
  const category = watch("category");
  const itemCount = watch("itemCount");
  const imageSrc = watch("imageSrc");
  const type = watch("type");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Function to check if current step has validation errors
  const hasCurrentStepErrors = () => {
    const currentLocation = watch("location");
    const currentTitle = watch("title");
    const currentDescription = watch("description");
    const currentUsagePolicy = watch("usagePolicy");
    const currentImageSrc = watch("imageSrc");
    const currentCategory = watch("category");
    const currentPrice = watch("price");

    switch (step) {
      case STEPS.CATEGORY:
        return !currentCategory || currentCategory.trim() === "";
      case STEPS.LOCATION:
        return !currentLocation || currentLocation.trim() === "";
      case STEPS.INFO:
        return !currentTitle || currentTitle.trim() === "" || currentPrice <= 0;
      case STEPS.IMAGES:
        return !currentImageSrc || currentImageSrc.trim() === "";
      case STEPS.DESCRIPTION:
        return !currentDescription || currentDescription.trim() === "";
      default:
        return false;
    }
  };

  const onBack = () => {
    if (step > 0) {
      setStep((value) => value - 1);
    } else {
      // If on first step, navigate back to dashboard or home
      router.push('/dashboard');
    }
  };

  const onNext = () => {
    if (hasCurrentStepErrors()) {
      setHasValidationErrors(true);
      toast.error("Please fill in all required fields");
      return;
    }
    setHasValidationErrors(false);
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.FEATURES) {
      return onNext();
    }

    if (hasCurrentStepErrors()) {
      setHasValidationErrors(true);
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const formData = {
      ...data,
      images: data.imageSrc ? [data.imageSrc] : [],
      features,
      type: "RENT"
    };

    console.log('Submitting rent form:', formData);

    axios.post('/api/items', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(() => {
      toast.success('Item listed successfully!');
      router.push('/dashboard');
    })
    .catch((error) => {
      console.error('Error creating item:', error);
      toast.error(error.response?.data?.error || 'Something went wrong');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const actionLabel = step === STEPS.FEATURES ? 'Create Listing' : 'Next';
  const secondaryActionLabel = step === STEPS.CATEGORY ? undefined : 'Back';

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const bodyContent = (
    <div className="flex flex-col gap-8">
      {step === STEPS.CATEGORY && (
        <div className="flex flex-col gap-8">
          <Heading
            title="Which of these best describes your item?"
            subtitle="Pick a category"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {categories.map((item) => (
              <div key={item.label} className="col-span-1">
                <CategoryInput
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === STEPS.LOCATION && (
        <div className="flex flex-col gap-8">
          <Heading
            title="Where is your item located?"
            subtitle="Help renters find your item"
          />
          <Input
            id="location"
            label="Location"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            placeholder="Enter your location (e.g., Mumbai, Maharashtra)"
          />
        </div>
      )}

      {step === STEPS.INFO && (
        <div className="flex flex-col gap-8">
          <Heading
            title="Share some basic information about your item"
            subtitle="What amenities do you have?"
          />
          <ValidatedInput
            id="title"
            label="Title"
            disabled={isLoading}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            required
          />
          <Counter
            onChange={(value) => setCustomValue('itemCount', value)}
            value={itemCount}
            title="How many items do you have?"
            subtitle="How many items are available?"
          />
          <ValidatedInput
            id="price"
            label="Price"
            formatPrice
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            required
          />
          <ValidatedInput
            id="securityDeposit"
            label="Security Deposit"
            formatPrice
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            required
          />
        </div>
      )}

      {step === STEPS.IMAGES && (
        <div className="flex flex-col gap-8">
          <Heading
            title="Add a photo of your item"
            subtitle="Show renters what your item looks like!"
          />
          <ImageUpload
            onChange={(value) => setCustomValue('imageSrc', value)}
            value={imageSrc}
          />
        </div>
      )}

      {step === STEPS.DESCRIPTION && (
        <div className="flex flex-col gap-8">
          <Heading
            title="How would you describe your item?"
            subtitle="Short and sweet works best!"
          />
          <Input
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            noValidation={false}
          />
          <Input
            id="usagePolicy"
            label="Usage Policy (Optional)"
            disabled={isLoading}
            register={register}
            errors={errors}
            noValidation={false}
          />
        </div>
      )}

      {step === STEPS.FEATURES && (
        <div className="flex flex-col gap-8">
          <Heading
            title="What makes your item special?"
            subtitle="Add some features that make your item stand out"
          />
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={handleFeatureKeyPress}
                  disabled={isLoading}
                  placeholder="Enter a feature"
                  className="
                    peer
                    w-full
                    p-4
                    pt-6 
                    font-medium 
                    bg-white
                    border-2
                    rounded-xl
                    outline-none
                    transition-all
                    duration-300
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    shadow-sm
                    hover:shadow-md
                    focus:shadow-lg
                    placeholder:text-gray-400
                    border-gray-300
                    focus:border-orange-500
                  "
                />
                <label className="
                  absolute 
                  text-sm
                  duration-300
                  transform 
                  -translate-y-3 
                  top-5 
                  z-10 
                  origin-[0] 
                  left-4
                  peer-placeholder-shown:scale-100 
                  peer-placeholder-shown:translate-y-0 
                  peer-focus:scale-75
                  peer-focus:-translate-y-4
                  font-medium
                  text-gray-500
                ">
                  Add a feature
                </label>
              </div>
              <button
                type="button"
                onClick={addFeature}
                disabled={isLoading || !newFeature.trim()}
                className="
                  px-4
                  py-4
                  bg-orange-500
                  text-white
                  rounded-xl
                  font-semibold
                  hover:bg-orange-600
                  transition-all
                  duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  shadow-sm
                  hover:shadow-md
                  transform
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  min-w-[80px]
                  flex
                  items-center
                  justify-center
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-500
                  focus:ring-offset-2
                "
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.length === 0 && (
                <div className="text-gray-500 text-sm italic">
                  No features added yet. Add some features to make your item stand out!
                </div>
              )}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="
                    flex 
                    items-center 
                    gap-2 
                    bg-orange-100 
                    text-orange-800 
                    px-3 
                    py-2 
                    rounded-full
                    border
                    border-orange-200
                    hover:bg-orange-200
                    transition-colors
                    duration-200
                    group
                  "
                >
                  <span className="text-sm font-medium">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="
                      text-orange-600 
                      hover:text-orange-800 
                      font-bold
                      text-lg
                      leading-none
                      w-5
                      h-5
                      flex
                      items-center
                      justify-center
                      rounded-full
                      hover:bg-orange-300
                      transition-all
                      duration-200
                    "
                    title="Remove feature"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  );

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
                Rent Your Stuff & Earn Money
              </h2>
              
              <p className="text-sm mb-6 leading-relaxed opacity-90">
                Turn your unused items into income! List your items on RentCart 
                and start earning money from your belongings.
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaShieldAlt size={18} className="text-orange-200" />
                  <span className="text-left text-sm">Secure Payments & Insurance</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock size={18} className="text-orange-200" />
                  <span className="text-left text-sm">Flexible Rental Periods</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUsers size={18} className="text-orange-200" />
                  <span className="text-left text-sm">Verified Renters Only</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">₹5K+</div>
                  <div className="text-xs opacity-80">Avg. Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-xs opacity-80">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs opacity-80">Support</div>
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

            {/* Back Button */}
            <div className="mb-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-600
                  hover:text-gray-900
                  transition-colors
                  duration-200
                  font-medium
                  text-sm
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  List your item and start earning money.
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Rent Your Stuff
                </h2>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Step {step + 1} of 6</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(((step + 1) / 6) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / 6) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {bodyContent}
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  {secondaryActionLabel && (
                    <Button
                      outline
                      label={secondaryActionLabel}
                      onClick={onBack}
                      disabled={isLoading}
                    />
                  )}
                  <Button
                    label={actionLabel}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  />
                </div>
              </form>

              {/* Footer */}
              <div className="text-gray-500 text-center mt-6 font-medium">
                <p className="text-sm">Need help?
                  <Link 
                    href="/support-chat"
                    className="text-orange-600 cursor-pointer hover:text-orange-700 ml-1 font-semibold hover:underline transition-colors duration-200"
                  > 
                    Contact Support
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

export default RentPage; 