"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaShoppingCart, FaUpload, FaMapMarkerAlt, FaTag, FaInfoCircle, FaImages, FaEdit, FaStar, FaRupeeSign } from "react-icons/fa";

import { useUser } from '@/app/providers/UserProvider';

import Counter from "@/app/components/inputs/Counter";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import LocationInput from "@/app/components/inputs/CountrySelect";
import { categories } from "@/app/components/navbar/Categories";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import ValidatedInput from "@/app/components/inputs/ValidatedInput";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  FEATURES = 5,
  PRICE = 6,
}

const CreateListingPage = () => {
  const router = useRouter();
  const { token } = useUser();
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
      dynamic(() => import("@/app/components/Map"), {
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

  const hasCurrentStepErrors = () => {
    const currentLocation = watch("location");
    const currentTitle = watch("title");
    const currentDescription = watch("description");
    const currentUsagePolicy = watch("usagePolicy");
    const currentImageSrc = watch("imageSrc");

    switch (step) {
      case STEPS.LOCATION:
        if (!currentLocation || !currentLocation.label || !currentLocation.label.trim()) {
          return true;
        }
        const locationRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
        if (!locationRegex.test(currentLocation.label.trim())) {
          return true;
        }
        break;
      
      case STEPS.IMAGES:
        if (!currentImageSrc || currentImageSrc.trim() === "") {
          return true;
        }
        break;
      
      case STEPS.DESCRIPTION:
        if (!currentTitle || currentTitle.trim().length < 5 || currentTitle.trim().length > 50) {
          return true;
        }
        const titleRegex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
        if (!titleRegex.test(currentTitle.trim())) {
          return true;
        }
        
        if (!currentDescription) return true;
        const descWordCount = currentDescription.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
        if (descWordCount < 10 || descWordCount > 150) {
          return true;
        }
        const descRegex = /^[a-zA-Z][a-zA-Z0-9\s.,!?'-]*$/;
        if (!descRegex.test(currentDescription.trim())) {
          return true;
        }
        
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
      
      default:
        return false;
    }
    return false;
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    if (!data.imageSrc || data.imageSrc.trim() === "") {
      toast.error("Please upload at least one photo of your item");
      setStep(STEPS.IMAGES);
      return;
    }

    setIsLoading(true);

    const authToken = token || localStorage.getItem('authToken');

    if (!authToken) {
      toast.error("Please login to create an item listing");
      setIsLoading(false);
      return;
    }

    const itemData = {
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      location: data.location?.value || data.location,
      images: data.imageSrc ? [data.imageSrc] : [],
      features: features,
      usagePolicy: data.usagePolicy || "",
      securityDeposit: data.securityDeposit || 0,
      type: data.type || "RENT",
      quantity: data.quantity || 1
    };

    axios
      .post("/api/items", itemData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then((response) => {
        toast.success("Item listed successfully!");
        router.push('/dashboard');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        setFeatures([]);
        setNewFeature("");
      })
      .catch((error) => {
        console.error("Error creating item:", error);
        
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
      <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-2xl border border-orange-200 shadow-lg">
        <div className="flex flex-row gap-6 items-center justify-center">
          <label className="font-semibold text-gray-900 text-base">Listing Type:</label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              value="RENT"
              checked={type === "RENT"}
              onChange={() => setValue("type", "RENT", { shouldDirty: true })}
              className="text-orange-600 focus:ring-orange-600 w-5 h-5 transition-all duration-200"
            />
            <span className="text-base font-medium group-hover:text-orange-600 transition-colors duration-200">Rent</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              value="SELL"
              checked={type === "SELL"}
              onChange={() => setValue("type", "SELL", { shouldDirty: true })}
              className="text-orange-600 focus:ring-orange-600 w-5 h-5 transition-all duration-200"
            />
            <span className="text-base font-medium group-hover:text-orange-600 transition-colors duration-200">Sell</span>
          </label>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Which of these best describes your item?
        </h2>
        <p className="text-gray-600 mb-6">Pick a category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your item located?"
          subtitle="Help guests find you!"
        />
        <LocationInput
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some details about your item"
          subtitle="Tell us about the item you want to rent out!"
        />
        <Counter
          onChange={(value) => setCustomValue("itemCount", value)}
          value={itemCount}
          title="Item Count"
          subtitle="How many units do you have?"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your item"
          subtitle="Show guests what your item looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your item?"
          subtitle="Short and sweet works best!"
        />
        <ValidatedInput
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validationType="title"
          setValue={setValue}
          watch={watch}
        />
        <hr />
        <ValidatedInput
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validationType="description"
          setValue={setValue}
          watch={watch}
        />
        <hr />
        <ValidatedInput
          id="usagePolicy"
          label="Usage Policy (Optional)"
          disabled={isLoading}
          register={register}
          errors={errors}
          required={false}
          validationType="description"
          setValue={setValue}
          watch={watch}
        />
      </div>
    );
  }

  if (step === STEPS.FEATURES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add features for your item"
          subtitle="What makes your item special?"
        />
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter a feature"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newFeature.trim() && !features.includes(newFeature.trim())) {
                  setFeatures([...features, newFeature.trim()]);
                  setNewFeature("");
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (newFeature.trim() && !features.includes(newFeature.trim())) {
                setFeatures([...features, newFeature.trim()]);
                setNewFeature("");
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
            >
              {feature}
              <button
                type="button"
                onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                className="text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per day?"
        />
        <Input
          id="price"
          label="Price (₹)"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="securityDeposit"
          label="Security Deposit (₹)"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((stepItem, index) => {
                const IconComponent = stepItem.icon;
                const isActive = index === step;
                const isCompleted = index < step;
                
                return (
                  <div key={stepItem.name} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive ? 'border-orange-600 bg-orange-600 text-white' :
                      isCompleted ? 'border-green-500 bg-green-500 text-white' :
                      'border-gray-300 bg-white text-gray-400'
                    }`}>
                      <IconComponent size={16} />
                    </div>
                    <span className={`ml-2 text-xs font-medium ${
                      isActive ? 'text-orange-600' :
                      isCompleted ? 'text-green-600' :
                      'text-gray-400'
                    }`}>
                      {stepItem.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-px mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {bodyContent}
            
            <div className="flex flex-row gap-4 mt-8">
              {secondaryActionLabel && (
                <Button
                  disabled={isLoading}
                  label={secondaryActionLabel}
                  onClick={onBack}
                  outline
                />
              )}
              <Button
                disabled={isLoading || hasCurrentStepErrors()}
                label={actionLabel}
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default CreateListingPage;
