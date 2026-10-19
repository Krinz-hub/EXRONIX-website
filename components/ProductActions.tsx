"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, RotateCcw, Loader2 } from "lucide-react";

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
        "zayna-buy-now",
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black py-4 text-lg font-semibold transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buyingNow ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
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
            className="w-full cursor-not-allowed rounded-xl bg-gray-400 py-4 text-lg font-semibold text-white"
          >
            Out of Stock
          </button>
        )}
      </div>

      {/* Trust Section */}

      <div className="mt-10 space-y-4 rounded-2xl border bg-gray-50 p-5">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 shrink-0" />

          <span className="text-sm">
            Deliver all over Nepal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 shrink-0" />

          <span className="text-sm">
            Easy 7-day exchange
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0" />

          <span className="text-sm">
            Secure checkout & COD available
          </span>
        </div>
      </div>
    </>
  );
}