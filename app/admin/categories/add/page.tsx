"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const saveCategory = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      const existing = JSON.parse(
        localStorage.getItem("exronix-categories") || "[]"
      );
      existing.push({
        id: Date.now(),
        name: name.trim(),
        status: "Active",
      });
      localStorage.setItem(
        "exronix-categories",
        JSON.stringify(existing)
      );

      toast.success("Category created successfully!");

      router.push("/admin/categories");
    } catch (error) {
      console.error("Create Category Error:", error);

      toast.error("Failed to create category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Add Category
          </h1>

          <Link
            href="/admin/categories"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Back
          </Link>
        </div>

        {/* Form */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-sm sm:p-8 text-white">
          <div className="space-y-6">

            {/* Category Name */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter category name"
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14] p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

            {/* Save */}

            <button
              type="button"
              onClick={saveCategory}
              disabled={saving}
              className="w-full rounded-xl bg-[#1677FF] py-3.5 text-base font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Category"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}