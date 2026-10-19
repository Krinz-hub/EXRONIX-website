import { supabase } from "./supabase";

export async function signUp(
  name: string,
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

  if (error) {
    return { data, error };
  }

  if (data.user) {
    const { error: profileError } =
      await supabase
        .from("profiles")
        .upsert(
          {
            user_id: data.user.id,
            name,
            email,
            phone: null,
            avatar: null,

            // Normal users are customers
            role: "customer",
          },
          {
            onConflict: "user_id",
          }
        );

    if (profileError) {
      console.error(
        "Profile creation error:",
        profileError
      );
    }
  }

  return { data, error };
}

export async function signIn(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  return { data, error };
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function resetPassword(
  email: string
) {
  return await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/reset-password"
          : "https://www.zaynastudio.store/reset-password",
    }
  );
}

export async function updateProfile(
  name: string
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({
    data: {
      name,
    },
  });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  if (user) {
    await supabase
      .from("profiles")
      .update({
        name,
      })
      .eq("user_id", user.id);
  }

  return {
    data: user,
    error: null,
  };
}

export async function updatePassword(
  password: string
) {
  const { data, error } =
    await supabase.auth.updateUser({
      password,
    });

  return { data, error };
}