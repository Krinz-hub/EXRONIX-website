"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import ProductCard from "./ProductCard";
import { getProducts, Product } from "@/lib/productService";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load featured products:", err);
      setError("Unable to retrieve featured gear at this time.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* =========================================================
     COMPACT DARK LOADING STATE
     Subtle EXRONIX logo + thin circular spinner + restrained blue
  ========================================================= */
  if (loading) {
    return (
      <section
        aria-label="Loading featured products"
        className="w-full overflow-hidden bg-transparent px-4 py-12 sm:px-6 sm:py-16 border-t border-white/10"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center text-center">
          {/* Subtle floating brand mark */}
          <div className="relative mb-3 h-8 w-28 select-none opacity-85 transition-opacity sm:h-9 sm:w-32">
            <Image
              src="/images/exronix-logo.png"
              alt="EXRONIX"
              fill
              className="object-contain"
            />
          </div>

          {/* Thin circular spinner with restrained blue accent */}
          <div className="mb-2.5 flex items-center justify-center">
            <span className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-white/20 border-t-[#1677FF]" />
          </div>

          {/* Short label with subtle opacity pulse */}
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-300 animate-pulse">
            Loading gear...
          </p>
        </div>
      </section>
    );
  }

  /* =========================================================
     COMPACT DARK ERROR STATE
     Allows user to retry fetching without a giant broken white block
  ========================================================= */
  if (error) {
    return (
      <section className="w-full overflow-hidden bg-transparent px-4 py-12 sm:px-6 sm:py-16 border-t border-white/10">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl liquid-glass border border-white/10 bg-[#050608]/60 p-6 text-center text-white backdrop-blur-md">
          <p className="text-sm text-gray-300">{error}</p>
          <button
            onClick={() => loadProducts()}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1677FF]/40 bg-[#1677FF]/15 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1677FF] transition hover:bg-[#1677FF]/25 active:scale-95"
          >
            Retry Fetching
          </button>
        </div>
      </section>
    );
  }

  /* =========================================================
     COMPACT DARK EMPTY STATE
  ========================================================= */
  if (products.length === 0) {
    return (
      <section className="w-full overflow-hidden bg-transparent px-4 py-12 sm:px-6 sm:py-16 border-t border-white/10">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl liquid-glass border border-white/10 bg-[#050608]/60 p-8 text-center text-white backdrop-blur-md">
          <p className="text-sm text-gray-300">
            No hardware gear found in the featured catalog.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#1677FF] hover:text-[#1677FF]"
          >
            Explore Complete Store
          </Link>
        </div>
      </section>
    );
  }

  /* =========================================================
     FEATURED PC ACCESSORIES GRID
  ========================================================= */
  return (
    <section className="w-full overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 text-center sm:mb-14 lg:mb-16">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1677FF] sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            HIGH-PERFORMANCE HARDWARE
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Featured PC Accessories
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-300 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
            Explore our flagship magnesium gaming mice, dual-chamber panoramic chassis, and CNC aluminum headphone cradles.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <div key={product.id} className="min-w-0">
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