"use client";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { useMemo } from "react";
import Heading from "@/app/components/Heading";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import Button from "@/app/components/Button";
import ReviewSection from "@/app/components/ReviewSection";
import DynamicRating from "@/app/components/DynamicRating";
import { useRouter } from "next/navigation";

interface ItemClientProps {
  item: any;
  currentUser?: SafeUser | null;
}

const ItemClient: React.FC<ItemClientProps> = ({
  item,
  currentUser,
}) => {
  const { getByValue } = useCountries();
  const router = useRouter();
  // Handle location display - use direct location string if available
  const locationDisplay = item.locationValue || "Location not specified";
  const category = useMemo(() => {
    return categories.find((items) => items.label === item.category);
  }, [item.category]);

  const handleBooking = () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    const bookingParams = new URLSearchParams({
      itemId: item.id,
      itemTitle: item.title,
      dailyRate: item.price.toString(),
      ownerEmail: item.user?.emailId || '',
      securityDeposit: (item.securityDeposit || 0).toString()
    });
    
    router.push(`/bookings/new?${bookingParams.toString()}`);
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Heading
              title={item.title}
              subtitle={locationDisplay}
            />
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
              <Image
                src={item.imageSrc}
                fill
                alt="Item"
                className="object-cover h-auto w-full"
              />
              <div className="absolute top-5 right-5">
                <HeartButton 
                  listingId={item.id}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <div className="col-span-4 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex flex-row items-center gap-2">
                  <div>Category</div>
                </div>
                <div className="text-neutral-500 font-light">
                  {category?.label}
                </div>
              </div>
              {/* Show item quantity */}
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex flex-row items-center gap-2">
                  <div>Quantity Available</div>
                </div>
                <div className="text-neutral-500 font-light">
                  {typeof item.stockQuantity === 'number' ? item.stockQuantity : (item.stockQuantity ?? 'N/A')}
                </div>
              </div>
              <hr />
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold">
                  Description
                </div>
                <div className="text-neutral-500 font-light">
                  {item.description}
                </div>
              </div>
              <hr />
              {item.usagePolicy && (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="text-xl font-semibold">
                      Usage Policy
                    </div>
                    <div className="text-neutral-500 font-light">
                      {item.usagePolicy}
                    </div>
                  </div>
                  <hr />
                </>
              )}
              {item.features && item.features.length > 0 && (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="text-xl font-semibold">
                      Features
                    </div>
                    <div className="text-neutral-500 font-light">
                      {item.features.map((feature: string, index: number) => (
                        <div key={index}>• {feature}</div>
                      ))}
                    </div>
                  </div>
                  <hr />
                </>
              )}
              
              <ReviewSection 
                itemId={item.id}
                currentUser={currentUser}
              />
            </div>
            
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
                <div className="flex flex-row items-center gap-1 p-4">
                  <div className="text-2xl font-semibold">
                    Rs {item.price}
                  </div>
                  <div className="font-light text-neutral-600">
                    day
                  </div>
                </div>
                <hr />
                <div className="p-4">
                  <div className="flex flex-row items-center justify-between font-semibold text-lg">
                    <div>Security Deposit</div>
                    <div>Rs {item.securityDeposit || 0}</div>
                  </div>
                </div>
                <hr />
                <div className="p-4">
                  <div className="flex flex-row items-center justify-between font-semibold text-lg">
                    <div>Rating</div>
                    <DynamicRating itemId={item.id} />
                  </div>
                </div>
                <hr />
                <div className="p-4">
                  <div className="flex flex-row items-center justify-between font-semibold text-lg">
                    <div>Status</div>
                    <div className={item.available ? "text-green-600" : "text-red-600"}>
                      {item.available ? "Available" : "Not Available"}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="p-4">
                  <div className="flex flex-row items-center justify-between font-semibold text-lg">
                    <div>Quantity</div>
                    <div className="text-blue-600">
                      {item.quantity || 1} available
                    </div>
                  </div>
                </div>
                <hr />
                <div className="p-4">
                  <Button
                    disabled={!item.available || (item.quantity || 1) <= 0}
                    label={!item.available ? "Not Available" : (item.quantity || 1) <= 0 ? "Out of Stock" : "Book Now"}
                    onClick={handleBooking}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ItemClient; 