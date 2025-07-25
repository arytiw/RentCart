"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Button from "@/app/components/Button";
import useRentModal from "@/app/hooks/useRentModal";
import OrdersClient from "@/app/orders/OrdersClient";
import ReservationsClient from "@/app/reservations/ReservationsClient";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getUserItems from "@/app/actions/getUserItems";
import getOrders from "@/app/actions/getOrders";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import { FaEye, FaEnvelope, FaChartLine } from "react-icons/fa";
import { BsBarChart } from "react-icons/bs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO, getMonth, getYear, getWeek, getDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useUser } from '@/app/providers/UserProvider';
import FavoritesClient from "@/app/favorites/FavoritesClient";
import getFavoriteListings from "@/app/actions/getFavoriteListings";

interface DashboardClientProps {
  // No props required for now
}

const DashboardClient: React.FC<DashboardClientProps> = () => {
  const router = useRouter();
  const rentModal = useRentModal();
  const { token, user: currentUser } = useUser();
  const [deletingId, setDeletingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }
      const [userItems, userOrders] = await Promise.all([
        getUserItems(currentUser.email),
        getOrders()
      ]);
      setItems(userItems);
      setOrders(userOrders);
      setLoading(false);
    }
    fetchData();
  }, [token, currentUser]);

  useEffect(() => {
    async function fetchFavorites() {
      if (!token || !currentUser) return;
      const favs = await getFavoriteListings();
      setFavorites(favs);
    }
    fetchFavorites();
  }, [token, currentUser]);

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);
    axios.delete(`/api/items/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(() => {
        toast.success('Item deleted successfully');
        router.refresh();
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
      .finally(() => {
        setDeletingId('');
      })
  }, [router]);

  const onEdit = useCallback((id: string) => {
    router.push(`/dashboard/edit/${id}`);
  }, [router]);

  const onToggleAvailability = useCallback((id: string, currentStatus: boolean) => {
    axios.put(`/api/items/${id}`, {
      available: !currentStatus
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(() => {
        toast.success(`Item ${!currentStatus ? 'made available' : 'made unavailable'}`);
        router.refresh();
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
  }, [router]);

  // Aggregate orders by month, week, and day
  const now = new Date();
  const ordersByMonth: { [key: string]: number } = {};
  const inquiriesByMonth: { [key: string]: number } = {}; // Placeholder for future
  const viewsByMonth: { [key: string]: number } = {}; // Placeholder for future
  const ordersByWeek: { [key: string]: number } = {};
  const ordersByDay: { [key: string]: number } = {};
  const orderStatusCount: { [key: string]: number } = {};

  // Prepare arrays for charts
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fill with zeros for all months/days
  months.forEach(m => { ordersByMonth[m] = 0; });
  days.forEach(d => { ordersByDay[d] = 0; });

  // Group orders
  orders.forEach(order => {
    if (!order.orderDate) return;
    const date = new Date(order.orderDate);
    const month = months[getMonth(date)];
    ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
    // Weekly
    const week = `Week ${getWeek(date)}`;
    ordersByWeek[week] = (ordersByWeek[week] || 0) + 1;
    // Daily
    const day = days[getDay(date)];
    ordersByDay[day] = (ordersByDay[day] || 0) + 1;
    // Status
    orderStatusCount[order.status] = (orderStatusCount[order.status] || 0) + 1;
  });

  // Prepare chart data
  const monthlyActivity = months.map(month => ({
    month,
    orders: ordersByMonth[month],
    inquiries: 0, // TODO: real data
    views: 0 // TODO: real data
  }));
  const weekNumbers = Object.keys(ordersByWeek).sort();
  const weeklyActivity = weekNumbers.map(week => ({
    week,
    orders: ordersByWeek[week],
    inquiries: 0, // TODO: real data
    views: 0 // TODO: real data
  }));
  const dailyActivity = days.map(day => ({
    day,
    orders: ordersByDay[day],
    inquiries: 0, // TODO: real data
    views: 0 // TODO: real data
  }));
  const orderStatusData = Object.keys(orderStatusCount).map(status => ({
    name: status.charAt(0) + status.slice(1).toLowerCase(),
    value: orderStatusCount[status]
  }));
  const orderStatusColors = ['#f43f5e', '#22c55e', '#f59e42', '#3b82f6'];

  // Recent Activity Feed (latest 5 orders)
  const recentActivity = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5)
    .map(order => ({
      type: 'Order',
      item: order.orderId || order.id,
      time: order.orderDate ? format(new Date(order.orderDate), 'PPpp') : ''
    }));

  // Restore mock values for Activity Summary/Insights section
  const propertiesViewed = 12; // TODO: Connect to real data
  const inquiriesSent = 5; // TODO: Connect to real data
  const responseRate = 80; // TODO: Connect to real data
  const journeyStage = 3; // TODO: Connect to real data
  const journeyStages = [
    "Explore",
    "Shortlist",
    "Visit",
    "Negotiate",
    "Agreement",
    "Move-in"
  ];

  const hasContent = items.length > 0 || orders.length > 0 || favorites.length > 0;

  if (loading) {
    return <div className="py-20 text-center text-lg">Loading dashboard...</div>;
  }

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login to access your dashboard" />
      </ClientOnly>
    );
  }

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Heading
          title="No items listed yet"
          subtitle="Start by listing your first item!"
        />
        <div className="mt-6">
          <Button
            label="List Your First Item"
            onClick={rentModal.onOpen}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* User Profile Card */}
      <div className="flex items-center gap-6 bg-black rounded-xl p-6 mb-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-violet-900">
          <span className="text-5xl font-bold text-violet-400">
            {currentUser?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <div className="text-2xl font-semibold text-white">{currentUser?.name}</div>
          <div className="text-lg text-gray-400">{currentUser?.email}</div>
        </div>
      </div>
      {/* Activity Summary / Insights */}
      <div className="bg-white rounded-xl shadow p-6 mb-4 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <FaEye className="text-2xl text-rose-500" />
          <div className="text-lg font-semibold">{propertiesViewed}</div>
          <div className="text-xs text-gray-500">Properties viewed this month</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FaEnvelope className="text-2xl text-rose-500" />
          <div className="text-lg font-semibold">{inquiriesSent}</div>
          <div className="text-xs text-gray-500">Inquiries sent</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FaChartLine className="text-2xl text-rose-500" />
          <div className="text-lg font-semibold">{responseRate}%</div>
          <div className="text-xs text-gray-500">Response rate from owners</div>
        </div>
        <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
          <BsBarChart className="text-2xl text-rose-500 mb-1" />
          <div className="w-full flex flex-col items-center">
            <div className="flex w-full justify-between text-xs font-medium text-gray-600 mb-1">
              {journeyStages.map((stage, idx) => (
                <span key={stage} className={idx === journeyStage ? "text-rose-500 font-bold" : ""}>{stage}</span>
              ))}
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full relative">
              <div
                className="h-3 bg-rose-500 rounded-full transition-all"
                style={{ width: `${((journeyStage + 1) / journeyStages.length) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 w-full flex justify-between">
                {journeyStages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`block w-2 h-2 rounded-full ${idx <= journeyStage ? "bg-rose-500" : "bg-gray-300"} mt-0.5`}
                  ></span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Your renting journey</div>
          </div>
        </div>
      </div>
      {/* Welcome/Empty State */}
      {!hasContent && (
        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center text-center gap-4">
          <h2 className="text-2xl font-bold">Welcome to your Dashboard!</h2>
          <p className="text-gray-600">Start by browsing items, adding your own, or favoriting something you like.</p>
          <div className="flex gap-4 mt-4">
            <a href="/items" className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition">Browse Items</a>
            <button onClick={rentModal.onOpen} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">List Your First Item</button>
          </div>
        </div>
      )}
      {/* My Listed Items */}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <Heading
            title="My Listed Items"
            subtitle={`You have ${items.length} item${items.length !== 1 ? 's' : ''} listed`}
          />
          <Button
            label="Add New Item"
            onClick={rentModal.onOpen}
          />
        </div>
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
            pb-20
          "
        >
          {items.map((item: any) => (
            <div key={item.id} className="relative">
              <ListingCard
                data={item}
                currentUser={currentUser}
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Button
                  small
                  label="Edit"
                  onClick={() => onEdit(item.id)}
                  outline
                />
                <Button
                  small
                  label={item.available ? "Make Unavailable" : "Make Available"}
                  onClick={() => onToggleAvailability(item.id, item.available)}
                  outline
                />
                <Button
                  small
                  label="Delete"
                  onClick={() => onDelete(item.id)}
                  disabled={deletingId === item.id}
                  outline
                />
              </div>
              <div className="absolute top-4 right-4">
                <div className={`
                  px-2 py-1 rounded-full text-xs font-semibold
                  ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {item.available ? 'Available' : 'Unavailable'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Charts & Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Activity Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Monthly Activity</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#f43f5e" name="Orders" />
              <Bar dataKey="inquiries" fill="#3b82f6" name="Inquiries" />
              <Bar dataKey="views" fill="#22c55e" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Order Status Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {orderStatusData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={orderStatusColors[idx % orderStatusColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Weekly Activity</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#f43f5e" name="Orders" />
              <Line type="monotone" dataKey="inquiries" stroke="#3b82f6" name="Inquiries" />
              <Line type="monotone" dataKey="views" stroke="#22c55e" name="Views" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Daily Activity</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#f43f5e" name="Orders" />
              <Bar dataKey="inquiries" fill="#3b82f6" name="Inquiries" />
              <Bar dataKey="views" fill="#22c55e" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl shadow p-4 mt-8">
        <div className="font-semibold mb-2">Recent Activity Feed</div>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="py-2 flex items-center gap-4">
              <span className="inline-block px-2 py-1 rounded bg-rose-100 text-rose-600 text-xs font-semibold">
                {activity.type}
              </span>
              <span className="font-medium">{activity.item}</span>
              <span className="ml-auto text-xs text-gray-400">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* My Orders */}
      <div>
        <OrdersClient orders={orders} currentUser={currentUser} />
      </div>
      {/* Rentals */}
      <div>
        <ReservationsClient reservations={[]} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default DashboardClient; 