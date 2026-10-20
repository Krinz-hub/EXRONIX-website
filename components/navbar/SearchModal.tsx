"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

import { getProducts, Product } from "@/lib/productService";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }

    if (open) {
      load();
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!query) return [];

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-start justify-center bg-black/70 px-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass mt-24 w-full max-w-2xl rounded-3xl border border-white/15 p-6 text-white shadow-2xl shadow-black/80 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Search Catalog
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={26} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1677FF]"
          />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search precision prints, models, prototypes..."
            className="w-full rounded-xl border border-white/15 bg-[#050608]/80 p-4 pl-14 text-base text-white outline-none placeholder:text-gray-400 focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] sm:text-lg"
          />
        </div>

        <div className="mt-6 max-h-[420px] overflow-y-auto">
          {query === "" ? (
            <p className="py-6 text-center text-sm text-gray-400">
              Start typing to search models and components...
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No matching products or models found.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-white/10"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl bg-black/40 object-cover sm:h-20 sm:w-20"
                  />
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-white sm:text-base">
                      {product.name}
                    </h4>
                    <p className="mt-0.5 text-xs uppercase tracking-wider text-[#1677FF]">
                      {product.category}
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-200">
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