"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getStoreSettings } from "@/lib/storeSettingsService";
import { useCart } from "@/context/CartContext";
import { validateCoupon } from "@/lib/couponService";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [storeSettings, setStoreSettings] =
  useState<{
    free_shipping_limit: number;
    shipping_cost: number;
  } | null>(null);

const [loadingSettings, setLoadingSettings] =
  useState(true);
  /* =========================================
     SHIPPING
  ========================================= */

const FREE_SHIPPING_LIMIT =
  storeSettings?.free_shipping_limit ?? 3000;

const SHIPPING_COST =
  storeSettings?.shipping_cost ?? 170;

  /* =========================================
     SUBTOTAL
  ========================================= */

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping =
    subtotal >= FREE_SHIPPING_LIMIT
      ? 0
      : cart.length > 0
      ? SHIPPING_COST
      : 0;

  const finalTotal = Math.max(
    0,
    subtotal + shipping - discount
  );

useEffect(() => {
  async function loadStoreSettings() {
    try {
      const settings = await getStoreSettings();

      if (settings) {
        setStoreSettings({
          free_shipping_limit:
            Number(settings.free_shipping_limit),

          shipping_cost:
            Number(settings.shipping_cost),
        });
      }
    } catch (error) {
      console.error(
        "Failed to load store settings:",
        error
      );
    } finally {
      setLoadingSettings(false);
    }
  }

  loadStoreSettings();
}, []);



  /* =========================================
     COUPON
  ========================================= */

  async function applyCoupon() {
    if (!coupon.trim()) {
      setMessage("❌ Please enter a coupon code.");
      return;
    }

    setApplyingCoupon(true);
    setMessage("");

    try {
      const result = await validateCoupon(
        coupon.trim(),
        subtotal
      );

      if (!result.valid) {
        setDiscount(0);
        setAppliedCoupon(null);

        setMessage(
          `❌ ${result.message}`
        );

        return;
      }

      setDiscount(result.discount ?? 0);
      setAppliedCoupon(result.coupon);

      localStorage.setItem(
        "zayna-coupon",
        JSON.stringify(result.coupon)
      );

      setMessage(
        "🎉 Coupon applied successfully!"
      );

      toast.success(
        "Coupon applied successfully!"
      );
    } catch (error) {
      console.error(
        "Coupon error:",
        error
      );

      setMessage(
        "❌ Failed to apply coupon."
      );
    } finally {
      setApplyingCoupon(false);
    }
  }

  /* =========================================
     REMOVE COUPON
  ========================================= */

  function removeCoupon() {
    setCoupon("");
    setDiscount(0);
    setAppliedCoupon(null);
    setMessage("");

    localStorage.removeItem(
      "zayna-coupon"
    );

    toast.success(
      "Coupon removed."
    );
  }

  /* =========================================
     EMPTY CART
  ========================================= */

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 pb-20 pt-32 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag
              size={42}
              className="text-gray-500"
            />
          </div>

          <h1 className="mt-8 text-3xl font-bold sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mt-3 max-w-md text-gray-500">
            Looks like you haven't added
            anything yet.
          </p>

          <Link
            href="/collections"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-20 pt-32 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-10">

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
            EXRONIX
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Your Cart
          </h1>

          <p className="mt-3 text-gray-500">
            {cart.length}{" "}
            {cart.length === 1
              ? "item"
              : "items"}{" "}
            in your cart.
          </p>

        </div>

        {/* =====================================
            MAIN GRID
        ===================================== */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ===================================
              LEFT — CART ITEMS
          =================================== */}

          <div className="space-y-5">

            {cart.map((product) => (

              <div
                key={`${product.id}-${product.size ?? "none"}-${product.color ?? "none"}`}
                className="rounded-2xl bg-white p-4 shadow-sm sm:p-6"
              >

                <div className="flex gap-4 sm:gap-6">

                  {/* Product Image */}

                  <Link
                    href={`/products/${product.id}`}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-28"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </Link>

                  {/* Product Details */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <Link
                          href={`/products/${product.id}`}
                          className="line-clamp-2 text-lg font-bold transition hover:text-gray-600 sm:text-xl"
                        >
                          {product.name}
                        </Link>

                        {/* Variant */}

                        <div className="mt-2 space-y-1 text-sm text-gray-500">

                          {product.size && (
                            <p>
                              Size:{" "}
                              <span className="font-semibold text-gray-800">
                                {product.size}
                              </span>
                            </p>
                          )}

                          {product.color && (
                            <p>
                              Color:{" "}
                              <span className="font-semibold text-gray-800">
                                {product.color}
                              </span>
                            </p>
                          )}

                        </div>

                      </div>

                      {/* Remove — desktop */}

                      <button
                        onClick={() =>
                          removeFromCart(
                            product.id,
                            product.size,
                            product.color
                          )
                        }
                        className="hidden rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 sm:block"
                        aria-label="Remove item"
                      >
                        <Trash2 size={19} />
                      </button>

                    </div>

                    {/* Price */}

                    <p className="mt-3 text-lg font-bold sm:text-xl">
                      NPR{" "}
                      {(
                        product.price *
                        product.quantity
                      ).toLocaleString()}
                    </p>

                    {/* Quantity */}

                    <div className="mt-4 flex items-center justify-between gap-3">

                      <div className="flex items-center overflow-hidden rounded-lg border">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              product.id,
                              product.size,
                              product.color
                            )
                          }
                          disabled={
                            product.quantity <= 1
                          }
                          className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="flex h-10 min-w-10 items-center justify-center border-x px-3 text-sm font-semibold">
                          {product.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              product.id,
                              product.size,
                              product.color
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      {/* Mobile Remove */}

                      <button
                        onClick={() =>
                          removeFromCart(
                            product.id,
                            product.size,
                            product.color
                          )
                        }
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-500 transition hover:bg-red-50 sm:hidden"
                      >
                        <Trash2 size={17} />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* ===================================
              RIGHT — SUMMARY
          =================================== */}

          <div className="lg:sticky lg:top-28 lg:self-start">

            <div className="space-y-5">

              {/* Free Shipping */}

              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                {subtotal >=
                FREE_SHIPPING_LIMIT ? (

                  <p className="font-semibold text-green-700">
                    🎉 Congratulations! You
                    unlocked FREE shipping.
                  </p>

                ) : (

                  <p className="text-sm font-semibold text-gray-700">
                    Spend{" "}
                    <span className="text-green-700">
                      NPR{" "}
                      {(
                        FREE_SHIPPING_LIMIT -
                        subtotal
                      ).toLocaleString()}
                    </span>{" "}
                    more to get FREE shipping.
                  </p>

                )}

              </div>

              {/* Order Summary */}

              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-7">

                <h2 className="text-2xl font-bold">
                  Order Summary
                </h2>

                {/* Coupon */}

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-semibold">
                    Coupon Code
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) =>
                        setCoupon(
                          e.target.value.toUpperCase()
                        )
                      }
                      disabled={
                        discount > 0 ||
                        applyingCoupon
                      }
                      placeholder="Enter coupon"
                      className="min-w-0 flex-1 rounded-lg border px-3 py-3 text-sm uppercase outline-none transition focus:border-black disabled:bg-gray-100"
                    />

                    {discount > 0 ? (

                      <button
                        onClick={removeCoupon}
                        className="rounded-lg border border-red-300 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>

                    ) : (

                      <button
                        onClick={applyCoupon}
                        disabled={
                          applyingCoupon
                        }
                        className="rounded-lg bg-black px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {applyingCoupon
                          ? "..."
                          : "Apply"}
                      </button>

                    )}

                  </div>

                  {message && (
                    <p
                      className={`mt-3 text-sm font-medium ${
                        discount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {message}
                    </p>
                  )}

                </div>

                {/* Prices */}

                <div className="mt-7 space-y-4">

                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900">
                      NPR{" "}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">

                    <span>
                      Shipping
                    </span>

                    {shipping === 0 ? (

                      <span className="font-semibold text-green-600">
                        FREE
                      </span>

                    ) : (

                      <span className="font-medium text-gray-900">
                        NPR{" "}
                        {shipping.toLocaleString()}
                      </span>

                    )}

                  </div>

                  {discount > 0 && (

                    <div className="flex justify-between text-green-600">

                      <span>
                        Discount
                        {appliedCoupon?.code
                          ? ` (${appliedCoupon.code})`
                          : ""}
                      </span>

                      <span className="font-semibold">
                        − NPR{" "}
                        {discount.toLocaleString()}
                      </span>

                    </div>

                  )}

                  <div className="border-t pt-5">

                    <div className="flex items-center justify-between">

                      <span className="text-lg font-semibold">
                        Total
                      </span>

                      <span className="text-2xl font-bold">
                        NPR{" "}
                        {finalTotal.toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Checkout */}

                <Link
                  href="/checkout"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/collections"
                  className="mt-3 block w-full rounded-xl border py-4 text-center font-semibold transition hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}