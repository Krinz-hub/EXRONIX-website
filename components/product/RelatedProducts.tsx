"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import {
  getRelatedProducts,
  Product,
} from "@/lib/productService";

type Props = {
  productId: number;
  category: string;
};

export default function RelatedProducts({
  productId,
  category,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getRelatedProducts(
        category,
        productId
      );

      setProducts(data);
    }

    loadProducts();
  }, [category, productId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">

      <div className="mb-10 text-center">

        <h2 className="text-4xl font-bold">
          You May Also Like
        </h2>

        <p className="mt-3 text-gray-500">
          Complete your look with more from this collection.
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