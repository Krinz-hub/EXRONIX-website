"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FolderTree,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
  image?: string;
  status: "Active" | "Inactive";
};

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("zayna-categories") || "[]"
    );

    setCategories(saved);
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [categories, search]);

  const deleteCategory = (id: number) => {
    const ok = window.confirm(
      "Delete this category?"
    );

    if (!ok) return;

    const updated = categories.filter(
      (category) => category.id !== id
    );

    localStorage.setItem(
      "zayna-categories",
      JSON.stringify(updated)
    );

    setCategories(updated);
  };

  const activeCategories = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-black md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
              Manage all product categories.
            </p>
          </div>

          <Link
            href="/admin/categories/add"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 sm:w-auto"
          >
            <Plus size={18} />
            Add Category
          </Link>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:mb-10 md:grid-cols-3 md:gap-6">

          {/* Total */}

          <div className="rounded-2xl bg-white p-4 shadow transition hover:shadow-lg md:p-6">

            <FolderTree
              className="mb-3"
              size={26}
            />

            <h2 className="text-xs text-gray-500 md:text-sm">
              Total Categories
            </h2>

            <h1 className="mt-2 text-2xl font-bold md:text-4xl">
              {categories.length}
            </h1>

          </div>

          {/* Active */}

          <div className="rounded-2xl bg-white p-4 shadow transition hover:shadow-lg md:p-6">

            <h2 className="text-xs text-gray-500 md:text-sm">
              Active
            </h2>

            <h1 className="mt-2 text-2xl font-bold text-green-600 md:text-4xl">
              {activeCategories}
            </h1>

          </div>

          {/* Inactive */}

          <div className="col-span-2 rounded-2xl bg-white p-4 shadow transition hover:shadow-lg md:col-span-1 md:p-6">

            <h2 className="text-xs text-gray-500 md:text-sm">
              Inactive
            </h2>

            <h1 className="mt-2 text-2xl font-bold text-red-600 md:text-4xl">
              {inactiveCategories}
            </h1>

          </div>

        </div>

        {/* Search */}

        <div className="relative mb-6 w-full md:mb-8 md:max-w-md">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border bg-white py-3 pl-12 pr-4 outline-none transition focus:border-black"
          />

        </div>

        {/* Result Count */}

        <div className="mb-4 text-sm text-gray-500">
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1
            ? "category"
            : "categories"}
        </div>

        {/* ========================= */}
        {/* MOBILE CATEGORY CARDS */}
        {/* ========================= */}

        <div className="space-y-4 md:hidden">

          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <p className="text-gray-500">
                No categories found.
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl bg-white p-5 shadow"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Category
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      {category.name}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      category.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.status}
                  </span>

                </div>

                {/* Actions */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <Link
                    href={`/admin/categories/edit/${category.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 font-medium text-white transition hover:bg-yellow-600"
                  >
                    <Pencil size={17} />
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      deleteCategory(category.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* ========================= */}
        {/* DESKTOP TABLE */}
        {/* ========================= */}

        <div className="hidden overflow-x-auto rounded-2xl bg-white shadow md:block">

          <table className="w-full min-w-[650px]">

            <thead className="bg-black text-white">

              <tr>

                <th className="px-5 py-4 text-left">
                  Category
                </th>

                <th className="px-5 py-4 text-left">
                  Status
                </th>

                <th className="px-5 py-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCategories.length === 0 ? (

                <tr>

                  <td
                    colSpan={3}
                    className="p-10 text-center text-gray-500"
                  >
                    No categories found.
                  </td>

                </tr>

              ) : (

                filteredCategories.map(
                  (category) => (

                    <tr
                      key={category.id}
                      className="border-b transition hover:bg-gray-50"
                    >

                      <td className="px-5 py-5 font-semibold">
                        {category.name}
                      </td>

                      <td className="px-5 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            category.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.status}
                        </span>

                      </td>

                      <td className="px-5 py-5">

                        <div className="flex justify-center gap-3">

                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            title="Edit Category"
                            className="rounded-lg bg-yellow-500 p-3 text-white transition hover:bg-yellow-600"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() =>
                              deleteCategory(
                                category.id
                              )
                            }
                            title="Delete Category"
                            className="rounded-lg bg-red-500 p-3 text-white transition hover:bg-red-600"
                          >
                            <Trash2 size={18} />
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