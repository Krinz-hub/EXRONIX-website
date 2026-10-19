import { supabase } from "./supabase";

export type Review = {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  review: string;
  created_at: string;
};

export async function getReviews(productId: number) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function addReview(
  userId: string,
  productId: number,
  rating: number,
  review: string
) {
  const { error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      product_id: productId,
      rating,
      review,
    });

  if (error) throw error;
}

export async function deleteReview(id: number) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
export async function hasPurchasedProduct(
  userId: string,
  productId: number
) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_items!inner (
        product_id
      )
    `)
    .eq("user_id", userId)
    .eq("order_items.product_id", productId);

  if (error) {
    console.error(error);
    return false;
  }

  return data.length > 0;
}
export async function getRecentReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      products(name, image)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}