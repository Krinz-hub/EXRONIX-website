import { supabase } from "./supabase";
import { AppUser } from "@/types/user";

export async function getProfile(
  userId: string
): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Get profile error:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.user_id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    avatar: data.avatar,
    role: data.role,
  };
}

export async function createProfile(
  authUser: any
): Promise<AppUser | null> {
  const profile = {
    user_id: authUser.id,
    email: authUser.email,
    name:
      authUser.user_metadata?.name ??
      authUser.email?.split("@")[0] ??
      "User",
    phone: null,
    avatar: null,
    role: "user",
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    console.error("Profile creation failed");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Details:", error.details);
    console.error("Hint:", error.hint);

    return null;
  }

  return {
    id: data.user_id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    avatar: data.avatar,
    role: data.role,
  };
}

export async function updateProfileData(
  userId: string,
  values: Partial<AppUser>
) {
  const { error } = await supabase
    .from("profiles")
    .update(values)
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}