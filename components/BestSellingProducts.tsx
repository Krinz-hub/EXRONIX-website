"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { getTopSellingProducts } from "@/lib/orderService";

type Product = {
  id: number;
  name: string;
  image: string;
  sold: number;
};

export default function BestSellingProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getTopSellingProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 text-center sm:mb-14 lg:mb-16">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            Trending
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            🔥 Best Sellers
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
            Loved by our customers and chosen the most.
          </p>

        </div>

        {/* Products */}

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">

          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:rounded-2xl md:hover:-translate-y-2"
            >

              {/* Product Image */}

              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition duration-500 ease-out group-hover:scale-105"
                />

              </div>

              {/* Product Info */}

              <div className="p-3 sm:p-5">

                <h3 className="line-clamp-2 min-h-[2.75rem] break-words text-sm font-bold leading-5 sm:min-h-[3.5rem] sm:text-lg sm:leading-6">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center justify-between gap-2">

                  <p className="text-xs text-gray-500 sm:text-sm">
                    {product.sold} Sold
                  </p>

                  <span className="text-xs font-semibold text-gray-400 transition-colors group-hover:text-black sm:text-sm">
                    View →
                  </span>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}