"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { uploadProductImage } from "@/lib/storageService";
import { addProduct } from "@/lib/products";
import { toast } from "sonner";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Computer Mice");
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
    <main className="min-h-screen bg-transparent px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Add Product
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Create a new hardware listing in the EXRONIX store catalog.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Back
          </Link>
        </div>

        {/* FORM */}

        <div className="rounded-3xl border border-white/10 bg-[#0e1219] p-6 shadow-2xl sm:p-10">
          <div className="space-y-6">

            {/* PRODUCT NAME */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. EXRONIX Stealth Pro M4"
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

            {/* CATEGORY */}

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
                <option value="Computer Mice" className="bg-[#0b0e14] text-white">Computer Mice</option>
                <option value="PC Cabinets" className="bg-[#0b0e14] text-white">PC Cabinets</option>
                <option value="Headphone Stands" className="bg-[#0b0e14] text-white">Headphone Stands</option>
              </select>
            </div>

            {/* PRICE + STOCK */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

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
                  placeholder="e.g. 5499"
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
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
                  placeholder="e.g. 25"
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
                />
              </div>

            </div>

            {/* SIZES */}

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-300">
                Sizes / Specs
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

            {/* COLORS */}

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-300">
                Colors / Finishes
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

            {/* PRODUCT IMAGES */}

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-300">
                Product Images
              </label>

              <p className="mb-4 text-xs text-gray-400">
                Upload up to 4 images. The first image will be the primary catalog visual.
              </p>

              {/* UPLOAD */}

              <label
                htmlFor="product-images"
                className={`flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-[#080a0f]/80 p-6 text-center transition ${
                  uploading || images.length >= 4
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[#1677FF]/60 hover:bg-[#1677FF]/5"
                }`}
              >
                <div className="flex items-center justify-center">
                  {uploading ? (
                    <LoadingAnimation size="sm" text="" subtext="" />
                  ) : (
                    <div className="text-4xl text-gray-400">📷</div>
                  )}
                </div>

                <p className="mt-4 text-base font-semibold text-white">
                  {uploading
                    ? "Uploading images..."
                    : images.length >= 4
                    ? "Maximum images uploaded"
                    : "Click to Upload Product Images"}
                </p>

                <p className="mt-1.5 text-xs text-gray-400">
                  JPG, PNG, WEBP • Maximum 4 images
                </p>

                <p className="mt-1 text-xs text-[#1677FF] font-semibold">
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
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080a0f]"
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
                          <div className="absolute left-2 top-2 rounded-full bg-[#1677FF] px-2.5 py-0.5 text-xs font-bold text-white shadow">
                            Main
                          </div>
                        )}

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white transition hover:bg-red-700"
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoadingAnimation size="xs" />
                  <span>Saving Product...</span>
                </>
              ) : (
                "Save Product"
              )}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}