"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { getProductById } from "@/lib/productService";
import { updateCart } from "@/lib/events";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock?: number;
  size?: string;
  color?: string;
};

type Props = {
  product: Product;
  quantity: number;
};

export default function AddToCartButton({
  product,
  quantity,
}: Props) {
  const router = useRouter();

  const { user } = useAuth();
  const { cart, addToCart } = useCart();

  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    if (loading) return;

    if (!user) {
      toast.error(
        "Please login to add items to your cart."
      );

      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // Always check the latest stock
      const latestProduct =
        await getProductById(product.id);

      if (!latestProduct) {
        toast.error("Product not found.");
        return;
      }

      if (latestProduct.stock <= 0) {
        toast.error(
          "This product is out of stock."
        );
        return;
      }

      // Check existing matching variant
      const existingItem = cart.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );

      const currentQuantity =
        existingItem?.quantity ?? 0;

      // Prevent exceeding available stock
      if (
        currentQuantity + quantity >
        latestProduct.stock
      ) {
        toast.error(
          `Only ${latestProduct.stock} item${
            latestProduct.stock > 1
              ? "s are"
              : " is"
          } available.`
        );

        return;
      }

      await addToCart(
        product,
        quantity
      );

      updateCart();

      toast.success(
        "Added to cart successfully!"
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading}
      aria-label={
        loading
          ? "Adding product to cart"
          : "Add product to cart"
      }
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-base font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 sm:text-lg"
    >
      {loading ? (
        <>
          <Loader2
            size={20}
            className="animate-spin"
          />

          <span>Adding...</span>
        </>
      ) : (
        <>
          <ShoppingBag size={20} />

          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}