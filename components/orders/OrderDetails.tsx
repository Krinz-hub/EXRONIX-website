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
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow sm:p-10">
            <div className="text-5xl">📦</div>

            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Order Not Found
            </h1>

            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              We couldn't find this order.
            </p>

            <Link
              href="/orders"
              className="mt-7 inline-flex rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
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
      <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Order #{order.id}
                </h1>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Placed on{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <Link
                href="/orders"
                className="inline-flex w-fit rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 sm:text-base"
              >
                ← Back to Orders
              </Link>

            </div>

          </div>

          {/* Order Timeline */}
          <div className="mb-8 overflow-hidden rounded-2xl bg-white p-5 shadow sm:p-8">
            <OrderTimeline
              status={order.status}
            />
          </div>

          {/* Main Grid */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

            {/* LEFT */}
            <div className="space-y-8">

              {/* Products */}
              <div className="rounded-2xl bg-white p-5 shadow sm:p-8">

                <h2 className="mb-6 text-xl font-bold sm:mb-8 sm:text-2xl">
                  Ordered Items
                </h2>

                <div className="space-y-6">

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Product */}
                        <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">

                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={100}
                            height={100}
                            className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                          />

                          <div className="min-w-0">

                            <h3 className="break-words text-base font-bold sm:text-xl">
                              {item.product_name}
                            </h3>

                            <div className="mt-2 space-y-1 text-sm text-gray-500">
                              <p>
                                Size:{" "}
                                {item.size || "-"}
                              </p>

                              <p>
                                Color:{" "}
                                {item.color || "-"}
                              </p>

                              <p>
                                Qty:{" "}
                                {item.quantity}
                              </p>
                            </div>

                          </div>

                        </div>

                        {/* Price */}
                        <p className="shrink-0 text-lg font-bold sm:text-xl">
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
              <div className="rounded-2xl bg-white p-5 shadow sm:p-8">

                <h2 className="mb-6 text-xl font-bold sm:text-2xl">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm sm:text-base">

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-500">
                      Customer
                    </span>

                    <span className="break-words text-right font-medium">
                      {order.customer}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-500">
                      Email
                    </span>

                    <span className="max-w-[65%] break-all text-right font-medium">
                      {order.email}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-500">
                      Phone
                    </span>

                    <span className="text-right font-medium">
                      {order.phone}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-500">
                      Payment
                    </span>

                    <span className="text-right font-medium">
                      {order.payment}
                    </span>
                  </div>

                  {/* Courier */}
                  {order.courier && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-gray-500">
                        Courier
                      </span>

                      <span className="text-right font-medium">
                        {order.courier}
                      </span>
                    </div>
                  )}

                  {/* Tracking */}
                  {order.tracking_number && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-gray-500">
                        Tracking
                      </span>

                      <span className="break-all text-right font-medium">
                        {order.tracking_number}
                      </span>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {order.estimated_delivery && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="shrink-0 text-gray-500">
                        Delivery
                      </span>

                      <span className="text-right font-medium">
                        {new Date(
                          order.estimated_delivery
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <hr className="my-5" />

                  <div className="flex justify-between gap-4">
                    <span>Subtotal</span>

                    <span>
                      NPR{" "}
                      {order.subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Shipping</span>

                    <span>
                      {order.shipping === 0 ? (
                        <span className="font-semibold text-green-600">
                          FREE
                        </span>
                      ) : (
                        `NPR ${order.shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <hr />

                  <div className="flex justify-between gap-4 pt-2 text-lg font-bold sm:text-xl">
                    <span>Total</span>

                    <span className="text-right">
                      NPR{" "}
                      {order.total.toLocaleString()}
                    </span>
                  </div>

                </div>

              </div>

              {/* Help */}
              <div className="rounded-2xl border bg-white p-5 shadow sm:p-6">

                <h3 className="font-bold">
                  Need Help?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  If you have any questions about your
                  order, please contact EXRONIX support.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex rounded-lg bg-[#1677FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1677FF]/90 shadow-[0_0_15px_rgba(22,119,255,0.3)]"
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