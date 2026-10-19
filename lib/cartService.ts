import { supabase } from "./supabase";

/**
 * Get all cart items for a user
 */
export async function getCart(userId: string) {
  const { data, error } = await supabase
    .from("cart")
    .select(`
      quantity,
      size,
      color,
      product_id,
      products (*)
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Get cart error:", error);
    return [];
  }

  return data;
}

/**
 * Add product to cart.
 *
 * A product with a different size/color is treated
 * as a separate cart item.
 */
export async function addToCart(
  userId: string,
  productId: number,
  quantity: number,
  size?: string,
  color?: string
) {
  let query = supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId);

  // Match size
  if (size) {
    query = query.eq("size", size);
  } else {
    query = query.is("size", null);
  }

  // Match color
  if (color) {
    query = query.eq("color", color);
  } else {
    query = query.is("color", null);
  }

  const { data: existing, error: existingError } =
    await query.maybeSingle();

  if (existingError) {
    throw existingError;
  }

  // Same product + same size + same color
  if (existing) {
    const { error } = await supabase
      .from("cart")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id);

    if (error) throw error;

    return;
  }

  // New variant
  const { error } = await supabase
    .from("cart")
    .insert({
      user_id: userId,
      product_id: productId,
      quantity,
      size: size ?? null,
      color: color ?? null,
    });

  if (error) throw error;
}

/**
 * Update quantity for a specific product variant.
 */
export async function updateCartQuantity(
  userId: string,
  productId: number,
  quantity: number,
  size?: string,
  color?: string
) {
  if (quantity <= 0) {
    return removeFromCart(
      userId,
      productId,
      size,
      color
    );
  }

  let query = supabase
    .from("cart")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (size) {
    query = query.eq("size", size);
  } else {
    query = query.is("size", null);
  }

  if (color) {
    query = query.eq("color", color);
  } else {
    query = query.is("color", null);
  }

  const { error } = await query;

  if (error) throw error;
}

/**
 * Remove a specific product variant.
 */
export async function removeFromCart(
  userId: string,
  productId: number,
  size?: string,
  color?: string
) {
  let query = supabase
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (size) {
    query = query.eq("size", size);
  } else {
    query = query.is("size", null);
  }

  if (color) {
    query = query.eq("color", color);
  } else {
    query = query.is("color", null);
  }

  const { error } = await query;

  if (error) throw error;
}

/**
 * Clear the entire cart for a user.
 */
export async function clearCart(userId: string) {
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}