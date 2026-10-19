"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import {
  getProducts,
  updateProductStock,
} from "@/lib/productService";

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
          "bg-red-100 text-red-700",
      };
    }

    if (product.stock <= 5) {
      return {
        label: "Low Stock",
        className:
          "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-green-100 text-green-700",
    };
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 md:mb-10">

          <h1 className="text-3xl font-bold md:text-5xl">
            Inventory Management
          </h1>

          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Monitor and update product stock.
          </p>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:mb-10 md:grid-cols-3 lg:grid-cols-5">

          {/* Products */}

          <div className="rounded-2xl bg-white p-4 shadow md:p-6">

            <p className="text-xs text-gray-500 md:text-sm">
              📦 Products
            </p>

            <h2 className="mt-2 text-2xl font-bold md:mt-3 md:text-4xl">
              {totalProducts}
            </h2>

          </div>

          {/* In Stock */}

          <div className="rounded-2xl bg-white p-4 shadow md:p-6">

            <p className="text-xs text-green-600 md:text-sm">
              🟢 In Stock
            </p>

            <h2 className="mt-2 text-2xl font-bold md:mt-3 md:text-4xl">
              {inStock}
            </h2>

          </div>

          {/* Low Stock */}

          <div className="rounded-2xl bg-white p-4 shadow md:p-6">

            <p className="text-xs text-yellow-600 md:text-sm">
              🟡 Low Stock
            </p>

            <h2 className="mt-2 text-2xl font-bold md:mt-3 md:text-4xl">
              {lowStock}
            </h2>

          </div>

          {/* Out of Stock */}

          <div className="rounded-2xl bg-white p-4 shadow md:p-6">

            <p className="text-xs text-red-600 md:text-sm">
              🔴 Out of Stock
            </p>

            <h2 className="mt-2 text-2xl font-bold md:mt-3 md:text-4xl">
              {outOfStock}
            </h2>

          </div>

          {/* Inventory Value */}

          <div className="col-span-2 rounded-2xl bg-white p-4 shadow md:col-span-2 md:p-6 lg:col-span-1">

            <p className="text-xs text-gray-500 md:text-sm">
              💰 Inventory Value
            </p>

            <h2 className="mt-2 text-xl font-bold md:mt-3 md:text-3xl">
              NPR{" "}
              {inventoryValue.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* Search & Filter */}

        <div className="mb-6 grid gap-4 md:mb-8 md:grid-cols-[1fr_auto]">

          <input
            type="text"
            placeholder="🔍 Search product..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border bg-white p-3 outline-none transition focus:border-black md:p-4"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-black md:w-52"
          >
            <option value="All">All Products</option>
            <option value="In Stock">
              In Stock
            </option>
            <option value="Low Stock">
              Low Stock
            </option>
            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

        </div>

        {/* Selection Info */}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">

          <span>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </span>

          {selectedProducts.length > 0 && (
            <span className="font-medium text-black">
              {selectedProducts.length} selected
            </span>
          )}

        </div>

        {/* Loading */}

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <p className="text-gray-500">
              Loading inventory...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <p className="text-gray-500">
              No products found.
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
                      className="rounded-2xl bg-white p-5 shadow"
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
                          className="mt-2 h-4 w-4"
                        />

                        <Image
                          src={product.image}
                          alt={product.name}
                          width={70}
                          height={70}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">

                          <h2 className="truncate font-bold">
                            {product.name}
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            NPR{" "}
                            {product.price.toLocaleString()}
                          </p>

                        </div>

                      </div>

                      {/* Stock Info */}

                      <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4">

                        <div>

                          <p className="text-xs text-gray-500">
                            Current Stock
                          </p>

                          <p className="mt-1 text-2xl font-bold">
                            {product.stock}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-gray-500">
                            Status
                          </p>

                          <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
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
                          className="flex h-11 w-1/2 items-center justify-center rounded-xl bg-red-500 text-xl font-bold text-white transition hover:bg-red-600"
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
                          className="flex h-11 w-1/2 items-center justify-center rounded-xl bg-green-600 text-xl font-bold text-white transition hover:bg-green-700"
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

            <div className="hidden overflow-x-auto rounded-2xl bg-white shadow md:block">

              <table className="min-w-[950px] w-full">

                <thead className="bg-black text-white">

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
                        className="h-4 w-4"
                      />
                    </th>

                    <th className="px-4 py-4 text-left">
                      Product
                    </th>

                    <th className="px-4 py-4 text-center">
                      Price
                    </th>

                    <th className="px-4 py-4 text-center">
                      Stock
                    </th>

                    <th className="px-4 py-4 text-center">
                      Status
                    </th>

                    <th className="px-4 py-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {
                      const status =
                        getStockStatus(
                          product
                        );

                      return (
                        <tr
                          key={product.id}
                          className="border-b transition hover:bg-gray-50"
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
                              className="h-4 w-4"
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
                                className="h-16 w-16 rounded-lg object-cover"
                              />

                              <span className="font-semibold">
                                {product.name}
                              </span>

                            </div>

                          </td>

                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            NPR{" "}
                            {product.price.toLocaleString()}
                          </td>

                          <td className="px-4 py-4 text-center text-xl font-bold">
                            {product.stock}
                          </td>

                          <td className="px-4 py-4 text-center">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold md:text-sm ${status.className}`}
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
                                className="rounded-lg bg-red-500 px-4 py-2 text-lg font-bold text-white transition hover:bg-red-600"
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
                                className="rounded-lg bg-green-600 px-4 py-2 text-lg font-bold text-white transition hover:bg-green-700"
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