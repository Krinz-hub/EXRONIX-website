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
      <main className="min-h-screen bg-gray-100 px-4 py-24 text-black md:px-8">
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
      <main className="min-h-screen bg-gray-100 px-4 py-10 text-black md:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="rounded-2xl bg-white p-10 text-center shadow">

            <h1 className="text-3xl font-bold">
              Product Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              The product you're looking for doesn't exist.
            </p>

            <Link
              href="/admin/products"
              className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
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
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Products Management
            </p>

            <h1 className="mt-1 text-3xl font-bold md:text-4xl">
              Product Details
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
          >
            ← Back
          </Link>

        </div>

        {/* =========================
            PRODUCT CARD
        ========================= */}

        <div className="rounded-2xl bg-white p-5 shadow sm:p-8">

          <div className="grid gap-10 lg:grid-cols-2">

            {/* =========================
                PRODUCT IMAGE
            ========================= */}

            <div>

              <div className="overflow-hidden rounded-2xl bg-gray-100">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-gray-400">
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
                <p className="text-sm text-gray-500">
                  Product Name
                </p>

                <h2 className="mt-1 text-3xl font-bold sm:text-4xl">
                  {product.name}
                </h2>
              </div>

              {/* Category */}

              <div>
                <p className="text-sm text-gray-500">
                  Category
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {product.category}
                </p>
              </div>

              {/* Price */}

              <div>
                <p className="text-sm text-gray-500">
                  Price
                </p>

                <p className="mt-1 text-3xl font-bold">
                  NPR {product.price.toLocaleString()}
                </p>
              </div>

              {/* Stock */}

              <div>
                <p className="text-sm text-gray-500">
                  Stock
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {product.stock}
                </p>
              </div>

              {/* Stock Status */}

              <div>
                <p className="text-sm text-gray-500">
                  Stock Status
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-4 py-2 text-sm font-semibold ${
                    stockStatus === "In Stock"
                      ? "bg-green-100 text-green-700"
                      : stockStatus === "Low Stock"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stockStatus}
                </span>
              </div>

              {/* Description */}

              {product.description && (
                <div>
                  <p className="text-sm text-gray-500">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Sizes */}

              <div>
                <p className="text-sm text-gray-500">
                  Available Sizes
                </p>

                {product.sizes.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-400">
                    No sizes added
                  </p>
                )}
              </div>

              {/* Colors */}

              <div>
                <p className="text-sm text-gray-500">
                  Available Colors
                </p>

                {product.colors.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-400">
                    No colors added
                  </p>
                )}
              </div>

              {/* Actions */}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">

                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="flex-1 rounded-lg bg-yellow-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-yellow-600"
                >
                  ✏ Edit Product
                </Link>

                <Link
                  href="/admin/products"
                  className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold transition hover:bg-gray-100"
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