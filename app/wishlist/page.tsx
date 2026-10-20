"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  getWishlist,
  removeFromWishlist,
} from "@/lib/wishlistService";
import LoadingAnimation from "@/components/LoadingAnimation";

type WishlistProduct = {
  product_id: number;
  products: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
};

export default function WishlistPage() {
  const { user, loading } = useAuth();

  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  /* =========================================================
     LOAD WISHLIST
  ========================================================= */

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setWishlist([]);
        setLoadingWishlist(false);
        return;
      }

      try {
        const data = await getWishlist(user.id);

        /*
          Supabase may return the related "products" relation
          as an array.

          Example:
          {
            product_id: 1,
            products: [
              {
                id: 1,
                name: "...",
                price: 1200,
                image: "..."
              }
            ]
          }

          Our page expects:
          {
            product_id: 1,
            products: {
              id: 1,
              name: "...",
              price: 1200,
              image: "..."
            }
          }

          So we normalize the response here.
        */

        const normalizedWishlist: WishlistProduct[] = [];

        for (const item of data ?? []) {
          const products = Array.isArray(item.products)
            ? item.products
            : item.products
              ? [item.products]
              : [];

          for (const product of products) {
            if (!product) {
              continue;
            }

            normalizedWishlist.push({
              product_id: Number(item.product_id),
              products: {
                id: Number(product.id),
                name: String(product.name ?? ""),
                price: Number(product.price ?? 0),
                image: String(product.image ?? ""),
              },
            });
          }
        }

        setWishlist(normalizedWishlist);
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error
        );

        setWishlist([]);
      } finally {
        setLoadingWishlist(false);
      }
    }

    if (!loading) {
      loadWishlist();
    }
  }, [user, loading]);

  /* =========================================================
     REMOVE FROM WISHLIST
  ========================================================= */

  async function handleRemove(productId: number) {
    if (!user) {
      return;
    }

    try {
      await removeFromWishlist(
        user.id,
        productId
      );

      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.product_id !== productId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove wishlist item:",
        error
      );
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 pt-32 pb-16 sm:px-6 sm:pt-36 lg:px-10 lg:pb-20 text-white">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
              SAVED HARDWARE
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              My Wishlist ❤️
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Your saved EXRONIX models and precision components.
            </p>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loadingWishlist ? (
            <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass p-10 text-center backdrop-blur-xl sm:p-16">
              <LoadingAnimation size="md" text="RETRIEVING WISHLIST" />
            </div>

          ) : wishlist.length === 0 ? (

            /* =================================================
                EMPTY WISHLIST
            ================================================= */

            <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl px-5 py-12 text-center text-white shadow-2xl sm:p-16">

              <div className="text-6xl sm:text-7xl">
                💔
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                Your Wishlist is Empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm text-gray-400 sm:text-base">
                Save your favourite EXRONIX prints and components here.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-[#1677FF] px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 sm:w-auto"
              >
                Continue Shopping
              </Link>

            </div>

          ) : (

            /* =================================================
                WISHLIST PRODUCTS
            ================================================= */

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">

              {wishlist.map((item) => (

                <div
                  key={`${item.product_id}-${item.products.id}`}
                  className="w-full overflow-hidden rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-[#1677FF]/40 text-white"
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <Link
                    href={`/products/${item.products.id}`}
                    className="block"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-white/10 bg-[#080a0f] sm:aspect-[3/4]">

                      <Image
                        src={item.products.image}
                        alt={item.products.name}
                        fill
                        sizes="
                          (max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          33vw
                        "
                        className="object-cover transition duration-500 hover:scale-105"
                      />

                    </div>
                  </Link>

                  {/* =================================================
                      PRODUCT INFO
                  ================================================= */}

                  <div className="p-5 sm:p-6">

                    <h2 className="line-clamp-2 text-lg font-bold text-white transition hover:text-[#1677FF] sm:text-xl">
                      {item.products.name}
                    </h2>

                    <p className="mt-2 text-lg font-black text-white sm:text-xl">
                      NPR{" "}
                      {item.products.price.toLocaleString()}
                    </p>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3">

                      <Link
                        href={`/products/${item.products.id}`}
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#1677FF] px-4 py-2.5 text-center text-sm font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 sm:text-base"
                      >
                        View Product
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            item.product_id
                          )
                        }
                        aria-label={`Remove ${item.products.name} from wishlist`}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-red-400 transition hover:bg-red-500/20"
                      >
                        🗑
                      </button>

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