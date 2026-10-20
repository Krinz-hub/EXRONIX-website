"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getRecentlyViewed } from "@/lib/recentlyViewed";

type Props = {
  currentProductId?: number;
};

export default function RecentlyViewed({
  currentProductId,
}: Props) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const viewed = getRecentlyViewed();

    const filtered = currentProductId
      ? viewed.filter(
          (product: any) => product.id !== currentProductId
        )
      : viewed;

    setProducts(filtered);
  }, [currentProductId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 sm:mt-20 lg:mt-24 border-t border-white/10 pt-12 sm:pt-16">

      <div className="mb-8 sm:mb-10 text-center">

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Recently Viewed
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Continue exploring accessories and components you've viewed recently.
        </p>

      </div>

      <div
        className={`grid gap-4 sm:gap-6 ${
          products.length === 1
            ? "mx-auto max-w-xs grid-cols-1"
            : products.length === 2
            ? "mx-auto max-w-2xl grid-cols-2"
            : products.length === 3
            ? "mx-auto max-w-4xl grid-cols-2 md:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >

        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            sizes={product.sizes}
            colors={product.colors}
            variant="dark"
          />
        ))}

      </div>

    </section>
  );
}