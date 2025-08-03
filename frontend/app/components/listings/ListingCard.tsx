"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useUser } from '@/app/providers/UserProvider';


import Button from "../Button";
import ClientOnly from "../ClientOnly";
import Avatar from "../Avatar";

interface ListingCardProps {
  data: SafeListing;
  userData?: SafeUser | null;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  userData,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  // currentUser, // Remove prop-based currentUser
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const { user: currentUser } = useUser();

  // Handle location display - use direct location string if available
  const locationDisplay = data.locationValue || "Location not specified";

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/items/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-3 w-full">
        {/* Enhanced Image Container */}
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-2xl
            shadow-xl
            group-hover:shadow-2xl
            transition-all
            duration-500
            transform
            group-hover:scale-[1.02]
            bg-gradient-to-br from-alibaba-gray-50 to-white
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition-all
              duration-700
              ease-out
            "
            src={data.imageSrc}
            alt="Listing"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          

          
          {/* Enhanced Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-alibaba-orange text-white shadow-lg backdrop-blur-sm bg-opacity-90 border border-white/20">
              Rent
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="px-3 py-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-white/50">
              <div className="font-bold text-alibaba-black text-lg">Rs {price}</div>
              {!reservation && <div className="text-xs text-alibaba-gray-600 font-medium">per day</div>}
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="space-y-2">
          {/* Title */}
          <div className="font-bold text-xl text-alibaba-black group-hover:text-alibaba-orange transition-colors duration-300">
            {data.title}
          </div>
          
          {/* Location */}
          <div className="font-medium text-alibaba-gray-600 flex items-center gap-2">
            <div className="w-2 h-2 bg-alibaba-orange rounded-full"></div>
            {reservationDate || locationDisplay}
          </div>

          {/* User Info for Reservations */}
          {reservation && (
            <div className="
              flex 
              flex-row 
              items-center
              gap-3
              p-3
              bg-alibaba-gray-50
              rounded-xl
              border
              border-alibaba-gray-200
            "
            >
              <div className="text-sm text-alibaba-gray-700">Booked by {userData?.name}</div>
              <Avatar src={userData?.image} />
            </div>
          )}

          {/* Availability Info */}
          {!reservation && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-alibaba-gray-600 font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {data.itemCount || 1} available
              </div>
              <div className="text-xs text-alibaba-gray-500 bg-alibaba-gray-100 px-2 py-1 rounded-full">
                Instant Booking
              </div>
            </div>
          )}

          {/* Action Button */}
          {onAction && actionLabel && (
            <div className="pt-2">
              <Button
                disabled={disabled}
                small
                label={actionLabel}
                onClick={handleCancel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
