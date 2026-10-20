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
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <LoadingAnimation size="lg" text="LOADING PRODUCTS" subtext="EXRONIX CATALOG" />
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">
            Products Management
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/admin"
              className="w-full rounded-lg bg-black px-5 py-3 text-center text-white transition hover:bg-gray-800 sm:w-auto"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/products/add"
              className="w-full rounded-lg bg-green-600 px-5 py-3 text-center text-white transition hover:bg-green-700 sm:w-auto"
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

          <div className="rounded-xl bg-white p-4 shadow md:p-6">
            <p className="text-gray-500">
              📦 Total Products
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {totalProducts}
            </h2>
          </div>

          {/* In Stock */}

          <div className="rounded-xl bg-white p-4 shadow md:p-6">
            <p className="text-gray-500">
              🟢 In Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {inStockProducts}
            </h2>
          </div>

          {/* Out Of Stock */}

          <div className="rounded-xl bg-white p-4 shadow md:p-6">
            <p className="text-gray-500">
              🔴 Out of Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {outOfStockProducts}
            </h2>
          </div>

          {/* Low Stock */}

          <div className="rounded-xl bg-white p-4 shadow md:p-6">
            <p className="text-gray-500">
              ⚠ Low Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
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
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border bg-white p-3 outline-none focus:border-black"
          />

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="w-full rounded-lg border bg-white p-3 outline-none focus:border-black"
          >
            <option value="All">
              All Categories
            </option>

            <option value="Computer Mice">
              Computer Mice
            </option>

            <option value="PC Cabinets">
              PC Cabinets
            </option>

            <option value="Headphone Stands">
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
            className="w-full rounded-lg border bg-white p-3 outline-none focus:border-black"
          >
            <option value="All">
              All Status
            </option>

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

          {/* Sort */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="w-full rounded-lg border bg-white p-3 outline-none focus:border-black"
          >
            <option value="Latest">
              Latest
            </option>

            <option value="Price Low">
              Price Low
            </option>

            <option value="Price High">
              Price High
            </option>

            <option value="Stock">
              Stock
            </option>
          </select>

        </div>

        {/* =====================================
            PRODUCTS TABLE
        ===================================== */}

        <div className="overflow-x-auto rounded-2xl bg-white shadow">

          <table className="min-w-[900px] w-full">

            {/* TABLE HEADER */}

            <thead className="bg-black text-white">
              <tr>

                <th className="p-4 text-left">
                  Image
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Stock
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-500"
                  >
                    No products available.
                  </td>
                </tr>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                      className="border-b hover:bg-gray-50"
                    >

                      {/* IMAGE */}

                      <td className="px-3 py-4 md:px-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-lg object-cover md:h-16 md:w-16"
                        />
                      </td>

                      {/* NAME */}

                      <td className="px-3 py-4 font-semibold md:px-4">
                        {product.name}
                      </td>

                      {/* CATEGORY */}

                      <td className="px-3 py-4 md:px-4">
                        {product.category}
                      </td>

                      {/* PRICE */}

                      <td className="px-3 py-4 md:px-4">
                        NPR{" "}
                        {product.price.toLocaleString()}
                      </td>

                      {/* STOCK */}

                      <td className="px-3 py-4 md:px-4">
                        {product.stock}
                      </td>

                      {/* STATUS */}

                      <td className="px-3 py-4 md:px-4">

                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold md:text-sm ${
                            product.status ===
                            "In Stock"
                              ? "bg-green-100 text-green-700"
                              : product.status ===
                                "Low Stock"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
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
                            className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                            title="View Product"
                          >
                            👁
                          </Link>

                          {/* EDIT */}

                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
                            title="Edit Product"
                          >
                            ✏️
                          </Link>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                            title="Delete Product"
                          >
                            🗑
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