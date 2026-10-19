"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import { getProductById } from "@/lib/productService";

import {
  getCart,
  addToCart as addCartItem,
  removeFromCart as removeCartItem,
  updateCartQuantity,
  clearCart as clearUserCart,
} from "@/lib/cartService";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
};

export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    product: Product,
    quantity?: number
  ) => Promise<void>;

  removeFromCart: (
    id: number,
    size?: string,
    color?: string
  ) => Promise<void>;

  increaseQuantity: (
    id: number,
    size?: string,
    color?: string
  ) => Promise<void>;

  decreaseQuantity: (
    id: number,
    size?: string,
    color?: string
  ) => Promise<void>;

  clearCart: () => Promise<void>;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

/* =========================================
   FORMAT DATABASE CART
========================================= */

function formatCart(data: any[]): CartItem[] {
  return data
    .filter((item) => item.products)
    .map((item: any) => ({
      id: item.products.id,
      name: item.products.name,
      image: item.products.image,
      price: item.products.price,
      quantity: item.quantity,
      size: item.size ?? undefined,
      color: item.color ?? undefined,
    }));
}

/* =========================================
   CART PROVIDER
========================================= */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);

  /* =========================================
     LOAD CART
  ========================================= */

  async function loadCart() {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const data = await getCart(user.id);

      const formatted = formatCart(data);

      setCart(formatted);

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    }
  }

  useEffect(() => {
    loadCart();
  }, [user]);

  /* =========================================
     ADD TO CART
  ========================================= */

  async function addToCart(
    product: Product,
    quantity = 1
  ): Promise<void> {
    if (!user) {
      toast.error(
        "Please login to add items to your cart."
      );
      return;
    }

    if (quantity <= 0) {
      toast.error("Invalid quantity.");
      return;
    }

    try {
      /* Get latest product stock */

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

      /* Find SAME product + SAME variant */

      const existing = cart.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );

      const currentQty =
        existing?.quantity ?? 0;

      /* Stock validation */

      if (
        currentQty + quantity >
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

      /* Add to database */

      await addCartItem(
        user.id,
        product.id,
        quantity,
        product.size,
        product.color
      );

      /* Reload cart */

      await loadCart();
    } catch (error) {
      console.error(
        "Add to cart failed:",
        error
      );

      toast.error(
        "Failed to add product to cart."
      );
    }
  }

  /* =========================================
     REMOVE FROM CART
  ========================================= */

  async function removeFromCart(
    id: number,
    size?: string,
    color?: string
  ): Promise<void> {
    if (!user) return;

    try {
      await removeCartItem(
        user.id,
        id,
        size,
        color
      );

      await loadCart();

      toast.success(
        "Item removed from cart."
      );
    } catch (error) {
      console.error(
        "Remove cart item failed:",
        error
      );

      toast.error(
        "Failed to remove item."
      );
    }
  }

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  async function increaseQuantity(
    id: number,
    size?: string,
    color?: string
  ): Promise<void> {
    if (!user) return;

    const item = cart.find(
      (product) =>
        product.id === id &&
        product.size === size &&
        product.color === color
    );

    if (!item) return;

    try {
      const latestProduct =
        await getProductById(id);

      if (!latestProduct) {
        toast.error(
          "Product not found."
        );
        return;
      }

      if (
        item.quantity >=
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

      await updateCartQuantity(
        user.id,
        id,
        item.quantity + 1,
        size,
        color
      );

      await loadCart();
    } catch (error) {
      console.error(
        "Increase quantity failed:",
        error
      );

      toast.error(
        "Failed to update quantity."
      );
    }
  }

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  async function decreaseQuantity(
    id: number,
    size?: string,
    color?: string
  ): Promise<void> {
    if (!user) return;

    const item = cart.find(
      (product) =>
        product.id === id &&
        product.size === size &&
        product.color === color
    );

    if (!item) return;

    try {
      if (item.quantity <= 1) {
        await removeCartItem(
          user.id,
          id,
          size,
          color
        );
      } else {
        await updateCartQuantity(
          user.id,
          id,
          item.quantity - 1,
          size,
          color
        );
      }

      await loadCart();
    } catch (error) {
      console.error(
        "Decrease quantity failed:",
        error
      );

      toast.error(
        "Failed to update quantity."
      );
    }
  }

  /* =========================================
     CLEAR CART
  ========================================= */

  async function clearCart(): Promise<void> {
    if (!user) return;

    try {
      await clearUserCart(user.id);

      setCart([]);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      toast.success(
        "Cart cleared."
      );
    } catch (error) {
      console.error(
        "Clear cart failed:",
        error
      );

      toast.error(
        "Failed to clear cart."
      );
    }
  }

  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================================
   USE CART
========================================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}