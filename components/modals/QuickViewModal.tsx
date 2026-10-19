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
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl bg-white p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6"
        >
          <X size={28} />
        </button>

        <div className="grid gap-10 md:grid-cols-2">

          {/* Image */}

          <div className="overflow-hidden rounded-2xl bg-gray-100">

            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={700}
              className="h-full w-full object-cover"
            />

          </div>

          {/* Details */}

          <div>

            <h2 className="text-4xl font-bold">
              {product.name}
            </h2>

            <p className="mt-3 text-3xl font-bold">
              NPR {product.price.toLocaleString()}
            </p>

            {/* Sizes */}

            {product.sizes?.length ? (
              <>
                <h3 className="mt-8 font-semibold">
                  Size
                </h3>

                <div className="mt-3 flex gap-3">

                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`rounded-lg border px-5 py-2 ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}

                </div>
              </>
            ) : null}

            {/* Colors */}

            {product.colors?.length ? (
              <>
                <h3 className="mt-8 font-semibold">
                  Color
                </h3>

                <div className="mt-3 flex gap-3">

                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`rounded-full border px-5 py-2 ${
                        selectedColor === color
                          ? "bg-black text-white"
                          : ""
                      }`}
                    >
                      {color}
                    </button>
                  ))}

                </div>
              </>
            ) : null}

            {/* Quantity */}

            <h3 className="mt-8 font-semibold">
              Quantity
            </h3>

            <div className="mt-3 flex w-40 items-center justify-between rounded-xl border p-2">

              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
              >
                <Minus />
              </button>

              <span className="font-bold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
              >
                <Plus />
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
  className="mt-10 w-full rounded-xl bg-black py-4 text-lg font-semibold text-white transition hover:bg-gray-800"
>
  Add To Cart
</button>

          </div>

        </div>
      </div>
    </div>
  );
}