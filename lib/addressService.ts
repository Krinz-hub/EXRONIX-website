import { supabase } from "./supabase";

export async function getAddresses(userId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function addAddress(address: any) {
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", address.user_id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert(address)
    .select()
    .single();

  return { data, error };
}

export async function updateAddress(
  id: number,
  address: any
) {
  if (address.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", address.user_id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .update(address)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteAddress(id: number) {
  return await supabase
    .from("addresses")
    .delete()
    .eq("id", id);
}

export async function setDefaultAddress(
  userId: string,
  id: number
) {
  // Remove current default
  await supabase
    .from("addresses")
    .update({
      is_default: false,
    })
    .eq("user_id", userId);

  // Set new default
  return await supabase
    .from("addresses")
    .update({
      is_default: true,
    })
    .eq("id", id);
}
export async function getDefaultAddress(userId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  if (error) {
    return null;
  }

  return data;
}