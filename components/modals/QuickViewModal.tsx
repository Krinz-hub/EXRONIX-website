"use client";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  sizes?: string[];
  colors?: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
};

export default function QuickViewModal({
  open,
  onClose,
  product,
}: Props) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open || !product) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl liquid-glass border border-white/15 bg-[#12151B]/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 z-20 rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          <X size={24} />
        </button>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">

          {/* Image */}

          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#050608] border border-white/10">

            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />

          </div>

          {/* Details */}

          <div className="flex flex-col justify-center">

            <span className="text-xs font-semibold uppercase tracking-wider text-[#1677FF]">
              EXRONIX Engineering
            </span>

            <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {product.name}
            </h2>

            <p className="mt-3 text-2xl sm:text-3xl font-black text-[#1677FF]">
              NPR {product.price.toLocaleString()}
            </p>

            {/* Sizes / Specs */}

            {product.sizes?.length ? (
              <>
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Scale / Spec
                </h3>

                <div className="mt-2.5 flex flex-wrap gap-2.5">

                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selectedSize === size
                          ? "bg-[#1677FF] text-white border-[#1677FF] shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                          : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}

                </div>
              </>
            ) : null}

            {/* Colors / Material */}

            {product.colors?.length ? (
              <>
                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Material Finish
                </h3>

                <div className="mt-2.5 flex flex-wrap gap-2.5">

                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selectedColor === color
                          ? "bg-[#1677FF] text-white border-[#1677FF] shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                          : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {color}
                    </button>
                  ))}

                </div>
              </>
            ) : null}

            {/* Quantity */}

            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Quantity
            </h3>

            <div className="mt-2.5 flex w-36 items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">

              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
                className="text-gray-400 hover:text-white transition"
              >
                <Minus size={18} />
              </button>

              <span className="font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className="text-gray-400 hover:text-white transition"
              >
                <Plus size={18} />
              </button>

            </div>

            <button
              onClick={() => {
                addToCart(
                  {
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    size: selectedSize,
                    color: selectedColor,
                  },
                  quantity
                );

                toast.success(`${product.name} added to cart!`);

                onClose();
              }}
              className="mt-8 w-full rounded-xl bg-[#1677FF] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 active:scale-[0.99]"
            >
              Add To Cart
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}