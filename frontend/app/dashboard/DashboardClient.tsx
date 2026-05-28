"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ListingCard from "@/app/components/listings/ListingCard";

import getUserItems from "@/app/actions/getUserItems";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import { useUser } from "@/app/providers/UserProvider";
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiPlus, FiEdit2, FiToggleRight,
  FiToggleLeft, FiTrash2, FiPackage, FiBox, FiStar, FiArrowRight, FiTag,
} from "react-icons/fi";
import { cn } from "@/app/lib/cn";
import ReviewModal from "@/app/components/modals/ReviewModal";

const DashboardClient: React.FC = () => {
  const router = useRouter();
  const { token, user: currentUser } = useUser();
  const [deletingId, setDeletingId] = useState("");
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
      if (!token || !currentUser) {
        setLoading(false);
        return;
      }
      if (!token.startsWith("Bearer ") && !token.includes(".")) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const userEmail = currentUser.email || currentUser.emailId;
      if (!userEmail) {
        setLoading(false);
        return;
      }
      try {
        const userItems = await getUserItems(userEmail);
        setItems(userItems);

        const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        const res = await fetch("/api/reservations", {
          headers: { Authorization: authToken, "Content-Type": "application/json" },
        });
        if (res.ok) {
          setReservations(await res.json());
          setReservationsError(null);
        } else {
          setReservations([]);
          setReservationsError(`Failed to load reservations (${res.status})`);
        }

        const ordersRes = await fetch("/api/orders", {
          headers: { Authorization: authToken, "Content-Type": "application/json" },
        });
        if (ordersRes.ok) {
          setOrders(await ordersRes.json());
          setOrdersError(null);
        } else {
          setOrders([]);
          setOrdersError(`Failed to load orders (${ordersRes.status})`);
        }
      } catch (error) {
        setReservations([]);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, currentUser]);

  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      axios
        .delete(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("authToken")}` },
        })
        .then(() => {
          toast.success("Item deleted");
          setItems(items.filter((i) => i.id !== id));
        })
        .catch(() => toast.error("Something went wrong."))
        .finally(() => setDeletingId(""));
    },
    [items, token]
  );

  const onEdit = useCallback((id: string) => router.push(`/dashboard/edit/${id}`), [router]);

  const onToggleAvailability = useCallback(
    (id: string, currentStatus: boolean) => {
      axios
        .put(
          `/api/items/${id}`,
          { available: !currentStatus },
          { headers: { Authorization: `Bearer ${token || localStorage.getItem("authToken")}` } }
        )
        .then(() => {
          toast.success(`Item ${!currentStatus ? "enabled" : "disabled"}`);
          setItems(items.map((i) => (i.id === id ? { ...i, available: !currentStatus } : i)));
        })
        .catch(() => toast.error("Something went wrong."));
    },
    [items, token]
  );

  const onAddReview = useCallback(
    async (order: any) => {
      try {
        const itemId = order.itemIds && order.itemIds.length > 0 ? order.itemIds[0] : null;
        if (!itemId) {
          toast.error("No item found in this order");
          return;
        }
        const userEmail = currentUser?.email || currentUser?.emailId;
        if (userEmail) {
          try {
            const checkResponse = await axios.get(`/api/reviews/check/${itemId}/${userEmail}`);
            if (checkResponse.data.hasReviewed) {
              toast.error("You have already reviewed this item");
              return;
            }
          } catch {
            // best-effort
          }
        }
        const response = await axios.get(`/api/items/${itemId}/details`, {
          headers: { Authorization: `Bearer ${token || localStorage.getItem("authToken")}` },
        });
        if (response.data) {
          setSelectedItem(response.data);
          setSelectedOrder(order);
          setIsReviewModalOpen(true);
        } else {
          toast.error("Failed to fetch item details");
        }
      } catch {
        toast.error("Failed to fetch item details");
      }
    },
    [token, currentUser]
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center" data-testid="dashboard-loading">
        <div className="text-center">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-ink-100" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin" />
          </div>
          <p className="mt-4 text-sm font-medium text-ink-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please log in to access your dashboard." />
      </ClientOnly>
    );
  }

  return (
    <div className="min-h-screen bg-cream" data-testid="dashboard-page">
      {/* Header */}
      <section className="relative border-b border-ink-100 bg-white">
        <div className="absolute inset-0 bg-radial-brand opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-2">
                Dashboard
              </p>
              <h1 className="font-display font-semibold text-3xl md:text-4xl tracking-tighter2 text-ink">
                Welcome back, {currentUser?.firstName || currentUser?.name || "friend"} 👋
              </h1>
              <p className="mt-2 text-ink-500 max-w-xl">
                Manage your profile, listings, bookings and orders — all in one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Stat label="Listed items" value={items.length} accent />
              <Stat label="Orders" value={orders.length} />
              <Stat label="Bookings" value={reservations.length} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 space-y-10">
        {/* Profile */}
        <SectionCard
          eyebrow="Account"
          title="Profile information"
          icon={<FiUser />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ProfileRow icon={<FiUser />} label="Full name" value={
              currentUser?.firstName && currentUser?.lastName
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : currentUser?.name || "—"
            } />
            <ProfileRow icon={<FiTag />} label="Username" value={currentUser?.username || "—"} />
            <ProfileRow icon={<FiMail />} label="Email" value={currentUser?.email || currentUser?.emailId || "—"} />
            <ProfileRow icon={<FiPhone />} label="Phone" value={currentUser?.phoneNumber || "—"} />
            <ProfileRow icon={<FiUser />} label="Gender" value={currentUser?.gender || "—"} />
            <ProfileRow icon={<FiCalendar />} label="Date of birth" value={currentUser?.dateOfBirth || "—"} />
          </div>
        </SectionCard>

        {/* Listed Items */}
        <SectionCard
          eyebrow="Listings"
          title="My listed items"
          subtitle={`${items.length} item${items.length !== 1 ? "s" : ""} you're renting out`}
          icon={<FiBox />}
          action={
            <button
              onClick={() => router.push("/rent")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-600 hover:shadow-glow transition-all"
              data-testid="dashboard-add-item"
            >
              <FiPlus size={16} /> Add new item
            </button>
          }
        >
          {items.length === 0 ? (
            <EmptyBlock
              icon={<FiBox size={22} />}
              title="No items listed yet"
              copy="Start earning by listing your first item."
              ctaLabel="List your first item"
              onClick={() => router.push("/rent")}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((item: any) => (
                <div key={item.id} className="group relative" data-testid={`dashboard-item-${item.id}`}>
                  <ListingCard data={item} currentUser={currentUser as any} />

                  {/* Hover actions overlay */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[4/5] rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto flex flex-col items-center justify-center gap-2 p-3">
                      <button onClick={() => onEdit(item.id)} className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-white text-ink text-sm font-semibold hover:bg-cream-200">
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => onToggleAvailability(item.id, item.available)}
                        className={cn(
                          "w-full inline-flex items-center justify-center gap-2 h-10 rounded-full text-sm font-semibold",
                          item.available ? "bg-brand text-white hover:bg-brand-600" : "bg-emerald-500 text-white hover:bg-emerald-600"
                        )}
                      >
                        {item.available ? <FiToggleLeft size={14} /> : <FiToggleRight size={14} />}
                        {item.available ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
                      >
                        <FiTrash2 size={14} />
                        {deletingId === item.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* Status chips */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.available ? "bg-emerald-500/95 text-white" : "bg-red-500/95 text-white"
                    )}>
                      {item.available ? "Available" : "Hidden"}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ink/85 text-white">
                      Qty {item.quantity || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Rental Bookings */}
        <SectionCard
          eyebrow="Incoming"
          title="Rental bookings"
          subtitle={`${reservations.length} booking${reservations.length !== 1 ? "s" : ""} on your items`}
          icon={<FiCalendar />}
        >
          {reservationsError ? (
            <ErrorBlock title="Error loading bookings" detail={reservationsError} />
          ) : reservations.length === 0 ? (
            <EmptyBlock icon={<FiCalendar size={22} />} title="No bookings yet" copy="When someone books your items, you'll see them here." />
          ) : (
            <div className="space-y-3">
              {reservations.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-ink-100 hover:border-ink-200 bg-white p-5 transition-colors">
                  <div>
                    <h4 className="font-display font-semibold text-ink">Booking #{i + 1}</h4>
                    <p className="text-sm text-ink-500 mt-0.5">Details available soon</p>
                  </div>
                  <span className="chip bg-amber-100 text-amber-800 border border-amber-200">Pending</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* My Orders */}
        <SectionCard
          eyebrow="Activity"
          title="My orders"
          subtitle={`${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
          icon={<FiPackage />}
        >
          {ordersError ? (
            <ErrorBlock title="Error loading orders" detail={ordersError} />
          ) : orders.length === 0 ? (
            <EmptyBlock icon={<FiPackage size={22} />} title="No orders yet" copy="Start renting and your order history will appear here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders.map((order: any) => (
                <div key={order.id} className="rounded-2xl border border-ink-100 hover:border-ink-200 bg-white p-5 transition-colors" data-testid={`order-${order.orderId}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Order</p>
                      <p className="font-display font-semibold text-ink">#{order.orderId}</p>
                    </div>
                    <OrderStatus status={order.status} />
                  </div>

                  <div className="mt-4 space-y-1 text-sm">
                    <div className="flex justify-between text-ink-600">
                      <span>Amount</span>
                      <span className="font-semibold text-ink">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-ink-600">
                      <span>Payment</span>
                      <span className={cn("font-semibold", order.paymentStatus === "PAID" ? "text-emerald-600" : "text-red-600")}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    {order.transactionId && (
                      <div className="flex justify-between text-ink-500">
                        <span>Txn</span>
                        <span className="font-mono text-xs">{order.transactionId.substring(0, 10)}…</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onAddReview(order)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 h-9 rounded-full bg-cream-200 hover:bg-ink hover:text-white text-ink text-sm font-semibold transition-all"
                  >
                    <FiStar size={14} /> Add review
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

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
            toast.success("Review submitted!");
            setIsReviewModalOpen(false);
            setSelectedItem(null);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

/* ---------------- Small inline components ---------------- */

const Stat: React.FC<{ label: string; value: number | string; accent?: boolean }> = ({
  label, value, accent,
}) => (
  <div
    className={cn(
      "rounded-2xl border px-4 py-3 min-w-[110px]",
      accent ? "bg-brand/10 border-brand/20" : "bg-white border-ink-100"
    )}
  >
    <div className={cn("font-display font-bold text-2xl", accent ? "text-brand" : "text-ink")}>
      {value}
    </div>
    <div className="text-[11px] uppercase tracking-wider text-ink-500 mt-0.5">{label}</div>
  </div>
);

const SectionCard: React.FC<{
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ eyebrow, title, subtitle, icon, action, children }) => (
  <section className="rounded-3xl bg-white border border-ink-100 shadow-soft overflow-hidden">
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 p-6 md:p-8 border-b border-ink-100">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200 text-brand">
          {icon}
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
          <h2 className="font-display font-semibold text-xl md:text-2xl tracking-tighter2 text-ink mt-1">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
    <div className="p-6 md:p-8">{children}</div>
  </section>
);

const ProfileRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon, label, value,
}) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-100/70 border border-ink-100">
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-ink-100 text-brand">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="text-sm text-ink font-medium truncate">{value}</p>
    </div>
  </div>
);

const EmptyBlock: React.FC<{
  icon: React.ReactNode;
  title: string;
  copy: string;
  ctaLabel?: string;
  onClick?: () => void;
}> = ({ icon, title, copy, ctaLabel, onClick }) => (
  <div className="text-center py-10">
    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200 text-ink-400">
      {icon}
    </div>
    <h3 className="mt-5 font-display font-semibold text-ink text-lg">{title}</h3>
    <p className="mt-1 text-sm text-ink-500">{copy}</p>
    {ctaLabel && onClick && (
      <button
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-600 hover:shadow-glow transition-all"
      >
        {ctaLabel} <FiArrowRight size={14} />
      </button>
    )}
  </div>
);

const ErrorBlock: React.FC<{ title: string; detail: string }> = ({ title, detail }) => (
  <div className="text-center py-10">
    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
      !
    </div>
    <h3 className="mt-5 font-display font-semibold text-ink text-lg">{title}</h3>
    <p className="mt-1 text-sm text-red-500">{detail}</p>
    <p className="text-xs text-ink-400 mt-1">Please refresh the page.</p>
  </div>
);

const OrderStatus: React.FC<{ status?: string }> = ({ status }) => {
  const map: Record<string, string> = {
    PLACED: "bg-amber-100 text-amber-800 border border-amber-200",
    DELIVERED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  };
  return (
    <span className={cn("chip", map[status || ""] || "bg-ink-100 text-ink-700 border border-ink-200")}>
      {status || "Pending"}
    </span>
  );
};

export default DashboardClient;
