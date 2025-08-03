"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaUser, FaRupeeSign, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";

interface Booking {
  id: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  notes?: string;
}

interface ListedItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  price: number;
  category: string;
  location: string;
  createdAt: string;
  bookings: Booking[];
}

interface RentalBookingsClientProps {
  items: ListedItem[];
  currentUser?: SafeUser | null;
}

const RentalBookingsClient: React.FC<RentalBookingsClientProps> = ({
  items,
  currentUser,
}) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTotalEarnings = () => {
    return items.reduce((total, item) => {
      return total + item.bookings.reduce((itemTotal, booking) => {
        return itemTotal + (booking.totalPrice || 0);
      }, 0);
    }, 0);
  };

  const getTotalBookings = () => {
    return items.reduce((total, item) => total + item.bookings.length, 0);
  };

  return (
    <Container>
      <div className="mb-8">
        <Heading
          title="Rental Bookings"
          subtitle="Manage your listed items and track rental bookings"
        />
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <FaRupeeSign className="text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{getTotalEarnings()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Bookings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{getTotalBookings()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <FaClock className="text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Listed Items</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{items.length}</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Item Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRupeeSign className="text-gray-400" />
                      <span>₹{item.price}/day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{item.bookings.length} bookings</span>
                    </div>
                  </div>
                </div>
                <Button
                  small
                  label={expandedItems.has(item.id) ? "Hide Details" : "Show Details"}
                  onClick={() => toggleExpanded(item.id)}
                />
              </div>
            </div>

            {/* Bookings Details */}
            {expandedItems.has(item.id) && (
              <div className="p-6 bg-gray-50">
                {item.bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <FaCalendarAlt className="text-gray-400 text-4xl mx-auto mb-4" />
                    <p className="text-gray-600">No bookings for this item yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Bookings</h4>
                    {item.bookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FaUser className="text-gray-400" />
                              <span className="font-medium text-gray-900">{booking.renterName}</span>
                              <span className="text-sm text-gray-500">({booking.renterEmail})</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt className="text-gray-400" />
                                <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaRupeeSign className="text-gray-400" />
                                <span>₹{booking.totalPrice}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            {booking.status.toLowerCase() === 'confirmed' ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : booking.status.toLowerCase() === 'cancelled' ? (
                              <FaTimesCircle className="text-red-500" />
                            ) : null}
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-3 text-xs text-gray-500">
                          Booked on: {formatDateTime(booking.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default RentalBookingsClient; 