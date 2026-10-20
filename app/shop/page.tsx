"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Filter, Grid, SlidersHorizontal, Sparkles } from "lucide-react";

import FilterSidebar from "@/components/collections/FilterSidebar";
import SortDropdown from "@/components/collections/SortDropdown";
import ProductGrid from "@/components/collections/ProductGrid";
import LoadingAnimation from "@/components/LoadingAnimation";
import { getProducts, Product } from "@/lib/productService";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (searchParams.get("category")) {
      setCategory(searchParams.get("category")!);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    switch (sort) {
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, category, sort]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent text-white px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            SHOP HERO BANNER
        ===================================================== */}
        <div className="mb-10 text-center sm:mb-14 lg:mb-16">
          <div className="liquid-glass-subtle mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1677FF] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF] animate-pulse" />
            OFFICIAL HARDWARE STORE
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            PC Accessories & Hardware
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs font-medium leading-6 text-gray-300 sm:text-sm sm:leading-7 md:text-base">
            Engineered for esports competitors, custom PC builders, and clean desk setups.
            Explore magnesium gaming mice, dual-chamber panoramic chassis, and CNC aluminum stands.
          </p>

          {/* Quick Category Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {["All", "Computer Mice", "PC Cabinets", "Headphone Stands"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 sm:text-sm ${
                    category === cat
                      ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                      : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat === "All" ? "All Hardware" : cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* =====================================================
            TOOLBAR (COUNT + SORT)
        ===================================================== */}
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white sm:text-lg">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "Product Available"
                : "Products Available"}
            </h2>
            {category !== "All" && (
              <span className="rounded-md border border-[#1677FF]/40 bg-[#1677FF]/10 px-2 py-0.5 text-xs font-semibold text-[#1677FF]">
                {category}
              </span>
            )}
          </div>

          <div className="w-full sm:w-auto">
            <SortDropdown sort={sort} setSort={setSort} />
          </div>
        </div>

        {/* =====================================================
            PRODUCT DISCOVERY GRID WITH SIDEBAR
        ===================================================== */}
        <div className="grid min-w-0 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <FilterSidebar category={category} setCategory={setCategory} />

          <div className="min-w-0">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-2xl liquid-glass border border-white/10 bg-[#050608]/40 p-12">
                <LoadingAnimation
                  size="md"
                  text="LOADING HARDWARE"
                  subtext="EXRONIX STORE"
                />
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onReset={() => {
                  setCategory("All");
                  setSort("newest");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingAnimation
            size="lg"
            text="LOADING PC HARDWARE"
            subtext="EXRONIX STORE"
          />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
