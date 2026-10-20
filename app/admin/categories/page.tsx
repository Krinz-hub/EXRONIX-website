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
      localStorage.getItem("exronix-categories") || "[]"
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
      "exronix-categories",
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
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Manage all product categories.
            </p>
          </div>

          <Link
            href="/admin/categories/add"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-5 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 sm:w-auto"
          >
            <Plus size={18} />
            Add Category
          </Link>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:mb-10 md:grid-cols-3 md:gap-6">

          {/* Total */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">

            <FolderTree
              className="mb-3 text-[#1677FF]"
              size={26}
            />

            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Total Categories
            </h2>

            <h1 className="mt-2 text-2xl font-black text-white md:text-4xl">
              {categories.length}
            </h1>

          </div>

          {/* Active */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:p-6 text-white">

            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Active
            </h2>

            <h1 className="mt-2 text-2xl font-black text-emerald-400 md:text-4xl">
              {activeCategories}
            </h1>

          </div>

          {/* Inactive */}

          <div className="col-span-2 rounded-2xl border border-white/10 bg-[#0e1219] p-4 shadow-sm transition hover:border-[#1677FF]/40 md:col-span-1 md:p-6 text-white">

            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Inactive
            </h2>

            <h1 className="mt-2 text-2xl font-black text-red-400 md:text-4xl">
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
            className="w-full rounded-xl border border-white/15 bg-[#0e1219] py-3 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
          />

        </div>

        {/* Result Count */}

        <div className="mb-4 text-sm text-gray-400">
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
            <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-10 text-center shadow">
              <p className="text-gray-400">
                No categories found.
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow text-white"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Category
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                      {category.name}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      category.status === "Active"
                        ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                        : "border border-red-500/30 bg-red-500/15 text-red-300"
                    }`}
                  >
                    {category.status}
                  </span>

                </div>

                {/* Actions */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <Link
                    href={`/admin/categories/edit/${category.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-3 font-medium text-amber-300 transition hover:bg-amber-500/30"
                  >
                    <Pencil size={17} />
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      deleteCategory(category.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 font-medium text-red-300 transition hover:bg-red-500/30"
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

        <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#0e1219] shadow md:block">

          <table className="w-full min-w-[650px] text-sm">

            <thead className="border-b border-white/10 bg-[#080a0f] text-gray-300 text-xs uppercase tracking-wider">

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

            <tbody className="divide-y divide-white/5">

              {filteredCategories.length === 0 ? (

                <tr>

                  <td
                    colSpan={3}
                    className="p-10 text-center text-gray-400"
                  >
                    No categories found.
                  </td>

                </tr>

              ) : (

                filteredCategories.map(
                  (category) => (

                    <tr
                      key={category.id}
                      className="transition hover:bg-white/5"
                    >

                      <td className="px-5 py-5 font-bold text-white">
                        {category.name}
                      </td>

                      <td className="px-5 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.status ===
                            "Active"
                              ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                              : "border border-red-500/30 bg-red-500/15 text-red-300"
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
                            className="rounded-lg border border-amber-500/30 bg-amber-500/20 p-2.5 text-amber-300 transition hover:bg-amber-500/30"
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
                            className="rounded-lg border border-red-500/30 bg-red-500/20 p-2.5 text-red-300 transition hover:bg-red-500/30"
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