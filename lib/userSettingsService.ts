import { supabase } from "./supabase";

export type UserSettings = {
  id?: number;
  user_id: string;

  order_updates: boolean;
  promotions: boolean;

  language: string;
  theme: "light" | "dark";
};


/* =========================================================
   GET USER SETTINGS
========================================================= */

export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {

  const {
    data,
    error,
  } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "GET USER SETTINGS ERROR",
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    return null;
  }

  return data as UserSettings | null;
}


/* =========================================================
   CREATE DEFAULT SETTINGS
========================================================= */

export async function createDefaultUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const defaults = {
    user_id: userId,
    order_updates: true,
    promotions: true,
    language: "English",
    theme: "light" as const,
  };

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(defaults, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    console.error(
      "CREATE/UPSERT USER SETTINGS ERROR",
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    return null;
  }

  return data as UserSettings;
}


/* =========================================================
   GET OR CREATE SETTINGS
========================================================= */

export async function getOrCreateUserSettings(
  userId: string
): Promise<UserSettings | null> {

  const existing =
    await getUserSettings(userId);

  if (existing) {
    return existing;
  }

  return await createDefaultUserSettings(
    userId
  );
}


/* =========================================================
   UPDATE USER SETTINGS
========================================================= */

export async function updateUserSettings(
  userId: string,
  settings: Partial<
    Pick<
      UserSettings,
      | "order_updates"
      | "promotions"
      | "language"
      | "theme"
    >
  >
): Promise<UserSettings | null> {

  const {
    data,
    error,
  } = await supabase
    .from("user_settings")
    .update(settings)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error(
      "UPDATE USER SETTINGS ERROR",
      {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }
    );

    throw error;
  }

  return data as UserSettings;
}