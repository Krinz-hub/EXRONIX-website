"use client";

import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

import {
  getProducts,
  Product,
} from "@/lib/productService";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="w-full overflow-hidden bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center sm:mb-14">

            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
              Featured
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Featured Collection
            </h2>

          </div>

          <div className="text-center text-sm text-gray-500 sm:text-base">
            Loading products...
          </div>

        </div>
      </section>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}

        <div className="mb-10 text-center sm:mb-14 lg:mb-16">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            Featured
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Featured Collection
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
            Explore our most loved pieces, crafted for timeless everyday wear.
          </p>

        </div>

        {/* Products */}

        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">

          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}