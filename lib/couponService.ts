import { supabase } from "./supabase";

export type Coupon = {
  id?: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order: number;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
};

// Get all coupons
export async function getCoupons() {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// Create coupon
export async function createCoupon(
  coupon: Omit<Coupon, "id" | "used_count">
) {
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      ...coupon,
      used_count: 0,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Update coupon
export async function updateCoupon(
  id: number,
  coupon: Partial<Coupon>
) {
  const { error } = await supabase
    .from("coupons")
    .update(coupon)
    .eq("id", id);

  if (error) throw error;
}

// Delete coupon
export async function deleteCoupon(id: number) {
  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Find coupon by code
export async function getCouponByCode(
  code: string
) {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", code)
    .single();

  if (error) return null;

  return data;
}

// Increase usage count
export async function increaseCouponUsage(
  id: number
) {
  const { data } = await supabase
    .from("coupons")
    .select("used_count")
    .eq("id", id)
    .single();

  if (!data) return;

  await supabase
    .from("coupons")
    .update({
      used_count: data.used_count + 1,
    })
    .eq("id", id);
}
export async function validateCoupon(
  code: string,
  subtotal: number
) {
  const coupon = await getCouponByCode(code);

  if (!coupon)
    return {
      valid: false,
      message: "Coupon not found.",
    };

  if (!coupon.active)
    return {
      valid: false,
      message: "Coupon is inactive.",
    };

  if (
    coupon.expires_at &&
    new Date(coupon.expires_at) < new Date()
  ) {
    return {
      valid: false,
      message: "Coupon has expired.",
    };
  }

  if (subtotal < coupon.min_order) {
    return {
      valid: false,
      message: `Minimum order is NPR ${coupon.min_order}.`,
    };
  }

  if (
    coupon.usage_limit &&
    coupon.used_count >= coupon.usage_limit
  ) {
    return {
      valid: false,
      message: "Coupon usage limit reached.",
    };
  }

  let discount = 0;

  if (coupon.type === "percentage") {
    discount = subtotal * (coupon.value / 100);
  } else {
    discount = coupon.value;
  }

  return {
    valid: true,
    coupon,
    discount,
  };
}