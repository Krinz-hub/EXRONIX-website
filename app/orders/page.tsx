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
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Processing":
        return "bg-orange-100 text-orange-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-100 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl font-bold sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Track and manage all your purchases.
            </p>
          </div>

          {/* Loading */}
          {loadingOrders ? (
            <div className="rounded-2xl liquid-glass border border-white/15 p-10 text-center backdrop-blur-xl sm:p-16">
              <LoadingAnimation size="md" text="RETRIEVING ORDERS" />
            </div>

          ) : orders.length === 0 ? (

            /* Empty Orders */
            <div className="rounded-2xl bg-white px-5 py-12 text-center shadow sm:p-16">

              <Package
                size={60}
                className="mx-auto text-gray-400 sm:h-[70px] sm:w-[70px]"
              />

              <h2 className="mt-5 text-2xl font-bold sm:mt-6 sm:text-3xl">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 sm:text-base">
                Start shopping and your orders will appear here.
              </p>

              <Link
                href="/collections"
                className="mt-7 inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-black px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800 sm:mt-8 sm:w-auto sm:px-8 sm:py-4"
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
                  className="w-full rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6 md:p-8"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">

                    {/* Left */}
                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
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
                      <div className="mt-4 space-y-3 text-sm text-gray-600 sm:mt-5 md:flex md:flex-wrap md:gap-6 md:space-y-0">

                        <div className="flex min-w-0 items-start gap-2">
                          <Calendar
                            size={17}
                            className="mt-0.5 shrink-0"
                          />

                          <span className="break-words">
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
                            className="shrink-0"
                          />

                          <span className="break-words">
                            {order.payment}
                          </span>
                        </div>

                      </div>

                    </div>

                    {/* Right */}
                    <div className="border-t pt-4 md:border-none md:pt-0 md:text-right">

                      <p className="text-xl font-bold sm:text-2xl">
                        NPR {order.total.toLocaleString()}
                      </p>

                      {/* Desktop Status */}
                      <span
                        className={`mt-3 hidden rounded-full px-4 py-2 text-sm font-semibold md:inline-block ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      {/* View Details */}
                      <Link
                        href={`/orders/${order.id}`}
                        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:mt-5 sm:text-base md:inline-flex md:w-auto"
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