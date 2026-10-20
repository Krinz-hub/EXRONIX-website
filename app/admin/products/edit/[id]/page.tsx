"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  getProductById,
  updateProduct,
} from "@/lib/productService";
import LoadingAnimation from "@/components/LoadingAnimation";

type ProductStatus = "Active" | "Inactive";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Computer Mice");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] =
    useState<ProductStatus>("Active");

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  /* =========================================
     LOAD PRODUCT FROM SUPABASE
  ========================================= */

  useEffect(() => {
    async function loadProduct() {
      const id = Number(params.id);

      if (!id) {
        toast.error("Invalid product ID.");
        router.push("/admin/products");
        return;
      }

      try {
        setLoading(true);

        const product = await getProductById(id);

        if (!product) {
          toast.error("Product not found.");
          router.push("/admin/products");
          return;
        }

        setName(product.name);
        setCategory(product.category);
        setPrice(String(product.price));
        setStock(String(product.stock));
        setImage(product.image);
        setDescription(product.description || "");
        setSizes(product.sizes || []);
        setColors(product.colors || []);

        /*
         * Product status is determined from stock.
         * Active means the product is available.
         */
        setStatus(
          product.stock > 0
            ? "Active"
            : "Inactive"
        );
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        toast.error(
          "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id, router]);

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  /* =========================================
     SIZE
  ========================================= */

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  /* =========================================
     COLOR
  ========================================= */

  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  /* =========================================
     UPDATE PRODUCT
  ========================================= */

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Please enter product name.");
      return;
    }

    if (!price || Number(price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter a valid stock.");
      return;
    }

    if (!image) {
      toast.error("Please add a product image.");
      return;
    }

    const id = Number(params.id);

    if (!id) {
      toast.error("Invalid product ID.");
      return;
    }

    try {
      setSaving(true);

      await updateProduct(id, {
        name: name.trim(),
        category,
        price: Number(price),
        stock: Number(stock),
        image,
        description: description.trim(),
        sizes,
        colors,
      });

      toast.success(
        "Product updated successfully!"
      );

      /*
       * Go back to products after Supabase
       * confirms the update.
       */
      router.push("/admin/products");

      router.refresh();
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent px-6 py-32 flex items-center justify-center">
        <LoadingAnimation size="lg" text="PREPARING EDITOR" subtext="EXRONIX CATALOG" />
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-transparent px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Edit Product
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Update product pricing, stock availability, and specs.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Back
          </Link>

        </div>

        {/* Form */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-10">

          <div className="space-y-6">

            {/* Product Name */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Product Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                placeholder="Product name"
              />
            </div>

            {/* Category */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
              >
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
            </div>

            {/* Price + Stock */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Price (NPR)
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Stock Units
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Current stock:{" "}
                  <strong className="text-white">{Number(stock) || 0}</strong>
                </p>
              </div>

            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                placeholder="Product description"
              />
            </div>

            {/* Image */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-sm text-gray-300"
              />

              {image && (
                <div className="mt-5">
                  <img
                    src={image}
                    alt="Product preview"
                    className="h-52 w-52 rounded-2xl border border-white/10 bg-[#080a0f] object-cover"
                  />
                </div>
              )}
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as ProductStatus
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1677FF]"
              >
                <option value="Active" className="bg-[#0b0e14] text-white">
                  Active
                </option>

                <option value="Inactive" className="bg-[#0b0e14] text-white">
                  Inactive
                </option>
              </select>

              <p className="mt-2 text-xs text-gray-400">
                Stock status is automatically calculated
                from the stock quantity.
              </p>
            </div>

            {/* Sizes */}

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-300">
                Sizes
              </label>

              <div className="flex flex-wrap gap-3">

                {["XS", "S", "M", "L", "XL", "XXL"].map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        toggleSize(size)
                      }
                      className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                        sizes.includes(size)
                          ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                          : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}

              </div>
            </div>

            {/* Colors */}

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-300">
                Colors
              </label>

              <div className="flex flex-wrap gap-3">

                {[
                  "Black",
                  "White",
                  "Cream",
                  "Brown",
                  "Grey",
                  "Beige",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      toggleColor(color)
                    }
                    className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                      colors.includes(color)
                        ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                        : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}

              </div>
            </div>

            {/* Update */}

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoadingAnimation size="xs" />
                  <span>Updating Product...</span>
                </>
              ) : (
                "Update Product"
              )}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}