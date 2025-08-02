"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaDownload, FaCheckCircle, FaHome, FaList, FaStar } from "react-icons/fa";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import { useUser } from "@/app/providers/UserProvider";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user } = useUser();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-user-email": user?.email || user?.emailId || "",
        },
      });

      if (response.ok) {
        const orderData = await response.json();
        console.log('Order success page - received order data:', orderData);
        setOrder(orderData);
      } else {
        console.error('Failed to fetch order details:', response.status, response.statusText);
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}/receipt`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `receipt_${order.orderId}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Receipt downloaded successfully!");
      } else {
        toast.error("Failed to download receipt");
      }
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-alibaba-orange mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-alibaba-black">Loading order details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaCheckCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-alibaba-black mb-2">Order Not Found</h1>
            <p className="text-alibaba-gray-600 mb-6">The order you're looking for doesn't exist.</p>
            <Button label="Go Home" onClick={() => router.push("/")} />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-alibaba-black mb-2">
              Order Confirmed!
            </h1>
            <p className="text-alibaba-gray-600">
              Your order has been successfully placed and confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-alibaba-black mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  order.status === 'PLACED' ? 'text-orange-600' :
                  order.status === 'DELIVERED' ? 'text-green-600' :
                  'text-red-600'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-semibold ${
                  order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-alibaba-black">₹{order.totalAmount}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{order.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-semibold">
                  {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
              {order.estimatedDeliveryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-semibold">
                    {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              label="Download Receipt"
              icon={FaDownload}
              onClick={downloadReceipt}
              className="flex-1 bg-alibaba-orange hover:bg-alibaba-orange-dark"
            />
            <Button
              label="Write Review"
              icon={FaStar}
              onClick={() => {
                console.log('Order object:', order);
                console.log('Order ID:', order.id);
                console.log('Order OrderId:', order.orderId);
                router.push(`/review/${order.id || order.orderId}`);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            />
            <Button
              label="View All Orders"
              icon={FaList}
              onClick={() => router.push("/orders")}
              outline
              className="flex-1"
            />
            <Button
              label="Go Home"
              icon={FaHome}
              onClick={() => router.push("/")}
              outline
              className="flex-1"
            />
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> A copy of your receipt has been sent to your email address. 
              You can also download it anytime from your order history.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderSuccessPage; 