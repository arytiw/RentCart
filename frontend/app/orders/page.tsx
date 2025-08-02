import getCurrentUser from "@/app/actions/getCurrentUser";
import getOrders from "@/app/actions/getOrders";
import EmptyState from "@/app/components/EmptyState";
import OrdersClient from "./OrdersClient";

interface OrdersPageProps {
  searchParams: { showTrips?: string };
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState />
    );
  }

  const orders = await getOrders();

  if (orders.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <OrdersClient
      orders={orders}
      currentUser={currentUser}
    />
  );
};

export default OrdersPage; 