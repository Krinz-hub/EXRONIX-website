"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import LoadingAnimation from "@/components/LoadingAnimation";

type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
};

export default function ViewProductPage() {
  const params = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const productId = Number(params.id);

  // =========================================
  // LOAD PRODUCT FROM SUPABASE
  // =========================================

  useEffect(() => {
    async function loadProduct() {
      if (!productId || Number.isNaN(productId)) {
        toast.error("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .maybeSingle();

        if (error) {
          console.error("Load Product Error:", error);
          toast.error("Failed to load product.");
          return;
        }

        if (!data) {
          toast.error("Product not found.");
          return;
        }

        setProduct({
          id: Number(data.id),
          name: data.name ?? "",
          image: data.image ?? "",
          description: data.description ?? "",
          category: data.category ?? "",
          price: Number(data.price ?? 0),
          stock: Number(data.stock ?? 0),
          sizes: Array.isArray(data.sizes)
            ? data.sizes.map(String)
            : [],
          colors: Array.isArray(data.colors)
            ? data.colors.map(String)
            : [],
        });
      } catch (error) {
        console.error("Load Product Error:", error);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent px-4 py-24 text-white md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <LoadingAnimation size="lg" text="LOADING PRODUCT DETAILS" subtext="EXRONIX CATALOG" />
        </div>
      </main>
    );
  }

  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {
    return (
      <main className="min-h-screen bg-transparent px-4 py-10 text-white md:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-10 text-center shadow-2xl">

            <h1 className="text-3xl font-extrabold text-white">
              Product Not Found
            </h1>

            <p className="mt-3 text-gray-400">
              The product you're looking for doesn't exist.
            </p>

            <Link
              href="/admin/products"
              className="mt-6 inline-block rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
            >
              ← Back to Products
            </Link>

          </div>

        </div>
      </main>
    );
  }

  // =========================================
  // STOCK STATUS
  // =========================================

  const stockStatus =
    product.stock <= 0
      ? "Out of Stock"
      : product.stock <= 5
      ? "Low Stock"
      : "In Stock";

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Products Management
            </p>

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Product Details
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            ← Back
          </Link>

        </div>

        {/* =========================
            PRODUCT CARD
        ========================= */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-10">

          <div className="grid gap-10 lg:grid-cols-2">

            {/* =========================
                PRODUCT IMAGE
            ========================= */}

            <div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080a0f]">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

              </div>

            </div>

            {/* =========================
                PRODUCT INFORMATION
            ========================= */}

            <div className="space-y-6">

              {/* Name */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Product Name
                </p>

                <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                  {product.name}
                </h2>
              </div>

              {/* Category */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Category
                </p>

                <p className="mt-1 text-lg font-semibold text-[#1677FF]">
                  {product.category}
                </p>
              </div>

              {/* Price */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Price
                </p>

                <p className="mt-1 text-3xl font-black text-white">
                  NPR {product.price.toLocaleString()}
                </p>
              </div>

              {/* Stock */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Stock
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {product.stock} units
                </p>
              </div>

              {/* Stock Status */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Stock Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full border px-4 py-1.5 text-xs font-bold ${
                    stockStatus === "In Stock"
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                      : stockStatus === "Low Stock"
                      ? "border-amber-500/30 bg-amber-500/15 text-amber-400"
                      : "border-red-500/30 bg-red-500/15 text-red-400"
                  }`}
                >
                  {stockStatus}
                </span>
              </div>

              {/* Description */}

              {product.description && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-line leading-7 text-gray-300">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Sizes */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Available Sizes
                </p>

                {product.sizes.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">
                    No sizes added
                  </p>
                )}
              </div>

              {/* Colors */}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Available Colors
                </p>

                {product.colors.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">
                    No colors added
                  </p>
                )}
              </div>

              {/* Actions */}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">

                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="flex-1 rounded-xl bg-[#1677FF] px-6 py-3 text-center font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
                >
                  ✏ Edit Product
                </Link>

                <Link
                  href="/admin/products"
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                >
                  Back to Products
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}