"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

import ProductOptions from "./ProductOptions";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCartButton";

import { useAuth } from "@/context/AuthContext";
import { getProductById } from "@/lib/productService";
import { toast } from "sonner";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
  size?: string;
  color?: string;
};

export default function ProductActions({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || ""
  );

  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || ""
  );

  const [buyingNow, setBuyingNow] = useState(false);

  /* =========================================
     BUY NOW
  ========================================= */

  async function handleBuyNow() {
    if (!user) {
      toast.error("Please login to continue.");
      router.push("/login");
      return;
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    if (quantity > product.stock) {
      toast.error(
        `Only ${product.stock} item${
          product.stock > 1 ? "s are" : " is"
        } available.`
      );
      return;
    }

    setBuyingNow(true);

    try {
      // Get the latest product information
      const latestProduct = await getProductById(product.id);

      if (!latestProduct) {
        toast.error("Product not found.");
        return;
      }

      if (latestProduct.stock <= 0) {
        toast.error("This product is out of stock.");
        return;
      }

      if (quantity > latestProduct.stock) {
        toast.error(
          `Only ${latestProduct.stock} item${
            latestProduct.stock > 1 ? "s are" : " is"
          } available.`
        );
        return;
      }

      /*
       * Store only this product for direct checkout.
       * The normal cart is NOT modified.
       */

      const buyNowItem = {
        id: latestProduct.id,
        name: latestProduct.name,
        price: latestProduct.price,
        image: latestProduct.image,
        quantity,
        size: selectedSize,
        color: selectedColor,
      };

      localStorage.setItem(
        "exronix-buy-now",
        JSON.stringify(buyNowItem)
      );

      router.push("/checkout");
    } catch (error) {
      console.error("Buy Now Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBuyingNow(false);
    }
  }

  return (
    <>
      {/* Product Options */}

      <div className="mt-8">
        <ProductOptions
          sizes={product.sizes}
          colors={product.colors}
          onChange={(size, color) => {
            setSelectedSize(size);
            setSelectedColor(color);
          }}
        />
      </div>

      {/* Quantity */}

      {product.stock > 0 && (
        <div className="mt-8">
          <QuantitySelector
            quantity={quantity}
            stock={product.stock}
            setQuantity={setQuantity}
          />
        </div>
      )}

      {/* Buttons */}

      <div className="mt-8 space-y-4">
        {product.stock > 0 ? (
          <>
            {/* Add To Cart */}

            <AddToCartButton
              product={{
                ...product,
                size: selectedSize,
                color: selectedColor,
              }}
              quantity={quantity}
            />

            {/* Buy Now */}

            <button
              onClick={handleBuyNow}
              disabled={buyingNow}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1677FF] bg-transparent text-[#1677FF] py-3.5 sm:py-4 text-base sm:text-lg font-bold transition hover:bg-[#1677FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_20px_rgba(22,119,255,0.2)]"
            >
              {buyingNow ? (
                <>
                  <LoadingAnimation size="xs" />
                  Preparing Checkout...
                </>
              ) : (
                "Buy Now"
              )}
            </button>
          </>
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-white/10 py-4 text-base sm:text-lg font-semibold text-gray-400 border border-white/10"
          >
            Out of Stock
          </button>
        )}
      </div>

      {/* Trust Section */}

      <div className="mt-8 space-y-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 text-gray-300">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 shrink-0 text-[#1677FF]" />

          <span className="text-sm font-medium text-gray-300">
            Express delivery all over Nepal (2-4 business days)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 shrink-0 text-[#1677FF]" />

          <span className="text-sm font-medium text-gray-300">
            Hassle-free 7-day replacement guarantee
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#1677FF]" />

          <span className="text-sm font-medium text-gray-300">
            Official 1-Year EXRONIX Warranty & Cash on Delivery (COD)
          </span>
        </div>
      </div>
    </>
  );
}