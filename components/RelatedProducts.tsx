"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  Product,
  getProducts,
} from "@/lib/productService";

type Props = {
  currentProductId: number;
};

export default function RelatedProducts({
  currentProductId,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();

      const filtered = data
        .filter(
          (product) =>
            product.id !== currentProductId
        )
        .slice(0, 4);

      setProducts(filtered);
    }

    loadProducts();
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-24">

      <div className="mb-12 text-center">

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
          More to Explore
        </p>

        <h2 className="text-3xl font-bold lg:text-4xl">
          You May Also Like
        </h2>

      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        ))}

      </div>

    </section>
  );
}