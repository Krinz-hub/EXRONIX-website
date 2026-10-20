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
    <section className="bg-transparent text-white pt-28 pb-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">

        {/* LEFT */}

        <div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 bg-[#050608]/70 shadow-2xl backdrop-blur-xl">

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

        <div className="flex flex-col justify-center">

          {/* Product Name */}

          <h1 className="text-3xl font-black uppercase tracking-tight text-white lg:text-5xl">
            {product.name}
          </h1>

          {/* Rating / Category */}

          <div className="mt-4 flex items-center gap-3">

            <span className="rounded-full border border-[#1677FF]/50 bg-[#1677FF]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1677FF]">
              {product.category || "PC HARDWARE"}
            </span>

            <span className="text-sm text-gray-400">
              Verified Precision Build
            </span>

          </div>

          {/* Price */}

          <p className="mt-6 text-3xl font-black text-[#1677FF] lg:text-4xl">
            NPR {product.price.toLocaleString()}
          </p>

          {/* Description */}

          <p className="mt-6 leading-7 text-gray-300">
            {product.description ||
              "Engineered for high-performance computing and clean desk environments with aerospace-grade materials, precision tolerances, and verified durability."}
          </p>

          {/* Variant / Form Factor */}

          {product.sizes?.length > 0 && (

            <div className="mt-8">

              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Variant / Form Factor
              </h3>

              <div className="flex flex-wrap gap-3">

                {product.sizes.map((item: string) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    className={`flex min-h-11 items-center justify-center rounded-xl border px-4 text-xs font-semibold uppercase tracking-wider transition ${
                      size === item
                        ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                        : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Color / Finish */}

          {product.colors?.length > 0 && (

            <div className="mt-6">

              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Material Finish
              </h3>

              <div className="flex flex-wrap gap-3">

                {product.colors.map((item: string) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      color === item
                        ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                        : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          )}

          {/* Quantity */}

          <div className="mt-8">

            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Quantity
            </h3>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/20 bg-white/5">

              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                className="px-4 py-2.5 text-lg text-white transition hover:bg-white/10"
              >
                −
              </button>

              <span className="min-w-14 text-center text-sm font-bold text-white">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2.5 text-lg text-white transition hover:bg-white/10"
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