"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductDetails({
  product,
}: any) {
  const [selectedImage, setSelectedImage] = useState(
    product.image
  );

  const [size, setSize] = useState(
    product.sizes?.[0] || ""
  );

  const [color, setColor] = useState(
    product.colors?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);

  return (
    <section className="bg-white pt-28 pb-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">

        {/* LEFT */}

        <div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100">

            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />

          </div>

        </div>

        {/* RIGHT */}

        <div>

          {/* Product Name */}

          <h1 className="text-3xl font-bold leading-tight lg:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}

          <div className="mt-5 flex items-center gap-3">

            <div className="flex text-xl text-yellow-500">
              ★★★★★
            </div>

            <span className="text-sm text-gray-500">
              (24 Reviews)
            </span>

          </div>

          {/* Price */}

          <p className="mt-6 text-3xl font-bold lg:text-4xl">
            NPR {product.price.toLocaleString()}
          </p>

          {/* Description */}

          <p className="mt-6 leading-8 text-gray-600">
            {product.description ||
              "Designed for everyday comfort with premium materials and a timeless minimalist aesthetic. Crafted with premium fabric to deliver exceptional comfort, durability, and effortless everyday style."}
          </p>

          {/* Size */}

          {product.sizes?.length > 0 && (

            <div className="mt-10">

              <h3 className="mb-4 text-lg font-semibold">
                Size
              </h3>

              <div className="flex flex-wrap gap-3">

                {product.sizes.map((item: string) => (

                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border font-medium transition ${
                      size === item
                        ? "border-black bg-black text-white"
                        : "hover:border-black"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Color */}

          {product.colors?.length > 0 && (

            <div className="mt-8">

              <h3 className="mb-4 text-lg font-semibold">
                Color
              </h3>

              <div className="flex flex-wrap gap-3">

                {product.colors.map((item: string) => (

                  <button
                    key={item}
                    onClick={() => setColor(item)}
                    className={`rounded-full border px-5 py-2 font-medium transition ${
                      color === item
                        ? "bg-black text-white"
                        : "hover:border-black"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Quantity */}

          <div className="mt-10">

            <h3 className="mb-4 text-lg font-semibold">
              Quantity
            </h3>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border">

              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                className="px-5 py-3 text-xl transition hover:bg-gray-100"
              >
                −
              </button>

              <span className="min-w-16 text-center font-semibold">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-5 py-3 text-xl transition hover:bg-gray-100"
              >
                +
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}