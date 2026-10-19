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
    <section className="mt-24">

      <div className="mb-10 text-center">

        <h2 className="text-4xl font-bold">
          Recently Viewed
        </h2>

        <p className="mt-3 text-gray-500">
          Continue exploring products you've viewed recently.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            sizes={product.sizes}
            colors={product.colors}
          />
        ))}

      </div>

    </section>
  );
}