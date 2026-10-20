"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import OrderTimeline from "@/components/orders/OrderTimeline";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingAnimation from "@/components/LoadingAnimation";

import {
  getOrder,
  getOrderItems,
} from "@/lib/orderService";

type OrderDetailsProps = {
  orderId: number;
};

type Order = {
  id: number;
  customer: string;
  email: string;
  phone: string;
  payment: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  courier?: string;
  tracking_number?: string;
  estimated_delivery?: string;
};

type OrderItem = {
  id: number;
  product_name: string;
  product_image: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
};

export default function OrderDetails({
  orderId,
}: OrderDetailsProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function loadOrder() {
      if (!user) return;

      try {
        const orderData = await getOrder(
          orderId,
          user.id
        );

        if (!orderData) {
          setLoading(false);
          return;
        }

        const orderItems =
          await getOrderItems(orderId);

        setOrder(orderData);
        setItems(orderItems);
      } catch (error) {
        console.error(
          "Failed to load order:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="flex min-h-screen items-center justify-center px-4 py-24">
          <LoadingAnimation size="lg" text="RETRIEVING ORDER" subtext="EXRONIX SECURE LOGISTICS" />
        </main>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <main className="flex min-h-screen items-center justify-center px-4 py-20 text-white">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 text-center text-white shadow-2xl sm:p-10">
            <div className="text-5xl">📦</div>

            <h1 className="mt-5 text-2xl font-black text-white sm:text-3xl">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm text-gray-400 sm:text-base">
              We couldn't find this order.
            </p>

            <Link
              href="/orders"
              className="mt-7 inline-flex rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
            >
              Back to Orders
            </Link>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8 text-white">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
                  ORDER DETAILS
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Order #{order.id}
                </h1>

                <p className="mt-2 text-sm text-gray-400 sm:text-base">
                  Placed on{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <Link
                href="/orders"
                className="inline-flex w-fit rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base"
              >
                ← Back to Orders
              </Link>

            </div>

          </div>

          {/* Order Timeline */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-5 shadow-2xl sm:p-8">
            <OrderTimeline
              status={order.status}
            />
          </div>

          {/* Main Grid */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

            {/* LEFT */}
            <div className="space-y-8">

              {/* Products */}
              <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-5 shadow-2xl sm:p-8 text-white">

                <h2 className="mb-6 text-xl font-bold text-white sm:mb-8 sm:text-2xl">
                  Ordered Items
                </h2>

                <div className="space-y-6">

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Product */}
                        <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">

                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={100}
                            height={100}
                            className="h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-[#080a0f] object-cover sm:h-24 sm:w-24"
                          />

                          <div className="min-w-0">

                            <h3 className="break-words text-base font-bold text-white sm:text-xl">
                              {item.product_name}
                            </h3>

                            <div className="mt-2 space-y-1 text-sm text-gray-400">
                              <p>
                                Size:{" "}
                                <span className="font-semibold text-gray-200">{item.size || "-"}</span>
                              </p>

                              <p>
                                Color:{" "}
                                <span className="font-semibold text-gray-200">{item.color || "-"}</span>
                              </p>

                              <p>
                                Qty:{" "}
                                <span className="font-semibold text-gray-200">{item.quantity}</span>
                              </p>
                            </div>

                          </div>

                        </div>

                        {/* Price */}
                        <p className="shrink-0 text-lg font-black text-white sm:text-xl">
                          NPR{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-8">

              {/* Order Summary */}
              <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-5 shadow-2xl sm:p-8 text-white">

                <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm sm:text-base">

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-400">
                      Customer
                    </span>

                    <span className="break-words text-right font-medium text-white">
                      {order.customer}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-400">
                      Email
                    </span>

                    <span className="max-w-[65%] break-all text-right font-medium text-white">
                      {order.email}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-400">
                      Phone
                    </span>

                    <span className="text-right font-medium text-white">
                      {order.phone}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-400">
                      Payment
                    </span>

                    <span className="text-right font-medium text-white">
                      {order.payment}
                    </span>
                  </div>

                  {/* Courier */}
                  {order.courier && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-gray-400">
                        Courier
                      </span>

                      <span className="text-right font-medium text-white">
                        {order.courier}
                      </span>
                    </div>
                  )}

                  {/* Tracking */}
                  {order.tracking_number && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-gray-400">
                        Tracking
                      </span>

                      <span className="break-all text-right font-medium text-[#1677FF]">
                        {order.tracking_number}
                      </span>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {order.estimated_delivery && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-gray-400">
                        Delivery
                      </span>

                      <span className="text-right font-medium text-white">
                        {new Date(
                          order.estimated_delivery
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <hr className="my-5 border-white/10" />

                  <div className="flex justify-between gap-4 text-gray-400">
                    <span>Subtotal</span>

                    <span className="font-semibold text-white">
                      NPR{" "}
                      {order.subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-gray-400">
                    <span>Shipping</span>

                    <span>
                      {order.shipping === 0 ? (
                        <span className="font-semibold text-emerald-400">
                          FREE
                        </span>
                      ) : (
                        <span className="font-semibold text-white">
                          NPR {order.shipping.toLocaleString()}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-2">

                    <div className="flex justify-between gap-4 text-lg font-bold sm:text-xl">
                      <span className="text-gray-200">Total</span>

                      <span className="text-right font-black text-white">
                        NPR{" "}
                        {order.total.toLocaleString()}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Help */}
              <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl p-5 shadow-2xl sm:p-6 text-white">

                <h3 className="font-bold text-white">
                  Need Help?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  If you have any questions about your precision
                  order, please contact EXRONIX support.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex rounded-xl bg-[#1677FF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1677FF]/90 shadow-[0_0_15px_rgba(22,119,255,0.35)]"
                >
                  Contact Support
                </Link>

              </div>

            </div>

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}