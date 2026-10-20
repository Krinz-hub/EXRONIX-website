"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
} from "lucide-react";

import { getMyOrders } from "@/lib/orderService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingAnimation from "@/components/LoadingAnimation";

type Order = {
  id: number;
  customer: string;
  phone: string;
  payment: string;
  status: string;
  total: number;
  created_at: string;
};

export default function OrdersPage() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoadingOrders(false);
        return;
      }

      try {
        const data = await getMyOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (!loading) {
      loadOrders();
    }
  }, [user, loading]);

  function getStatusStyle(status: string) {
    switch (status) {
      case "Pending":
        return "border border-amber-500/30 bg-amber-500/15 text-amber-300";

      case "Confirmed":
        return "border border-[#1677FF]/40 bg-[#1677FF]/15 text-[#1677FF]";

      case "Processing":
        return "border border-orange-500/30 bg-orange-500/15 text-orange-300";

      case "Shipped":
        return "border border-purple-500/30 bg-purple-500/15 text-purple-300";

      case "Delivered":
        return "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300";

      case "Cancelled":
        return "border border-red-500/30 bg-red-500/15 text-red-300";

      default:
        return "border border-white/15 bg-white/10 text-gray-300";
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-20 text-white">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
              EXRONIX ACCOUNT
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Track and manage all your precision additive manufacturing purchases.
            </p>
          </div>

          {/* Loading */}
          {loadingOrders ? (
            <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass p-10 text-center backdrop-blur-xl sm:p-16">
              <LoadingAnimation size="md" text="RETRIEVING ORDERS" />
            </div>

          ) : orders.length === 0 ? (

            /* Empty Orders */
            <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl px-5 py-12 text-center text-white shadow-2xl sm:p-16">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#1677FF]">
                <Package
                  size={42}
                  className="text-[#1677FF]"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm text-gray-400 sm:text-base">
                Start shopping and your precision orders will appear here.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-[#1677FF] px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 sm:w-auto"
              >
                Shop Now
              </Link>

            </div>

          ) : (

            /* Orders */
            <div className="space-y-4 sm:space-y-5">

              {orders.map((order) => (

                <div
                  key={order.id}
                  className="w-full rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-5 shadow-2xl transition hover:border-[#1677FF]/40 sm:p-6 md:p-8 text-white"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">

                    {/* Left */}
                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                          Order #{order.id}
                        </h2>

                        {/* Mobile Status */}
                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold sm:px-4 sm:py-2 sm:text-xs md:hidden ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </div>

                      {/* Order Information */}
                      <div className="mt-4 space-y-3 text-sm text-gray-400 sm:mt-5 md:flex md:flex-wrap md:gap-6 md:space-y-0">

                        <div className="flex min-w-0 items-start gap-2">
                          <Calendar
                            size={17}
                            className="mt-0.5 shrink-0 text-[#1677FF]"
                          />

                          <span className="break-words text-gray-300">
                            {new Date(
                              order.created_at
                            ).toLocaleString("en-NP", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={17}
                            className="shrink-0 text-[#1677FF]"
                          />

                          <span className="break-words text-gray-300">
                            {order.payment}
                          </span>
                        </div>

                      </div>

                    </div>

                    {/* Right */}
                    <div className="border-t border-white/10 pt-4 md:border-none md:pt-0 md:text-right">

                      <p className="text-xl font-black text-white sm:text-2xl">
                        NPR {order.total.toLocaleString()}
                      </p>

                      {/* Desktop Status */}
                      <span
                        className={`mt-3 hidden rounded-full px-4 py-1.5 text-xs font-bold md:inline-block ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {/* View Details */}
                      <Link
                        href={`/orders/${order.id}`}
                        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 sm:mt-5 sm:text-base md:inline-flex md:w-auto"
                      >
                        View Details
                        <ChevronRight size={18} />
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>
      </main>
    </ProtectedRoute>
  );
}