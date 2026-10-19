import { supabase } from "./supabase";

export type StoreSettings = {
  id: number;

  store_name: string;
  tagline: string;
  support_email: string;
  phone: string;

  free_shipping_limit: number;
  shipping_cost: number;
  exchange_days: number;

  cod_enabled: boolean;
  store_open: boolean;
  maintenance_mode: boolean;

  created_at: string;
  updated_at: string;
};

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Get Store Settings Error:",
      error
    );

    return null;
  }

  return data;
}

export async function updateStoreSettings(
  id: number,
  settings: Partial<StoreSettings>
) {
  const { data, error } = await supabase
    .from("store_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Update Store Settings Error:",
      error
    );

    throw error;
  }

  return data;
}