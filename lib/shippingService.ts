import { supabase } from "./supabase";

export type ShippingRate = {
  id: number;
  province: string;
  price: number;
  free_shipping_over: number;
  estimated_days: string;
  active: boolean;
};

export async function getShippingRates(): Promise<ShippingRate[]> {
  const { data, error } = await supabase
    .from("shipping_rates")
    .select("*")
    .eq("active", true)
    .order("province");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getShippingRate(
  province: string
): Promise<ShippingRate | null> {
  const { data, error } = await supabase
    .from("shipping_rates")
    .select("*")
    .eq("province", province)
    .eq("active", true)
    .single();

  console.log("Selected Shipping Rate:", data);
  console.log("Shipping Error:", error);

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function updateShippingRate(
  id: number,
  values: Partial<ShippingRate>
) {
  const { error } = await supabase
    .from("shipping_rates")
    .update(values)
    .eq("id", id);

  if (error) throw error;
}