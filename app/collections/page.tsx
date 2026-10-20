"use client";

import { useEffect, useMemo, useState } from "react";

import CollectionsHeader from "@/components/collections/CollectionsHeader";
import FilterSidebar from "@/components/collections/FilterSidebar";
import SortDropdown from "@/components/collections/SortDropdown";
import ProductGrid from "@/components/collections/ProductGrid";
import LoadingAnimation from "@/components/LoadingAnimation";

import {
  getProducts,
  Product,
} from "@/lib/productService";

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

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

    /* Category */

    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    /* Sorting */

    switch (sort) {
      case "priceLow":
        result.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "priceHigh":
        result.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "name":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, category, sort]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent text-white px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <CollectionsHeader />

        {/* Product Count + Sort */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">

          <h2 className="text-lg font-semibold sm:text-xl text-white">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "Hardware Item"
              : "Hardware Items"}
          </h2>

          <div className="w-full sm:w-auto">
            <SortDropdown
              sort={sort}
              setSort={setSort}
            />
          </div>

        </div>

        {/* Main Content */}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">

          {/* Sidebar */}

          <FilterSidebar
            category={category}
            setCategory={setCategory}
            />

          {/* Products */}

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