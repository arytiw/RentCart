"use client";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Heading from "@/app/components/Heading";
import Image from "next/image";
import Button from "@/app/components/Button";
import BookingModal from "@/app/components/modals/BookingModal";
import ReviewModal from "@/app/components/modals/ReviewModal";

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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recentlyBooked, setRecentlyBooked] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  
  // Check if current user is the owner of this item
  const isOwner = currentUser && item.userId && currentUser.emailId === item.userId;
  
  // Handle location display - use direct location string if available
  const locationDisplay = item.locationValue || "Location not specified";
  const category = useMemo(() => {
    return categories.find((items) => items.label === item.category);
  }, [item.category]);

  // Check if user recently booked this item
  useEffect(() => {
    const checkRecentBooking = () => {
      const recentBookings = localStorage.getItem('recentBookings');
      if (recentBookings) {
        try {
          const bookings = JSON.parse(recentBookings);
          const recentBooking = bookings.find((booking: any) => 
            booking.itemId === item.id && 
            Date.now() - booking.timestamp < 24 * 60 * 60 * 1000 // 24 hours
          );
          if (recentBooking) {
            setRecentlyBooked(true);
            setCompletedOrderId(recentBooking.orderId);
          }
        } catch (error) {
          console.error('Error parsing recent bookings:', error);
        }
      }
    };
    
    checkRecentBooking();
  }, [item.id]);

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
                  {isOwner ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <p className="text-sm text-blue-700 font-medium">
                            This is your item
                          </p>
                        </div>
                      </div>
                      <Button
                        disabled={true}
                        label="Cannot Book Your Own Item"
                        className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  ) : recentlyBooked ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <p className="text-sm text-green-700 font-medium">
                            Recently Booked!
                          </p>
                        </div>
                      </div>
                      <Button
                        label="Write a Review"
                        onClick={() => setIsReviewModalOpen(true)}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      />
                      <Button
                        label="Book Again"
                        onClick={() => setIsBookingModalOpen(true)}
                        className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                      />
                    </div>
                  ) : (
                    <Button
                      disabled={!item.available || (item.quantity || 1) <= 0}
                      label={!item.available ? "Not Available" : (item.quantity || 1) <= 0 ? "Out of Stock" : "Book Now"}
                      onClick={() => setIsBookingModalOpen(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        itemId={item.id}
        itemTitle={item.title}
        dailyRate={item.price}
        ownerEmail={item.userId}
        currentUser={currentUser}
        securityDeposit={item.securityDeposit}
        onBookingSuccess={(orderId) => {
          // Store recent booking info
          const recentBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
          recentBookings.push({
            itemId: item.id,
            orderId: orderId,
            timestamp: Date.now()
          });
          localStorage.setItem('recentBookings', JSON.stringify(recentBookings));
          
          // Update state to show review option
          setRecentlyBooked(true);
          setCompletedOrderId(orderId);
          setIsBookingModalOpen(false);
          
          // Show success message
          toast.success("Booking completed! You can now write a review.");
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        itemId={item.id}
        itemTitle={item.title}
        orderId={completedOrderId}
        currentUser={currentUser}
        onReviewSubmitted={() => {
          // Clear the recent booking after review is submitted
          const recentBookings = JSON.parse(localStorage.getItem('recentBookings') || '[]');
          const updatedBookings = recentBookings.filter((booking: any) => booking.itemId !== item.id);
          localStorage.setItem('recentBookings', JSON.stringify(updatedBookings));
          setRecentlyBooked(false);
          setCompletedOrderId(null);
        }}
      />
    </Container>
  );
};

export default ItemClient; 