import { supabase } from "./supabase";

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}.${fileExt}`;

  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file);

  if (error) {
    console.error(error);
    throw error;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return data.publicUrl;
}