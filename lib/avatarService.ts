import { supabase } from "./supabase";

export async function uploadAvatar(
  userId: string,
  file: File
) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}.${fileExt}`;

  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    return {
      data: null,
      error: uploadError,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  const { data, error } =
    await supabase.auth.updateUser({
      data: {
        avatar: publicUrl,
      },
    });

  return {
    data,
    error,
    publicUrl,
  };
}