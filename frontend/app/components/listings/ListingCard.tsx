"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { FiMapPin, FiZap } from "react-icons/fi";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useUser } from "@/app/providers/UserProvider";

import Button from "../Button";
import Avatar from "../Avatar";
import { cn } from "@/app/lib/cn";

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

/**
 * Premium e-commerce listing card.
 * Refined image canvas, price chip with brand accent, calm metadata row.
 */
const ListingCard: React.FC<ListingCardProps> = ({
  data,
  userData,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
}) => {
  const router = useRouter();
  useUser(); // hook retained to preserve user context wiring

  const [imgError, setImgError] = useState(false);
  const locationDisplay = data.locationValue || "Location not specified";

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const price = useMemo(() => {
    if (reservation) return reservation.totalPrice;
    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return `${format(start, "PP")} – ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <article
      onClick={() => router.push(`/items/${data.id}`)}
      className="group cursor-pointer focus-within:outline-none"
      data-testid={`listing-card-${data.id}`}
    >
      {/* Image canvas */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream-200 ring-1 ring-ink-100 shadow-softer transition-all duration-300 group-hover:shadow-card group-hover:ring-ink-200">
        {!imgError && data.imageSrc ? (
          <Image
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            src={data.imageSrc}
            alt={data.title}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-cream-200 to-cream-300 text-ink-300 text-xs font-medium">
            No image
          </div>
        )}

        {/* Top-left badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-ink/85 text-white backdrop-blur shadow-soft">
            <FiZap size={11} />
            For Rent
          </span>
        </div>

        {/* Bottom-left price chip */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-full bg-white/95 backdrop-blur px-3 py-1.5 shadow-soft border border-white">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-ink text-base leading-none">
                ₹{price}
              </span>
              {!reservation && (
                <span className="text-[11px] text-ink-500 font-medium">/day</span>
              )}
            </div>
          </div>
        </div>

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="mt-3.5 space-y-2 px-0.5">
        <h3 className="font-display font-semibold text-[15px] text-ink leading-snug line-clamp-1 group-hover:text-brand transition-colors duration-200">
          {data.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-ink-500">
          <FiMapPin size={12} className="shrink-0 text-ink-400" />
          <span className="truncate">{reservationDate || locationDisplay}</span>
        </div>

        {reservation && (
          <div className="flex items-center gap-2 px-3 py-2 bg-cream-200/70 border border-ink-100 rounded-xl">
            <Avatar src={userData?.image} size={22} />
            <span className="text-xs text-ink-600 truncate">
              Booked by {userData?.name}
            </span>
          </div>
        )}

        {!reservation && (
          <div className="flex items-center justify-between pt-0.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
              {data.itemCount || 1} available
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                "bg-brand/8 text-brand"
              )}
              style={{ backgroundColor: "rgba(255,106,0,0.08)" }}
            >
              Instant
            </span>
          </div>
        )}

        {onAction && actionLabel && (
          <div className="pt-1.5">
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
              variant="outline"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default ListingCard;
