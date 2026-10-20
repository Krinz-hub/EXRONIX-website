"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  getProducts,
  deleteProduct,
  type Product,
} from "@/lib/products";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD PRODUCTS
  ========================================= */

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);

        toast.error(
          "Failed to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /* =========================================
     FILTER + SORT PRODUCTS
  ========================================= */

  const filteredProducts = useMemo(() => {
    let data = [...products];

    /* Search */
    data = data.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    /* Category */
    if (categoryFilter !== "All") {
      data = data.filter(
        (product) =>
          product.category === categoryFilter
      );
    }

    /* Status */
    if (statusFilter !== "All") {
      data = data.filter(
        (product) =>
          product.status === statusFilter
      );
    }

    /* Sort */
    switch (sortBy) {
      case "Price Low":
        data.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "Price High":
        data.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "Stock":
        data.sort(
          (a, b) => a.stock - b.stock
        );
        break;

      default:
        data.sort(
          (a, b) => b.id - a.id
        );
        break;
    }

    return data;
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
  ]);

  /* =========================================
     DELETE PRODUCT
  ========================================= */

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Delete this product?"
      )
    ) {
      return;
    }

    try {
      toast.info("Deleting product...");

      await deleteProduct(id);

      const data = await getProducts();

      setProducts(data);

      toast.success(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      toast.error(
        "Failed to delete product. Please try again."
      );
    }
  };

  /* =========================================
     PRODUCT COUNTS
  ========================================= */

  const totalProducts = products.length;

  const inStockProducts = products.filter(
    (product) => product.stock > 5
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      product.stock > 0 &&
      product.stock <= 5
  ).length;

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent px-6">
        <LoadingAnimation size="lg" text="LOADING PRODUCTS" subtext="EXRONIX CATALOG" />
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Products Management
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage inventory levels, hardware catalog specs, and pricing.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/admin"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products/add"
              className="w-full rounded-xl bg-[#1677FF] px-5 py-3 text-center font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 sm:w-auto"
            >
              + Add Product
            </Link>

          </div>
        </div>

        {/* =====================================
            PRODUCT STATISTICS
        ===================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          {/* Total Products */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              📦 Total Products
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              {totalProducts}
            </h2>
          </div>

          {/* In Stock */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              🟢 In Stock
            </p>

            <h2 className="mt-2 text-3xl font-black text-emerald-400">
              {inStockProducts}
            </h2>
          </div>

          {/* Out Of Stock */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
              🔴 Out of Stock
            </p>

            <h2 className="mt-2 text-3xl font-black text-red-400">
              {outOfStockProducts}
            </h2>
          </div>

          {/* Low Stock */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              ⚠ Low Stock
            </p>

            <h2 className="mt-2 text-3xl font-black text-amber-400">
              {lowStockProducts}
            </h2>
          </div>

        </div>

        {/* =====================================
            SEARCH + FILTERS
        ===================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Search */}

          <input
            type="text"
            placeholder="🔍 Search catalog..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
          >
            <option value="All" className="bg-[#0b0e14] text-white">
              All Categories
            </option>

            <option value="Computer Mice" className="bg-[#0b0e14] text-white">
              Computer Mice
            </option>

            <option value="PC Cabinets" className="bg-[#0b0e14] text-white">
              PC Cabinets
            </option>

            <option value="Headphone Stands" className="bg-[#0b0e14] text-white">
              Headphone Stands
            </option>
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
          >
            <option value="All" className="bg-[#0b0e14] text-white">
              All Status
            </option>

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

          {/* Sort */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
          >
            <option value="Latest" className="bg-[#0b0e14] text-white">
              Latest
            </option>

            <option value="Price Low" className="bg-[#0b0e14] text-white">
              Price Low
            </option>

            <option value="Price High" className="bg-[#0b0e14] text-white">
              Price High
            </option>

            <option value="Stock" className="bg-[#0b0e14] text-white">
              Stock
            </option>
          </select>

        </div>

        {/* =====================================
            PRODUCTS TABLE
        ===================================== */}

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0e1219] shadow-xl">

          <table className="min-w-[900px] w-full">

            {/* TABLE HEADER */}

            <thead className="border-b border-white/10 bg-[#080a0f] text-xs uppercase tracking-wider text-gray-300">
              <tr>

                <th className="p-4 text-left font-semibold">
                  Image
                </th>

                <th className="p-4 text-left font-semibold">
                  Name
                </th>

                <th className="p-4 text-left font-semibold">
                  Category
                </th>

                <th className="p-4 text-left font-semibold">
                  Price
                </th>

                <th className="p-4 text-left font-semibold">
                  Stock
                </th>

                <th className="p-4 text-left font-semibold">
                  Status
                </th>

                <th className="p-4 text-center font-semibold">
                  Actions
                </th>

              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody className="divide-y divide-white/5">

              {filteredProducts.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-sm text-gray-400"
                  >
                    No products match the selected criteria.
                  </td>
                </tr>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                      className="transition hover:bg-white/5"
                    >

                      {/* IMAGE */}

                      <td className="px-3 py-4 md:px-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-xl border border-white/10 bg-white/5 object-cover md:h-16 md:w-16"
                        />
                      </td>

                      {/* NAME */}

                      <td className="px-3 py-4 font-semibold text-white md:px-4">
                        {product.name}
                      </td>

                      {/* CATEGORY */}

                      <td className="px-3 py-4 text-sm text-gray-300 md:px-4">
                        {product.category}
                      </td>

                      {/* PRICE */}

                      <td className="px-3 py-4 text-sm font-bold text-[#1677FF] md:px-4">
                        NPR{" "}
                        {product.price.toLocaleString()}
                      </td>

                      {/* STOCK */}

                      <td className="px-3 py-4 text-sm font-medium text-gray-300 md:px-4">
                        {product.stock}
                      </td>

                      {/* STATUS */}

                      <td className="px-3 py-4 md:px-4">

                        <span
                          className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                            product.status ===
                            "In Stock"
                              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                              : product.status ===
                                "Low Stock"
                              ? "border-amber-500/30 bg-amber-500/15 text-amber-400"
                              : "border-red-500/30 bg-red-500/15 text-red-400"
                          }`}
                        >
                          {product.status}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-3 py-4 md:px-4">

                        <div className="flex flex-wrap justify-center gap-2">

                          {/* VIEW */}

                          <Link
                            href={`/admin/products/view/${product.id}`}
                            className="rounded-xl border border-[#1677FF]/40 bg-[#1677FF]/15 px-3 py-2 text-xs font-semibold text-[#1677FF] transition hover:bg-[#1677FF]/25"
                            title="View Product"
                          >
                            👁 View
                          </Link>

                          {/* EDIT */}

                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/25"
                            title="Edit Product"
                          >
                            ✏️ Edit
                          </Link>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            className="rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/25"
                            title="Delete Product"
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}