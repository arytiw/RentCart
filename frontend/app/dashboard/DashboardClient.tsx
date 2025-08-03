"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Heading from "@/app/components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import Button from "@/app/components/Button";

import getUserItems from "@/app/actions/getUserItems";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import { useUser } from '@/app/providers/UserProvider';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars, FaUserTag, FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaTrash, FaCalendarAlt, FaBox, FaChartLine, FaStar } from "react-icons/fa";
import ReviewModal from '@/app/components/modals/ReviewModal';

interface DashboardClientProps {
  // No props required for now
}

const DashboardClient: React.FC<DashboardClientProps> = () => {
  const router = useRouter();
  const { token, user: currentUser } = useUser();
  const [deletingId, setDeletingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reservationsError, setReservationsError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      console.log('Dashboard useEffect triggered');
      console.log('Token exists:', !!token);
      console.log('Current user:', currentUser);
      
      if (!token || !currentUser) {
        console.log('Missing token or currentUser, stopping fetch');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Current user:', currentUser ? 'Present' : 'Missing');
        setLoading(false);
        return;
      }
      
      // Validate token format
      if (!token.startsWith('Bearer ') && !token.includes('.')) {
        console.error('Invalid token format:', token);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      const userEmail = currentUser.email || currentUser.emailId;
      console.log('User email for fetching items:', userEmail);
      console.log('Current user object:', JSON.stringify(currentUser, null, 2));
      console.log('Available user fields:', {
        email: currentUser.email,
        emailId: currentUser.emailId,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      });
      
      if (!userEmail) {
        console.error('No email found for current user:', currentUser);
        setLoading(false);
        return;
      }
      
      try {
        console.log('About to call getUserItems with email:', userEmail);
        const userItems = await getUserItems(userEmail);
        console.log('getUserItems returned:', userItems);
        console.log('Number of items found:', userItems.length);
        setItems(userItems);
        
        // Fetch reservations with proper authorization header
        console.log('Fetching reservations with token:', token ? 'Token exists' : 'No token');
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        const res = await fetch('/api/reservations', {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Reservations response status:', res.status);
        if (res.ok) {
          const reservationsData = await res.json();
          console.log('Reservations data:', reservationsData);
          setReservations(reservationsData);
          setReservationsError(null);
        } else {
          const errorText = await res.text();
          console.error('Failed to fetch reservations:', res.status, errorText);
          setReservations([]);
          setReservationsError(`Failed to load reservations (${res.status})`);
        }
        
        // Fetch orders with proper authorization header
        console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');
        const ordersRes = await fetch('/api/orders', {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Orders response status:', ordersRes.status);
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          console.log('Orders data:', ordersData);
          setOrders(ordersData);
          setOrdersError(null);
        } else {
          const errorText = await ordersRes.text();
          console.error('Failed to fetch orders:', ordersRes.status, errorText);
          setOrders([]);
          setOrdersError(`Failed to load orders (${ordersRes.status})`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep items if they were successfully fetched, but clear reservations and orders on error
        setReservations([]);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, currentUser]);

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);
    axios.delete(`/api/items/${id}`, {
      headers: {
        'Authorization': `Bearer ${token || localStorage.getItem('authToken')}`
      }
    })
      .then(() => {
        toast.success('Item deleted successfully');
        setItems(items.filter(item => item.id !== id));
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
      .finally(() => {
        setDeletingId('');
      })
  }, [items, token]);

  const onEdit = useCallback((id: string) => {
    router.push(`/dashboard/edit/${id}`);
  }, [router]);

  const onToggleAvailability = useCallback((id: string, currentStatus: boolean) => {
    axios.put(`/api/items/${id}`, {
      available: !currentStatus
    }, {
      headers: {
        'Authorization': `Bearer ${token || localStorage.getItem('authToken')}`
      }
    })
      .then(() => {
        toast.success(`Item ${!currentStatus ? 'made available' : 'made unavailable'}`);
        setItems(items.map(item => 
          item.id === id ? { ...item, available: !currentStatus } : item
        ));
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
  }, [items, token]);

  const onAddReview = useCallback(async (order: any) => {
    try {
      // Get the first item ID from the order
      const itemId = order.itemIds && order.itemIds.length > 0 ? order.itemIds[0] : null;
      
      if (!itemId) {
        toast.error('No item found in this order');
        return;
      }

      // Check if user has already reviewed this item
      const userEmail = currentUser?.email || currentUser?.emailId;
      if (userEmail) {
        try {
          const checkResponse = await axios.get(`/api/reviews/check/${itemId}/${userEmail}`);
          if (checkResponse.data.hasReviewed) {
            toast.error('You have already reviewed this item');
            return;
          }
        } catch (error) {
          console.warn('Could not check for existing review:', error);
          // Continue with review submission even if check fails
        }
      }

      // Fetch item details
      const response = await axios.get(`/api/items/${itemId}/details`, {
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('authToken')}`
        }
      });

      if (response.data) {
        setSelectedItem(response.data);
        setSelectedOrder(order);
        setIsReviewModalOpen(true);
      } else {
        toast.error('Failed to fetch item details');
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast.error('Failed to fetch item details');
    }
  }, [token, currentUser]);

  if (loading) {
    return (
      <div className="py-20 min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-alibaba-orange mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-alibaba-black">Loading your dashboard...</p>
          <p className="text-alibaba-gray-600 mt-2">Fetching your latest data</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <ClientOnly>
          <EmptyState title="Unauthorized" subtitle="Please login to access your dashboard" />
        </ClientOnly>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header Section */}
      <div className="bg-alibaba-gray-50 shadow-sm border-b border-alibaba-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-alibaba-black">
                Welcome back, {currentUser?.firstName || currentUser?.name || 'User'}!
              </h1>
              <p className="text-alibaba-gray-600 mt-2">Manage your profile, listings, and bookings from here</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center px-4 py-2 bg-alibaba-orange/10 rounded-lg">
                <div className="text-2xl font-bold text-alibaba-orange">{items.length}</div>
                <div className="text-sm text-alibaba-gray-600">Listed Items</div>
              </div>
              <div className="text-center px-4 py-2 bg-alibaba-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-alibaba-black">{orders.length}</div>
                <div className="text-sm text-alibaba-gray-600">Orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-alibaba-orange to-orange-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <p className="text-orange-100">Your account details and settings</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaUser className="text-alibaba-orange text-lg" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="text-gray-900 text-lg">
                      {currentUser?.firstName && currentUser?.lastName 
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser?.name || 'Not provided'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaUserTag className="text-alibaba-orange text-lg" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">Username</label>
                    <div className="text-gray-900 text-lg">{currentUser?.username || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaEnvelope className="text-alibaba-orange text-lg" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <div className="text-gray-900 text-lg">{currentUser?.email || currentUser?.emailId || 'Not provided'}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaPhone className="text-alibaba-orange text-lg" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="text-gray-900 text-lg">{currentUser?.phoneNumber || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaVenusMars className="text-alibaba-orange text-lg" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">Gender</label>
                    <div className="text-gray-900 text-lg">{currentUser?.gender || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <FaBirthdayCake className="text-alibaba-orange text-lg" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <div className="text-gray-900 text-lg">{currentUser?.dateOfBirth || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Listed Items */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FaBox className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">My Listed Items</h2>
                  <p className="text-green-100">
                    You have {items.length} item{items.length !== 1 ? 's' : ''} listed for sale/rent
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/rent')}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <FaPlus className="text-lg" />
                <span>Add New Item</span>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBox className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No items listed yet</h3>
                <p className="text-gray-500 mb-6">Start earning by listing your first item for rent or sale</p>
                <button
                  onClick={() => router.push('/rent')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  List Your First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item: any) => (
                  <div key={item.id} className="relative group">
                    <div className="transform group-hover:scale-105 transition-transform duration-200">
                      <ListingCard
                        data={item}
                        currentUser={currentUser as any}
                      />
                    </div>
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                      <div className="flex flex-col gap-2 p-4">
                        <button
                          onClick={() => onEdit(item.id)}
                          className="bg-white text-alibaba-black px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-alibaba-gray-100 hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-alibaba-gray-200"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onToggleAvailability(item.id, item.available)}
                          className={`px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 hover:shadow-lg transform hover:scale-105 border-2 ${
                            item.available 
                              ? 'bg-alibaba-orange hover:bg-alibaba-orange-dark text-white border-alibaba-orange hover:border-alibaba-orange-dark' 
                              : 'bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600'
                          }`}
                        >
                          {item.available ? <FaToggleOff /> : <FaToggleOn />}
                          <span>{item.available ? "Disable" : "Enable"}</span>
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
                        >
                          <FaTrash />
                          <span>{deletingId === item.id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-bold shadow-lg
                        ${item.available 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                        }
                      `}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-lg">
                        {item.type || 'RENT'}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-lg">
                        Qty: {item.quantity || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rental Bookings */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Rental Bookings</h2>
                <p className="text-blue-100">
                  {reservations.length} booking{reservations.length !== 1 ? 's' : ''} on your items
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {reservationsError ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCalendarAlt className="text-3xl text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error loading bookings</h3>
                <p className="text-red-500 mb-2">{reservationsError}</p>
                <p className="text-sm text-gray-400">Please try refreshing the page</p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCalendarAlt className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-2">When someone books your items, they will appear here.</p>
                <p className="text-sm text-gray-400">Make sure your items are available and attractively priced!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation: any, index: number) => (
                  <div key={index} className="border-2 border-gray-100 hover:border-blue-200 rounded-xl p-6 transition-colors hover:bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">Booking #{index + 1}</h4>
                        <p className="text-gray-600 mt-1">Details will be available soon</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-semibold text-blue-600">Pending Setup</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Orders */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaBox className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">My Orders</h2>
                <p className="text-purple-100">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {ordersError ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBox className="text-3xl text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error loading orders</h3>
                <p className="text-red-500 mb-2">{ordersError}</p>
                <p className="text-sm text-gray-400">Please try refreshing the page</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBox className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-2">When you place orders, they will appear here.</p>
                <p className="text-sm text-gray-400">Start shopping to see your order history!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order: any) => (
                  <div key={order.id} className="border-2 border-gray-100 hover:border-purple-200 rounded-xl p-6 transition-colors hover:bg-purple-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">Order #{order.orderId}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === 'PLACED' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Amount: ₹{order.totalAmount}</p>
                        <p>Payment: <span className={`font-semibold ${
                          order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'
                        }`}>{order.paymentStatus}</span></p>
                        {order.transactionId && (
                          <p className="text-xs text-gray-500">Txn: {order.transactionId.substring(0, 8)}...</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onAddReview(order)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                        >
                          <FaStar size={12} />
                          Add Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Review Modal */}
      {selectedItem && selectedOrder && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedItem(null);
            setSelectedOrder(null);
          }}
          itemId={selectedItem.id}
          itemTitle={selectedItem.title}
          orderId={selectedOrder.orderId || selectedOrder.id}
          currentUser={currentUser}
          onReviewSubmitted={() => {
            toast.success('Review submitted successfully!');
            setIsReviewModalOpen(false);
            setSelectedItem(null);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default DashboardClient; 