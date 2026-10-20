"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import {
  getProducts,
  updateProductStock,
} from "@/lib/productService";
import LoadingAnimation from "@/components/LoadingAnimation";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProducts, setSelectedProducts] =
    useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      if (filter === "Low Stock") {
        return (
          matchesSearch &&
          product.stock > 0 &&
          product.stock <= 5
        );
      }

      if (filter === "Out of Stock") {
        return (
          matchesSearch &&
          product.stock === 0
        );
      }

      if (filter === "In Stock") {
        return (
          matchesSearch &&
          product.stock > 5
        );
      }

      return matchesSearch;
    });
  }, [products, search, filter]);

  async function changeStock(
    product: Product,
    amount: number
  ) {
    const newStock = Math.max(
      0,
      product.stock + amount
    );

    try {
      await updateProductStock(
        product.id,
        newStock
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                stock: newStock,
              }
            : p
        )
      );

      toast.success("Stock updated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock.");
    }
  }

  function toggleProduct(id: number) {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter(
            (productId) => productId !== id
          )
        : [...prev, id]
    );
  }

  function toggleAll() {
    if (
      selectedProducts.length ===
      filteredProducts.length
    ) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(
        filteredProducts.map(
          (product) => product.id
        )
      );
    }
  }

  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => product.stock > 5
  ).length;

  const lowStock = products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= 5
  ).length;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + product.price * product.stock,
    0
  );

  function getStockStatus(product: Product) {
    if (product.stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "border border-red-500/30 bg-red-500/15 text-red-400",
      };
    }

    if (product.stock <= 5) {
      return {
        label: "Low Stock",
        className:
          "border border-amber-500/30 bg-amber-500/15 text-amber-400",
      };
    }

    return {
      label: "In Stock",
      className:
        "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    };
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 md:mb-10">

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Inventory Management
          </h1>

          <p className="mt-2 text-sm text-gray-400 md:text-base">
            Monitor warehouse stocks and adjust unit counts in real time.
          </p>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:mb-10 md:grid-cols-3 lg:grid-cols-5">

          {/* Products */}

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              📦 Products
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-4xl">
              {totalProducts}
            </h2>

          </div>

          {/* In Stock */}

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              🟢 In Stock
            </p>

            <h2 className="mt-2 text-2xl font-black text-emerald-400 md:mt-3 md:text-4xl">
              {inStock}
            </h2>

          </div>

          {/* Low Stock */}

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              🟡 Low Stock
            </p>

            <h2 className="mt-2 text-2xl font-black text-amber-400 md:mt-3 md:text-4xl">
              {lowStock}
            </h2>

          </div>

          {/* Out of Stock */}

          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:p-6">

            <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
              🔴 Out of Stock
            </p>

            <h2 className="mt-2 text-2xl font-black text-red-400 md:mt-3 md:text-4xl">
              {outOfStock}
            </h2>

          </div>

          {/* Inventory Value */}

          <div className="col-span-2 rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl md:col-span-2 md:p-6 lg:col-span-1">

            <p className="text-xs font-semibold uppercase tracking-wider text-[#1677FF]">
              💰 Total Value
            </p>

            <h2 className="mt-2 text-xl font-black text-[#1677FF] md:mt-3 md:text-2xl">
              NPR{" "}
              {inventoryValue.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* Search & Filter */}

        <div className="mb-6 grid gap-4 md:mb-8 md:grid-cols-[1fr_auto]">

          <input
            type="text"
            placeholder="🔍 Search product title..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] md:p-4"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF] md:w-52"
          >
            <option value="All" className="bg-[#0b0e14] text-white">All Products</option>
            <option value="In Stock" className="bg-[#0b0e14] text-white">
              In Stock
            </option>
            <option value="Low Stock" className="bg-[#0b0e14] text-white">
              Low Stock
            </option>
            <option value="Out of Stock" className="bg-[#0b0e14] text-white">
              Out of Stock
            </option>
          </select>

        </div>

        {/* Selection Info */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">

          <span>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </span>

          {selectedProducts.length > 0 && (
            <span className="font-bold text-[#1677FF]">
              {selectedProducts.length} selected
            </span>
          )}

        </div>

        {/* Loading */}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-12 text-center shadow-xl flex items-center justify-center">
            <LoadingAnimation size="md" text="LOADING INVENTORY" subtext="EXRONIX WAREHOUSE TELEMETRY" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-12 text-center shadow-xl">
            <p className="text-gray-400">
              No products found matching search.
            </p>
          </div>
        ) : (
          <>
            {/* ========================== */}
            {/* MOBILE INVENTORY CARDS */}
            {/* ========================== */}

            <div className="space-y-4 md:hidden">

              {filteredProducts.map(
                (product) => {
                  const status =
                    getStockStatus(product);

                  return (
                    <div
                      key={product.id}
                      className="rounded-3xl border border-white/10 bg-[#0e1219] p-5 shadow-xl text-white"
                    >

                      {/* Product Header */}

                      <div className="flex items-start gap-4">

                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(
                            product.id
                          )}
                          onChange={() =>
                            toggleProduct(
                              product.id
                            )
                          }
                          className="mt-2 h-4 w-4 rounded accent-[#1677FF]"
                        />

                        <Image
                          src={product.image}
                          alt={product.name}
                          width={70}
                          height={70}
                          className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 bg-[#080a0f] object-cover"
                        />

                        <div className="min-w-0 flex-1">

                          <h2 className="truncate font-bold text-white">
                            {product.name}
                          </h2>

                          <p className="mt-1 text-sm font-semibold text-[#1677FF]">
                            NPR{" "}
                            {product.price.toLocaleString()}
                          </p>

                        </div>

                      </div>

                      {/* Stock Info */}

                      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">

                        <div>

                          <p className="text-xs text-gray-400">
                            Current Stock
                          </p>

                          <p className="mt-1 text-2xl font-black text-white">
                            {product.stock}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-gray-400">
                            Status
                          </p>

                          <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>

                        </div>

                      </div>

                      {/* Stock Controls */}

                      <div className="mt-5 flex items-center gap-3">

                        <button
                          onClick={() =>
                            changeStock(
                              product,
                              -1
                            )
                          }
                          className="flex h-11 w-1/2 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-xl font-bold text-red-400 transition hover:bg-red-500/25"
                        >
                          −
                        </button>

                        <button
                          onClick={() =>
                            changeStock(
                              product,
                              1
                            )
                          }
                          className="flex h-11 w-1/2 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-xl font-bold text-emerald-400 transition hover:bg-emerald-500/25"
                        >
                          +
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* ========================== */}
            {/* DESKTOP TABLE */}
            {/* ========================== */}

            <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-[#0e1219] shadow-2xl md:block">

              <table className="min-w-[950px] w-full">

                <thead className="border-b border-white/10 bg-[#080a0f] text-xs uppercase tracking-wider text-gray-300">

                  <tr>

                    <th className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredProducts.length > 0 &&
                          selectedProducts.length ===
                            filteredProducts.length
                        }
                        onChange={toggleAll}
                        className="h-4 w-4 rounded accent-[#1677FF]"
                      />
                    </th>

                    <th className="px-4 py-4 text-left font-semibold">
                      Product
                    </th>

                    <th className="px-4 py-4 text-center font-semibold">
                      Price
                    </th>

                    <th className="px-4 py-4 text-center font-semibold">
                      Stock
                    </th>

                    <th className="px-4 py-4 text-center font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-4 text-center font-semibold">
                      Adjust Stock
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/5">

                  {filteredProducts.map(
                    (product) => {
                      const status =
                        getStockStatus(
                          product
                        );

                      return (
                        <tr
                          key={product.id}
                          className="transition hover:bg-white/5"
                        >

                          <td className="px-4 py-4 text-center">

                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(
                                product.id
                              )}
                              onChange={() =>
                                toggleProduct(
                                  product.id
                                )
                              }
                              className="h-4 w-4 rounded accent-[#1677FF]"
                            />

                          </td>

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-4">

                              <Image
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                width={70}
                                height={70}
                                className="h-14 w-14 rounded-2xl border border-white/10 bg-[#080a0f] object-cover"
                              />

                              <span className="font-semibold text-white">
                                {product.name}
                              </span>

                            </div>

                          </td>

                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-semibold text-[#1677FF]">
                            NPR{" "}
                            {product.price.toLocaleString()}
                          </td>

                          <td className="px-4 py-4 text-center text-xl font-black text-white">
                            {product.stock}
                          </td>

                          <td className="px-4 py-4 text-center">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                            >
                              {status.label}
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            <div className="flex justify-center gap-2">

                              <button
                                onClick={() =>
                                  changeStock(
                                    product,
                                    -1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-lg font-bold text-red-400 transition hover:bg-red-500/25"
                              >
                                −
                              </button>

                              <button
                                onClick={() =>
                                  changeStock(
                                    product,
                                    1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-lg font-bold text-emerald-400 transition hover:bg-emerald-500/25"
                              >
                                +
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          </>
        )}

      </div>
    </main>
  );
}