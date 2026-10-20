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
    <section className="mt-16 sm:mt-20 lg:mt-24 border-t border-white/10 pt-12 sm:pt-16">

      <div className="mb-8 sm:mb-10 text-center">

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1677FF]">
          More to Explore
        </p>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          You May Also Like
        </h2>

      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            variant="dark"
          />
        ))}

      </div>

    </section>
  );
}