"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import { categories } from "@/app/components/navbar/Categories";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import LocationInput from "@/app/components/inputs/CountrySelect";

interface EditItemClientProps {
  item: any;
  currentUser?: SafeUser | null;
}

const EditItemClient: React.FC<EditItemClientProps> = ({
  item,
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
          defaultValues: {
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        imageSrc: item.imageSrc,
        securityDeposit: item.securityDeposit,
        usagePolicy: item.usagePolicy,
        location: item.locationValue,
      },
  });

  const imageSrc = watch("imageSrc");
  const category = watch("category");
  const location = watch("location");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
              const updateData = {
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          location: data.location,
          images: data.imageSrc ? [data.imageSrc] : [],
          securityDeposit: data.securityDeposit || 0,
          usagePolicy: data.usagePolicy || "",
        };

      await axios.put(`/api/items/${item.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      toast.success("Item updated successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.error || "Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Read-only Item ID display */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600 select-all">
        <strong>Item ID:</strong> {item.id}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Category Selection */}
        <div className="flex flex-col gap-4">
          <Heading
            title="Category"
            subtitle="Select the category that best describes your item"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.label} className="col-span-1">
                <CategoryInput
                  onClick={(selectedCategory) => {
                    setCustomValue("category", selectedCategory);
                    setDescription(cat.description);
                  }}
                  selected={category === cat.label}
                  label={cat.label}
                  icon={cat.icon}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-4">
          <Heading
            title="Item Image"
            subtitle="Add a photo of your item"
          />
          <ImageUpload
            onChange={(value) => setCustomValue("imageSrc", value)}
            value={imageSrc}
          />
        </div>

        {/* Basic Information */}
        <div className="flex flex-col gap-4">
          <Heading
            title="Item Details"
            subtitle="Tell people about your item"
          />
          <Input
            id="title"
            label="Title"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <LocationInput
              value={location}
              onChange={(value) => setCustomValue("location", value)}
              placeholder="e.g., Mumbai, Maharashtra or Bandra West, Mumbai"
            />
          </div>
          <Input
            id="price"
            label="Price per day (Rs)"
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="securityDeposit"
            label="Security Deposit (Rs) - Optional"
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <Input
            id="usagePolicy"
            label="Usage Policy (Optional)"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            label="Update Item"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
          <Button
            label="Cancel"
            onClick={() => router.push("/dashboard")}
            outline
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditItemClient; 