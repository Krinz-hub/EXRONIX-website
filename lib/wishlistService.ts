import { supabase } from "./supabase";

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .select(`
      product_id,
      products (*)
    `)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function addToWishlist(
  userId: string,
  productId: number
) {
  const { error } = await supabase
    .from("wishlist")
    .insert({
      user_id: userId,
      product_id: productId,
    });

  if (error) throw error;
}

export async function removeFromWishlist(
  userId: string,
  productId: number
) {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}

export async function isWishlisted(
  userId: string,
  productId: number
) {
  const { data } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  return !!data;
}