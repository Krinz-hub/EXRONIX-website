"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/orderService";

import { toast } from "sonner";

import { getDefaultAddress } from "@/lib/addressService";

import {
  getShippingRates,
  getShippingRate,
} from "@/lib/shippingService";

import { increaseCouponUsage } from "@/lib/couponService";

import { getProductById } from "@/lib/productService";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

type CheckoutItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
};

export default function CheckoutPage() {
  const { user } = useAuth();

  const router = useRouter();

  const { cart, clearCart } = useCart();

  /* =========================================
     BUY NOW
  ========================================= */

  const [buyNowItem, setBuyNowItem] =
    useState<CheckoutItem | null>(null);

  const [checkoutReady, setCheckoutReady] =
    useState(false);

  /* =========================================
     IMPORTANT:
     PREVENT DOUBLE ORDER SUBMISSION
  ========================================= */

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  useEffect(() => {
    const savedBuyNow =
      localStorage.getItem("zayna-buy-now");

    if (savedBuyNow) {
      try {
        const parsed = JSON.parse(savedBuyNow);

        if (
          parsed &&
          parsed.id &&
          parsed.quantity
        ) {
          setBuyNowItem(parsed);
        }
      } catch (error) {
        console.error(
          "Failed to read Buy Now item:",
          error
        );

        localStorage.removeItem(
          "zayna-buy-now"
        );
      }
    }

    setCheckoutReady(true);
  }, []);

  /*
   * If Buy Now exists, checkout ONLY that item.
   * Otherwise use the normal cart.
   */

  const checkoutItems: CheckoutItem[] =
    buyNowItem
      ? [buyNowItem]
      : cart;

  /* =========================================
     SHIPPING
  ========================================= */

  const [shippingRates, setShippingRates] =
    useState<any[]>([]);

  const [shippingPrice, setShippingPrice] =
    useState(170);

  const [estimatedDelivery, setEstimatedDelivery] =
    useState("");

  const [selectedProvince, setSelectedProvince] =
    useState("");

  /* =========================================
     COUPON
  ========================================= */

  const [discount, setDiscount] = useState(0);

  const [couponCode, setCouponCode] =
    useState("");

  /* =========================================
     FORM
  ========================================= */

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    payment: "Cash on Delivery",
  });

  /* =========================================
     SUBTOTAL
  ========================================= */

  const subtotal = checkoutItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  /* =========================================
     LOAD SHIPPING RATES
  ========================================= */

  useEffect(() => {
    async function loadShipping() {
      try {
        const rates =
          await getShippingRates();

        setShippingRates(rates);

        if (rates.length > 0) {
          setSelectedProvince(
            rates[0].province
          );
        }
      } catch (error) {
        console.error(
          "Failed to load shipping rates:",
          error
        );
      }
    }

    loadShipping();
  }, []);

  /* =========================================
     UPDATE SHIPPING
  ========================================= */

  useEffect(() => {
    async function updateShipping() {
      if (!selectedProvince) return;

      try {
        const rate =
          await getShippingRate(
            selectedProvince
          );

        if (!rate) return;

        if (
          subtotal >=
          rate.free_shipping_over
        ) {
          setShippingPrice(0);
        } else {
          setShippingPrice(rate.price);
        }

        setEstimatedDelivery(
          rate.estimated_days
        );
      } catch (error) {
        console.error(
          "Failed to update shipping:",
          error
        );
      }
    }

    updateShipping();
  }, [
    selectedProvince,
    subtotal,
  ]);

  const shipping = shippingPrice;

  const total =
    subtotal +
    shipping -
    discount;

  /* =========================================
     LOAD DEFAULT ADDRESS
  ========================================= */

  useEffect(() => {
    async function loadDefaultAddress() {
      if (!user) return;

      try {
        const address =
          await getDefaultAddress(
            user.id
          );

        if (!address) return;

        setForm((prev) => ({
          ...prev,

          fullName:
            address.full_name,

          email:
            user.email || "",

          phone:
            address.phone,

          address:
            address.address,

          city:
            address.city,

          postalCode:
            address.postal_code || "",

          payment:
            prev.payment,
        }));

        setSelectedProvince(
          address.province
        );
      } catch (error) {
        console.error(
          "Failed to load default address:",
          error
        );
      }
    }

    loadDefaultAddress();
  }, [user]);

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================================
     LOAD COUPON
  ========================================= */

  useEffect(() => {
    const savedCoupon =
      localStorage.getItem(
        "zayna-coupon"
      );

    if (!savedCoupon) {
      setCouponCode("");
      setDiscount(0);
      return;
    }

    try {
      const coupon =
        JSON.parse(savedCoupon);

      setCouponCode(
        coupon.code
      );

      let discountAmount = 0;

      if (
        coupon.type ===
        "percentage"
      ) {
        discountAmount =
          subtotal *
          (coupon.value / 100);
      } else {
        discountAmount =
          coupon.value;
      }

      /*
       * Don't allow discount to exceed subtotal.
       */

      discountAmount =
        Math.min(
          discountAmount,
          subtotal
        );

      setDiscount(
        discountAmount
      );
    } catch (error) {
      console.error(
        "Invalid coupon:",
        error
      );

      localStorage.removeItem(
        "zayna-coupon"
      );

      setCouponCode("");
      setDiscount(0);
    }
  }, [subtotal]);

  /* =========================================
     PLACE ORDER
  ========================================= */

  async function placeOrder() {
    /*
      IMPORTANT:
      Prevent multiple clicks.

      If an order is already being processed,
      do absolutely nothing.
    */

    if (isPlacingOrder) {
      return;
    }

    if (!user) {
      toast.error(
        "Please login to continue."
      );

      router.push("/login");
      return;
    }

    if (!checkoutReady) {
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error(
        "Your cart is empty."
      );

      router.push(
        "/collections"
      );

      return;
    }

    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city
    ) {
      toast.error(
        "Please fill in all required fields."
      );

      return;
    }

    /*
      Lock the button BEFORE checking
      stock / creating the order.
    */

    setIsPlacingOrder(true);

    try {
      /* =========================================
         VERIFY STOCK
      ========================================= */

      for (const item of checkoutItems) {
        const latestProduct =
          await getProductById(
            item.id
          );

        if (!latestProduct) {
          throw new Error(
            `${item.name} no longer exists.`
          );
        }

        const currentStock =
          Number(
            latestProduct.stock ?? 0
          );

        const requestedQuantity =
          Number(
            item.quantity ?? 0
          );

        if (currentStock <= 0) {
          throw new Error(
            `${item.name} is out of stock.`
          );
        }

        if (
          requestedQuantity <= 0
        ) {
          throw new Error(
            `Invalid quantity for ${item.name}.`
          );
        }

        if (
          requestedQuantity >
          currentStock
        ) {
          throw new Error(
            `${item.name}: Only ${currentStock} left in stock.`
          );
        }
      }

      /* =========================================
         CREATE ORDER

         IMPORTANT:
         createOrder() is the ONLY place that
         reduces product stock.

         DO NOT call decreaseProductStock()
         here.
      ========================================= */

      const order =
        await createOrder({
          user_id: user.id,

          customer:
            form.fullName,

          email:
            user.email || "",

          phone:
            form.phone,

          address:
            `${form.address}, ${form.city}, ${selectedProvince}, ${form.postalCode}`,

          province:
            selectedProvince,

          estimated_delivery:
            estimatedDelivery,

          items:
            checkoutItems,

          subtotal,

          shipping,

          total,

          payment:
            form.payment,

          status:
            "Pending",
        });

      /* =========================================
         COUPON USAGE
      ========================================= */

      const savedCoupon =
        localStorage.getItem(
          "zayna-coupon"
        );

      if (savedCoupon) {
        try {
          const coupon =
            JSON.parse(
              savedCoupon
            );

          await increaseCouponUsage(
            coupon.id
          );
        } catch (error) {
          console.error(
            "Coupon usage update failed:",
            error
          );
        }

        localStorage.removeItem(
          "zayna-coupon"
        );

        setCouponCode("");
        setDiscount(0);
      }

      /* =========================================
         SEND EMAIL
      ========================================= */

      try {
        await fetch(
          "/api/send-order-email",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer:
                form.fullName,

              email:
                user.email,

              orderId:
                order.id,

              total,

              payment:
                form.payment,

              address:
                `${form.address}, ${form.city}, ${selectedProvince}, ${form.postalCode}`,

              items:
                checkoutItems.map(
                  (item) => ({
                    product_name:
                      item.name,

                    quantity:
                      item.quantity,

                    price:
                      item.price,
                  })
                ),
            }),
          }
        );
      } catch (error) {
        /*
          Email failure should NOT cancel
          the successfully-created order.
        */

        console.error(
          "Failed to send confirmation email:",
          error
        );
      }

      /* =========================================
         CLEAR CART

         BUY NOW:
         Do NOT clear normal cart.

         NORMAL CART:
         Clear cart after successful order.
      ========================================= */

      if (buyNowItem) {
        localStorage.removeItem(
          "zayna-buy-now"
        );
      } else {
        await clearCart();
      }

      toast.success(
        "Order placed successfully!"
      );

      router.push(
        "/checkout/success"
      );
    } catch (error: any) {
      console.error(
        "Place order error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to place order. Please try again."
      );

      /*
        Unlock button if the order failed.

        This allows the customer to try again.
      */

      setIsPlacingOrder(false);
    }
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 pb-12 pt-24 md:pb-20 md:pt-36">

        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">

          {/* =================================
              SHIPPING
          ================================= */}

          <div className="rounded-2xl bg-white p-5 shadow md:p-8">

            <h1 className="mb-6 text-2xl font-bold md:mb-8 md:text-3xl">
              Checkout
            </h1>

            <div className="space-y-5">

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-xl border p-3 text-base md:p-4"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-xl border p-3 text-base md:p-4"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full rounded-xl border p-3 text-base md:p-4"
              />

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full rounded-xl border p-3 text-base md:p-4"
              />

              <select
                value={selectedProvince}
                onChange={(e) =>
                  setSelectedProvince(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-3 text-base md:p-4"
              >
                {shippingRates.map(
                  (rate) => (
                    <option
                      key={rate.id}
                      value={
                        rate.province
                      }
                    >
                      {rate.province}
                    </option>
                  )
                )}
              </select>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full rounded-xl border p-3 text-base md:p-4"
              />

              <input
                name="postalCode"
                value={
                  form.postalCode
                }
                onChange={handleChange}
                placeholder="Postal Code"
                className="w-full rounded-xl border p-3 text-base md:p-4"
              />

            </div>

            {/* Payment */}

            <h2 className="mb-4 mt-10 text-xl font-bold">
              Payment Method
            </h2>

            <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4">

              <h3 className="font-semibold text-yellow-800">
                🚧 Online Payments Coming Soon
              </h3>

              <p className="mt-2 text-sm text-yellow-700">
                We are currently
                integrating{" "}
                <strong>
                  eSewa
                </strong>{" "}
                and{" "}
                <strong>
                  Khalti
                </strong>{" "}
                for secure online
                payments.
              </p>

              <p className="mt-1 text-sm text-yellow-700">
                For now, please place
                your order using{" "}
                <strong>
                  Cash on Delivery
                </strong>
                .
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Thank you for
                supporting ZAYNA ❤️
              </p>

            </div>

            <div className="space-y-4">

              {/* COD */}

              <label className="flex items-start gap-3 rounded-xl border p-4 transition hover:border-black">

                <input
                  type="radio"
                  checked={
                    form.payment ===
                    "Cash on Delivery"
                  }
                  onChange={() =>
                    setForm({
                      ...form,
                      payment:
                        "Cash on Delivery",
                    })
                  }
                />

                <div>
                  <p className="font-semibold">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Available all over
                    Nepal
                  </p>
                </div>

              </label>

              {/* eSewa */}

              <label className="flex items-center justify-between rounded-xl border border-dashed bg-gray-100 p-4 opacity-60">

                <div>
                  <p className="font-semibold">
                    eSewa
                  </p>

                  <p className="text-sm text-gray-500">
                    Coming Soon
                  </p>
                </div>

                <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-800">
                  Soon
                </span>

              </label>

              {/* Khalti */}

              <label className="flex items-center justify-between rounded-xl border border-dashed bg-gray-100 p-4 opacity-60">

                <div>
                  <p className="font-semibold">
                    Khalti
                  </p>

                  <p className="text-sm text-gray-500">
                    Coming Soon
                  </p>
                </div>

                <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-800">
                  Soon
                </span>

              </label>

            </div>

          </div>

          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <div className="h-fit rounded-2xl bg-white p-5 shadow md:p-8 lg:sticky lg:top-32">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              {buyNowItem && (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  Buy Now
                </span>
              )}

            </div>

            {checkoutItems.map(
              (item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="mb-4 flex items-start justify-between gap-4 border-b pb-4"
                >

                  <div className="min-w-0">

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.size ||
                        "N/A"}{" "}
                      •{" "}
                      {item.color ||
                        "N/A"}
                    </p>

                    <p className="text-sm">
                      Qty:{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <p className="shrink-0 font-semibold">
                    NPR{" "}
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                  </p>

                </div>
              )
            )}

            <div className="mt-8 space-y-3">

              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <span>
                  NPR{" "}
                  {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4">

                <span>
                  Shipping (
                  {selectedProvince ||
                    "Select Province"}
                  )
                </span>

                <span>
                  {shipping === 0
                    ? "FREE"
                    : `NPR ${shipping.toLocaleString()}`}
                </span>

              </div>

              {estimatedDelivery && (
                <div className="flex justify-between text-sm text-gray-500">

                  <span>
                    Estimated Delivery
                  </span>

                  <span>
                    {estimatedDelivery}
                  </span>

                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-green-600">

                  <span>
                    Coupon (
                    {couponCode})
                  </span>

                  <span>
                    - NPR{" "}
                    {discount.toLocaleString()}
                  </span>

                </div>
              )}

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  NPR{" "}
                  {total.toLocaleString()}
                </span>

              </div>

              {/* =================================
                  PLACE ORDER BUTTON
              ================================= */}

              <button
                onClick={placeOrder}
                disabled={
                  !checkoutReady ||
                  checkoutItems.length ===
                    0 ||
                  isPlacingOrder
                }
                className="mt-6 w-full rounded-xl bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 md:py-4 md:text-lg"
              >
                {isPlacingOrder
                  ? "Placing Order..."
                  : buyNowItem
                    ? "Buy Now — Place Order"
                    : "Place Order"}
              </button>

            </div>

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}