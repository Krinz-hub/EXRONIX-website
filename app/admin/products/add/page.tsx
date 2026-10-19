"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadProductImage } from "@/lib/storageService";
import { addProduct } from "@/lib/products";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Multiple product images
  const [images, setImages] = useState<string[]>([]);

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const remainingSlots = 4 - images.length;

    if (remainingSlots <= 0) {
      toast.error("You can upload a maximum of 4 images.");
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.error(
        `Only ${remainingSlots} more image${
          remainingSlots > 1 ? "s" : ""
        } can be added.`
      );
    }

    try {
      setUploading(true);

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const imageUrl = await uploadProductImage(file);

        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error("No images were uploaded.");
      }

      setImages((prev) => [...prev, ...uploadedUrls]);

      toast.success(
        `${uploadedUrls.length} image${
          uploadedUrls.length > 1 ? "s" : ""
        } uploaded successfully.`
      );
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        "One or more images failed to upload. Please try again."
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // =====================================================
  // SIZE TOGGLE
  // =====================================================

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  // =====================================================
  // COLOR TOGGLE
  // =====================================================

  const toggleColor = (color: string) => {
    setColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const saveProduct = async () => {
    if (!name.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (!price || Number(price) < 0) {
      toast.error("Please enter a valid product price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter a valid stock quantity.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    if (sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }

    if (colors.length === 0) {
      toast.error("Please select at least one color.");
      return;
    }

    try {
      setSaving(true);

      const mainImage = images[0] || "";
      const image2 = images[1] || null;
      const image3 = images[2] || null;
      const image4 = images[3] || null;

      /*
       * IMPORTANT:
       * We do NOT send "status".
       *
       * Product status is calculated automatically from stock:
       *
       * 0       -> Out of Stock
       * 1 - 5   -> Low Stock
       * 6+      -> In Stock
       */

      await addProduct({
        name: name.trim(),
        category,

        image: mainImage,

        image2,
        image3,
        image4,
        images,

        description: `${name.trim()} - Premium quality product`,

        price: Number(price),
        stock: Number(stock),

        sizes,
        colors,
      });

      toast.success("Product added successfully!");

      router.push("/admin/products");
    } catch (error: any) {
      console.error("Save Product Error:", error);

      toast.error(
        error?.message ||
          "Failed to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Add Product
          </h1>

          <Link
            href="/admin/products"
            className="rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
          >
            Back
          </Link>
        </div>

        {/* FORM */}

        <div className="rounded-2xl bg-white p-5 shadow sm:p-8">
          <div className="space-y-6">

            {/* PRODUCT NAME */}

            <div>
              <label className="mb-2 block font-semibold">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter product name"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-black"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block font-semibold">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none"
              >
                <option>T-Shirts</option>
                <option>Oversized</option>
                <option>Hoodies</option>
                <option>Accessories</option>
                <option>Linen Pants</option>
              </select>
            </div>

            {/* PRICE + STOCK */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

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
                  placeholder="Enter price"
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
                  placeholder="Enter stock quantity"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

            </div>

            {/* SIZES */}

            <div>
              <label className="mb-3 block font-semibold">
                Sizes
              </label>

              <div className="flex flex-wrap gap-3">
                {["S", "M", "L", "XL", "XXL"].map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        toggleSize(size)
                      }
                      className={`rounded-lg border px-5 py-3 transition ${
                        sizes.includes(size)
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* COLORS */}

            <div>
              <label className="mb-3 block font-semibold">
                Colors
              </label>

              <div className="flex flex-wrap gap-3">
                {[
                  "Black",
                  "White",
                  "Coffee",
                  "Cream",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      toggleColor(color)
                    }
                    className={`rounded-lg border px-5 py-3 transition ${
                      colors.includes(color)
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT IMAGES */}

            <div>
              <label className="mb-2 block font-semibold">
                Product Images
              </label>

              <p className="mb-4 text-sm text-gray-500">
                Upload up to 4 images. The first image
                will be the main product image.
              </p>

              {/* UPLOAD */}

              <label
                htmlFor="product-images"
                className={`flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition ${
                  uploading || images.length >= 4
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-black hover:bg-gray-100"
                }`}
              >
                <div className="text-5xl">
                  {uploading ? "⏳" : "📷"}
                </div>

                <p className="mt-4 text-lg font-semibold">
                  {uploading
                    ? "Uploading images..."
                    : images.length >= 4
                    ? "Maximum images uploaded"
                    : "Click to Upload Product Images"}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG, WEBP • Maximum 4 images
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {images.length}/4 images selected
                </p>

                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={
                    uploading ||
                    images.length >= 4
                  }
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* PREVIEW */}

              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {images.map(
                    (imageUrl, index) => (
                      <div
                        key={`${imageUrl}-${index}`}
                        className="relative overflow-hidden rounded-xl border bg-gray-50"
                      >
                        <img
                          src={imageUrl}
                          alt={`Product image ${
                            index + 1
                          }`}
                          className="aspect-square w-full object-cover"
                        />

                        {/* MAIN */}

                        {index === 0 && (
                          <div className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                            Main
                          </div>
                        )}

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* SAVE */}

            <button
              type="button"
              onClick={saveProduct}
              disabled={saving || uploading}
              className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving Product..."
                : "Save Product"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}