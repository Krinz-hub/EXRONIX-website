"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getProducts, Product } from "@/lib/productService";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({
  open,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!query) return [];

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(query.toLowerCase())
    );
  }, [products, query]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-start justify-center bg-black/60 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-24 w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Search</h2>

          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border p-4 pl-14 text-lg outline-none focus:border-black"
          />
        </div>

        <div className="mt-8 max-h-[450px] overflow-y-auto">
          {query === "" ? (
            <p className="text-center text-gray-400">
              Start typing...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400">
              No products found.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>

                    <p className="mt-1 font-bold">
                      NPR {product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}