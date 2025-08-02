"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaShoppingCart, FaUpload, FaMapMarkerAlt, FaTag, FaInfoCircle, FaImages, FaEdit, FaStar, FaRupeeSign } from "react-icons/fa";

import useRentModal from "@/app/hooks/useRentModal";
import { useUser } from '@/app/providers/UserProvider';

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CategoryInput from "../inputs/CategoryInput";
import LocationInput from "../inputs/CountrySelect";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import ValidatedInput from "../inputs/ValidatedInput";
import Heading from "../Heading";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  FEATURES = 5,
  PRICE = 6,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const { token, user: currentUser } = useUser();
  const [description, setDescription] = useState("");
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
      location: null,
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

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

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
        // Check if category is selected
        if (!currentCategory || currentCategory.trim() === "") {
          return true;
        }
        break;
        
      case STEPS.LOCATION:
        // Check if location exists and is valid (no validation errors would be shown)
        if (!currentLocation || !currentLocation.label || !currentLocation.label.trim()) {
          return true;
        }
        // Additional check: validate location format
        const locationRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
        if (!locationRegex.test(currentLocation.label.trim())) {
          return true;
        }
        break;
      
      case STEPS.IMAGES:
        // Check if image is uploaded
        if (!currentImageSrc || currentImageSrc.trim() === "") {
          return true;
        }
        break;
      
      case STEPS.DESCRIPTION:
        // Check title validation
        if (!currentTitle || currentTitle.trim().length < 5 || currentTitle.trim().length > 50) {
          return true;
        }
        const titleRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
        if (!titleRegex.test(currentTitle.trim())) {
          return true;
        }
        
        // Check description validation
        if (!currentDescription || currentDescription.trim().length === 0) return true;
        const descWordCount = currentDescription.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
        if (descWordCount < 10 || descWordCount > 150) {
          return true;
        }
        // More lenient regex for description - allow more special characters
        const descRegex = /^[a-zA-Z0-9\s.,!?'"()-]*$/;
        if (!descRegex.test(currentDescription.trim())) {
          return true;
        }
        
        // Check usage policy if provided
        if (currentUsagePolicy && currentUsagePolicy.trim()) {
          const policyWordCount = currentUsagePolicy.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
          if (policyWordCount < 10 || policyWordCount > 150) {
            return true;
          }
          if (!descRegex.test(currentUsagePolicy.trim())) {
            return true;
          }
        }
        break;
      
      case STEPS.PRICE:
        // Check if price is valid
        if (!currentPrice || currentPrice <= 0) {
          return true;
        }
        break;
      
      default:
        return false;
    }
    return false;
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    // Validate current step before proceeding
    if (hasCurrentStepErrors()) {
      toast.error("Please fix the errors in the current step before proceeding");
      return;
    }
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    // Validate required images
    if (!data.imageSrc || data.imageSrc.trim() === "") {
      toast.error("Please upload at least one photo of your item");
      setStep(STEPS.IMAGES);
      return;
    }

    setIsLoading(true);

    console.log("Submitting item data:", data);
    
    // Use token from useUser hook, fallback to localStorage
    const authToken = token || localStorage.getItem('authToken');
    console.log("Token from useUser hook:", token ? token.substring(0, 20) + "..." : "No token from hook");
    console.log("Token from localStorage:", localStorage.getItem('authToken') ? localStorage.getItem('authToken')?.substring(0, 20) + "..." : "No token in localStorage");
    console.log("Final authToken:", authToken ? authToken.substring(0, 20) + "..." : "No final token");

    if (!authToken) {
      toast.error("Please login to create an item listing");
      setIsLoading(false);
      return;
    }

    // Prepare item data according to Item.java POJO
    const itemData = {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      location: data.location?.label || data.location?.value || data.location,
      images: data.imageSrc ? [data.imageSrc] : [],
      features: features,
      usagePolicy: data.usagePolicy || "",
      securityDeposit: data.securityDeposit || 0,
      type: data.type || "RENT",
      quantity: data.quantity || 1
    };

    console.log("Raw form data:", data);
    console.log("Sending item data:", itemData);
    console.log("Current user email being sent:", currentUser?.email || currentUser?.emailId || '');
    
    // Debug: Check each required field
    console.log("Title:", data.title, "Type:", typeof data.title);
    console.log("Description:", data.description, "Type:", typeof data.description);
    console.log("Price:", data.price, "Type:", typeof data.price);
    console.log("Category:", data.category, "Type:", typeof data.category);
    console.log("Location:", data.location, "Type:", typeof data.location);
    console.log("Location value:", data.location?.value, "Type:", typeof data.location?.value);

    // Validate required fields before sending
    const missingFields = [];
    if (!data.title || data.title.trim() === '') missingFields.push('title');
    if (!data.description || data.description.trim() === '') missingFields.push('description');
    if (!data.price || data.price <= 0) missingFields.push('price');
    if (!data.category || data.category.trim() === '') missingFields.push('category');
    if (!data.location || (!data.location.label && !data.location.value && !data.location)) missingFields.push('location');
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    axios
      .post("/api/items", itemData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-USER-EMAIL': currentUser?.email || currentUser?.emailId || ''
        }
      })
      .then((response) => {
        console.log("Item created successfully:", response.data);
        toast.success("Item listed successfully!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        setFeatures([]);
        setNewFeature("");
        rentModal.onClose();
      })
      .catch((error) => {
        console.error("Error creating item:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
        } else if (error.message) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create Listing";
    }

    return "Continue";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  // Step indicators
  const steps = [
    { name: "Category", icon: FaTag },
    { name: "Location", icon: FaMapMarkerAlt },
    { name: "Details", icon: FaInfoCircle },
    { name: "Images", icon: FaImages },
    { name: "Description", icon: FaEdit },
    { name: "Features", icon: FaStar },
    { name: "Pricing", icon: FaRupeeSign },
  ];

  let bodyContent = (
    <div className="flex flex-col gap-4">
      {/* Type selection */}
      <div className="bg-gradient-to-r from-alibaba-orange/10 to-alibaba-orange/5 p-4 rounded-2xl border border-alibaba-orange/20 shadow-lg">
        <div className="flex flex-row gap-6 items-center justify-center">
          <label className="font-semibold text-alibaba-black text-base">Listing Type:</label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              value="RENT"
              checked={type === "RENT"}
              onChange={() => setValue("type", "RENT", { shouldDirty: true })}
              className="text-alibaba-orange focus:ring-alibaba-orange w-5 h-5 transition-all duration-200"
            />
            <span className="text-base font-medium group-hover:text-alibaba-orange transition-colors duration-200">Rent</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              value="SELL"
              checked={type === "SELL"}
              onChange={() => setValue("type", "SELL", { shouldDirty: true })}
              className="text-alibaba-orange focus:ring-alibaba-orange w-5 h-5 transition-all duration-200"
            />
            <span className="text-base font-medium group-hover:text-alibaba-orange transition-colors duration-200">Sell</span>
          </label>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-alibaba-black mb-2">
          Choose Your Item Category
        </h2>
        <p className="text-alibaba-gray-600 mb-4 text-base">
          {description || "Select the category that best describes your item"}
        </p>
      </div>

      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-4
          max-h-[40vh]
          overflow-y-auto
          pr-2
          space-y-1
        "
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category);
                setDescription(item.description);
              }}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
      
      {step === STEPS.CATEGORY && hasCurrentStepErrors() && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          Please select a category to continue
        </div>
      )}
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alibaba-black mb-2">
            Where is your item located?
          </h2>
          <p className="text-alibaba-gray-600 mb-4 text-base">
            Help renters find your item easily
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
          <LocationInput
            value={location}
            onChange={(value) => setCustomValue("location", value)}
            placeholder="e.g., Mumbai, Maharashtra or Bandra West, Mumbai"
          />
        </div>
        
        {step === STEPS.LOCATION && hasCurrentStepErrors() && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            Please enter a valid location to continue
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alibaba-black mb-2">
            Item Details
          </h2>
          <p className="text-alibaba-gray-600 mb-4 text-base">
            Tell us more about your item
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-lg">
          <Counter
            onChange={(value) => setCustomValue("itemCount", value)}
            value={itemCount}
            title="Available Units"
            subtitle="How many units of this item can you rent?"
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alibaba-black mb-2">
            Add Photos *
          </h2>
          <p className="text-alibaba-gray-600 mb-4 text-base">
            High-quality photos help attract more renters (Required)
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 shadow-lg">
          <ImageUpload
            onChange={(value) => setCustomValue("imageSrc", value)}
            value={imageSrc}
          />
          {!imageSrc && (
            <div className="mt-3 text-red-500 text-base text-center font-medium">
              * At least one photo is required
            </div>
          )}
        </div>
        
        {step === STEPS.IMAGES && hasCurrentStepErrors() && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            Please upload at least one photo to continue
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alibaba-black mb-2">
            Describe Your Item
          </h2>
          <p className="text-alibaba-gray-600 mb-4 text-base">
            Help renters understand what you&apos;re offering
          </p>
        </div>
        
        <div className="space-y-5">
          <ValidatedInput
            id="title"
            label="Item Title (5-50 characters)"
            disabled={isLoading}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            required
            validationType="title"
          />
          <ValidatedInput
            id="description"
            label="Detailed Description (10-150 words)"
            disabled={isLoading}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            required
            type="textarea"
            rows={4}
            validationType="description"
          />
          <ValidatedInput
            id="usagePolicy"
            label="Usage Policy (Optional, 10-150 words if provided)"
            disabled={isLoading}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            type="textarea"
            rows={3}
            validationType="usagePolicy"
          />
        </div>
        
        {step === STEPS.DESCRIPTION && hasCurrentStepErrors() && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            Please fill in all required fields correctly. Title must be 5-50 characters, description must be 10-150 words.
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.FEATURES) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alibaba-black mb-2">
            Item Features
          </h2>
          <p className="text-alibaba-gray-600 mb-4 text-base">
            Highlight what makes your item special
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 shadow-lg">
          <div className="space-y-5">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Add Features
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Validate feature input
                    if (value.trim()) {
                      const textRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
                      if (!textRegex.test(value.trim())) {
                        // Don't update if validation fails
                        return;
                      }
                    }
                    setNewFeature(value);
                  }}
                  placeholder="e.g., Brand new, Includes warranty, Easy to use"
                  className="flex-1 px-4 py-3 border-2 border-alibaba-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alibaba-orange focus:border-transparent text-base bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newFeature.trim()) {
                      setFeatures([...features, newFeature.trim()]);
                      setNewFeature("");
                    }
                  }}
                  className="px-6 py-3 bg-alibaba-orange text-white rounded-xl hover:bg-alibaba-orange-dark transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={isLoading || !newFeature.trim()}
                >
                  Add
                </button>
              </div>
            </div>
            
            {features.length > 0 && (
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Added Features:
                </label>
                <div className="flex flex-wrap gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-alibaba-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="text-base text-gray-700 font-medium">{feature}</span>
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 text-lg font-bold hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-alibaba-black mb-2">
            Set Your Price
          </h2>
          <p className="text-alibaba-gray-600 mb-4 text-base">
            How much do you charge per day?
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
          <div className="space-y-5">
            <Input
              id="price"
              label="Price Per Day (₹)"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type="number"
              formatPrice
              noValidation
            />
            
            {/* Price suggestions */}
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <p className="text-base font-semibold text-gray-700 mb-4">
                💡 Suggested price ranges:
              </p>
              <div className="text-sm text-gray-600 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                  <span className="text-lg">📱</span>
                  <span>Electronics: ₹50-500/day</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg">
                  <span className="text-lg">🏠</span>
                  <span>Home & Garden: ₹100-1000/day</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-lg">
                  <span className="text-lg">🚗</span>
                  <span>Vehicles: ₹500-3000/day</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg">
                  <span className="text-lg">⚡</span>
                  <span>Power Tools: ₹200-800/day</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg">
                  <span className="text-lg">🎉</span>
                  <span>Event Items: ₹100-1500/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {step === STEPS.PRICE && hasCurrentStepErrors() && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            Please enter a valid price (greater than 0) to continue
          </div>
        )}
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading || hasCurrentStepErrors()}
      isOpen={rentModal.isOpen}
      title="Create New Listing"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
