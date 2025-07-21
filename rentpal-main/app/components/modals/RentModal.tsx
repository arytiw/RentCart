"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import useRentModal from "@/app/hooks/useRentModal";
import { useUser } from '@/app/providers/UserProvider';

import Modal from "./Modal";
import Counter from "../inputs/Counter";
import CategoryInput from "../inputs/CategoryInput";
import LocationInput from "../inputs/CountrySelect";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
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
  const { token } = useUser();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

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
    },
  });

  const location = watch("location");
  const category = watch("category");
  const itemCount = watch("itemCount");
  const imageSrc = watch("imageSrc");

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
      location: data.location?.value || data.location,
      images: data.imageSrc ? [data.imageSrc] : [],
      features: features,
      usagePolicy: data.usagePolicy || "",
      securityDeposit: data.securityDeposit || 0,
      type: "RENT"
    };

    console.log("Sending item data:", itemData);

    axios
      .post("/api/items", itemData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
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
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      {description == "" ? (
        <Heading
          title="Which of these best describes your item?"
          subtitle="Pick one category"
        />
      ) : (
        <Heading
          title="Which of these best describes your item?"
          subtitle={description}
        />
      )}

      <div
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
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
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your item located?"
          subtitle="Enter your location (city, area, or address)"
        />
        <LocationInput
          value={location}
          onChange={(value) => setCustomValue("location", value)}
          placeholder="e.g., Mumbai, Maharashtra or Bandra West, Mumbai"
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your item"
          subtitle="More info"
        />
        <Counter
          onChange={(value) => setCustomValue("itemCount", value)}
          value={itemCount}
          title="Units"
          subtitle="How many units of item can you rent?"
        />
        <hr />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your item"
          subtitle="Show people what your item looks like!"
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
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="usagePolicy"
          label="Usage Policy (Optional)"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  if (step === STEPS.FEATURES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="What features does your item have?"
          subtitle="Add key features that make your item special"
        />
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g., Wireless, 4K Display, etc."
                disabled={isLoading}
                className="
                  peer
                  w-full
                  p-4
                  pt-6 
                  font-light 
                  bg-white 
                  border-2
                  rounded-md
                  outline-none
                  transition
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  pl-4
                  border-neutral-300
                  focus:border-black
                "
              />
              <label className="
                absolute 
                text-md
                duration-150 
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
                text-zinc-400
              ">
                Add Feature
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                if (newFeature.trim()) {
                  setFeatures([...features, newFeature.trim()]);
                  setNewFeature("");
                }
              }}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition mt-8"
              disabled={isLoading || !newFeature.trim()}
            >
              Add
            </button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Added Features:</label>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 text-sm"
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
          label="Price per day (Rs)"
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
          label="Security Deposit (Rs) - Optional"
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
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Rent your stuff"
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
