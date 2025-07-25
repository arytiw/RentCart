"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

import Button from "../Button";

interface OrderCardProps {
  data: any;
  currentUser?: SafeUser | null;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  data,
  currentUser,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
}) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    }, [disabled, onAction, actionId]);

  const orderDate = useMemo(() => {
    if (!data.orderDate) {
      return null;
    }

    return format(new Date(data.orderDate), 'PP');
  }, [data.orderDate]);

  const estimatedDelivery = useMemo(() => {
    if (!data.estimatedDeliveryDate) {
      return null;
    }

    return format(new Date(data.estimatedDeliveryDate), 'PP');
  }, [data.estimatedDeliveryDate]);

  return (
    <div
      onClick={() => router.push(`/orders/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="font-semibold text-lg">{data.orderId}</div>
        <div className="font-light text-neutral-500">
          {orderDate && `Ordered on ${orderDate}`}
        </div>
        <div className="font-light text-neutral-500">
          {estimatedDelivery && `Estimated delivery: ${estimatedDelivery}`}
        </div>
        <div className="font-light text-neutral-500">
          {data.address}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">Rs {data.totalAmount}</div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-light text-neutral-500">Status: </div>
          <div className={`font-semibold ${
            data.status === 'PLACED' ? 'text-blue-600' :
            data.status === 'DELIVERED' ? 'text-green-600' :
            data.status === 'CANCELLED' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {data.status}
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-light text-neutral-500">Payment: </div>
          <div className={`font-semibold ${
            data.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.paymentStatus}
          </div>
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
        {/* Mark as Delivered button for PLACED orders */}
        {data.status === 'PLACED' && (
          <Button
            label="Mark as Delivered"
            small
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await axios.patch(`/api/orders/${data.id}/deliver`);
                toast.success('Order marked as delivered');
                router.refresh();
              } catch (err: any) {
                toast.error('Failed to mark as delivered');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderCard; 