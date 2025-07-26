"use client";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { useMemo, useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import Button from "@/app/components/Button";
import useBookingModal from "@/app/hooks/useBookingModal";
import BookingModal from "@/app/components/modals/BookingModal";
import ReviewSection from "@/app/components/ReviewSection";
import DynamicRating from "@/app/components/DynamicRating";

interface ItemClientProps {
  item: any;
  currentUser?: SafeUser | null;
}

const ItemClient: React.FC<ItemClientProps> = ({
  item,
  currentUser,
}) => {
  const { getByValue } = useCountries();
  const bookingModal = useBookingModal();
  const locationDisplay = item.locationValue || "Location not specified";
  const category = useMemo(() => {
    return categories.find((items) => items.label === item.category);
  }, [item.category]);

  // State for owner's phone number
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null);
  const [loadingPhone, setLoadingPhone] = useState<boolean>(false);

  // Fetch owner's phone number using ownerId (userId)
  useEffect(() => {
    const fetchOwnerPhone = async () => {
      if (!item.userId) return;
      setLoadingPhone(true);
      try {
        // Adjust the endpoint to match your AuthService API
        // Example: http://localhost:8081/auth/user?id=<userId>
        const res = await fetch(`http://localhost:8081/auth/user?id=${item.userId}`);
        if (res.ok) {
          const data = await res.json();
          setOwnerPhone(data.phoneNumber || null);
        } else {
          setOwnerPhone(null);
        }
      } catch {
        setOwnerPhone(null);
      }
      setLoadingPhone(false);
    };
    fetchOwnerPhone();
  }, [item.userId]);

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

              {/* Owner's Phone Number Section */}
              <div className="mt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col items-start">
                  <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Owner's Contact Number
                  </div>
                  {loadingPhone ? (
                    <div className="text-gray-500 text-sm">Loading contact...</div>
                  ) : ownerPhone ? (
                    <div className="text-lg text-blue-700 font-mono">{ownerPhone}</div>
                  ) : (
                    <div className="text-gray-400 text-sm">Not available</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">Contact the owner directly for queries or negotiations.</div>
                </div>
              </div>
              {/* End Owner's Phone Number Section */}
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
                    onClick={bookingModal.onOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={bookingModal.onClose}
        itemId={item.id}
        itemTitle={item.title}
        dailyRate={item.price}
        ownerEmail={item.userId}
        currentUser={currentUser}
        securityDeposit={item.securityDeposit}
        itemType={item.type}
      />
    </Container>
  );
};

export default ItemClient;