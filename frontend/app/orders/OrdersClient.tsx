"use client";

import Container from "@/app/components/Container";
import { SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import OrderCard from "@/app/components/orders/OrderCard";

interface OrdersClientProps {
  orders: any[];
  currentUser?: SafeUser | null;
}

const OrdersClient: React.FC<OrdersClientProps> = ({
  orders,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.patch(`/api/orders/${id}/cancel`)
      .then(() => {
        toast.success('Order cancelled');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error)
      })
      .finally(() => {
        setDeletingId('');
      })
  }, [router]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found. Start shopping to see your orders here!
      </div>
    );
  }

  return (
    <div 
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
      "
    >
      {orders.map((order: any) => (
        <OrderCard
          key={order.id}
          data={order}
          onAction={onCancel}
          disabled={deletingId === order.id}
          actionLabel="Cancel order"
          currentUser={currentUser}
        />
      ))}
    </div>
   );
}
 
export default OrdersClient; 