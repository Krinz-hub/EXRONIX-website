"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  getProductById,
  updateProduct,
} from "@/lib/productService";

type ProductStatus = "Active" | "Inactive";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("T-Shirts");
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
      <main className="min-h-screen bg-gray-100 px-6 py-32">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow">
          <p className="text-lg font-semibold">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <h1 className="text-4xl font-bold">
            Edit Product
          </h1>

          <Link
            href="/admin/products"
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Back
          </Link>

        </div>

        {/* Form */}

        <div className="rounded-2xl bg-white p-8 shadow">

          <div className="space-y-6">

            {/* Product Name */}

            <div>
              <label className="mb-2 block font-semibold">
                Product Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                placeholder="Product name"
              />
            </div>

            {/* Category */}

            <div>
              <label className="mb-2 block font-semibold">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              >
                <option value="T-Shirts">
                  T-Shirts
                </option>

                <option value="Oversized">
                  Oversized
                </option>

                <option value="Hoodies">
                  Hoodies
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>
            </div>

            {/* Price + Stock */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Current stock:{" "}
                  {Number(stock) || 0}
                </p>
              </div>

            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block font-semibold">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                placeholder="Product description"
              />
            </div>

            {/* Image */}

            <div>
              <label className="mb-2 block font-semibold">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg border border-gray-300 p-3"
              />

              {image && (
                <div className="mt-5">
                  <img
                    src={image}
                    alt="Product preview"
                    className="h-52 w-52 rounded-xl border object-cover"
                  />
                </div>
              )}
            </div>

            {/* Status */}

            <div>
              <label className="mb-2 block font-semibold">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as ProductStatus
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

              <p className="mt-2 text-sm text-gray-500">
                Stock status is automatically calculated
                from the stock quantity.
              </p>
            </div>

            {/* Sizes */}

            <div>
              <label className="mb-3 block font-semibold">
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
                      className={`rounded-lg border px-5 py-2 font-semibold transition ${
                        sizes.includes(size)
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-black"
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
              <label className="mb-3 block font-semibold">
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
                    className={`rounded-lg border px-5 py-2 font-semibold transition ${
                      colors.includes(color)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-black"
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
              className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Updating Product..."
                : "Update Product"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}