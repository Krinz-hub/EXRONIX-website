"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error(
        "Please enter your email and password."
      );
      return;
    }

    setIsLoggingIn(true);

    try {
      /*
       * Authenticate with Supabase
       */
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        toast.error(error.message);
        return;
      }

      /*
       * Make sure authentication actually returned
       * a user.
       */
      if (!data.user) {
        toast.error(
          "Unable to verify your account."
        );

        await supabase.auth.signOut();

        return;
      }

      /*
       * Check the user's role.
       *
       * IMPORTANT:
       * The role comes from the profiles table.
       * We do NOT trust localStorage.
       */
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

      if (profileError) {
        console.error(
          "Admin profile check failed:",
          profileError
        );

        await supabase.auth.signOut();

        toast.error(
          "Unable to verify administrator access."
        );

        return;
      }

      /*
       * User is authenticated but isn't an admin.
       */
      if (profile?.role !== "admin") {
        await supabase.auth.signOut();

        toast.error(
          "You do not have administrator access."
        );

        return;
      }

      /*
       * Remember Me
       *
       * Supabase already manages the authentication
       * session. We only store this preference here.
       */
      if (remember) {
        localStorage.setItem(
          "zayna-admin-remember",
          "true"
        );
      } else {
        localStorage.removeItem(
          "zayna-admin-remember"
        );
      }

      toast.success(
        "Administrator login successful!"
      );

      router.replace("/admin");
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      toast.error(
        "Unable to login. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 sm:px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-10">

        {/* Logo */}

        <div className="mb-8 flex flex-col items-center">

          <div className="relative h-12 w-32 mb-2">
            <Image
              src="/images/exronix-logo.png"
              alt="EXRONIX"
              fill
              priority
              className="object-contain"
            />
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-wider text-black">
            EXRONIX
          </h1>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#1677FF]">
            Admin Portal
          </p>

        </div>

        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label
              htmlFor="admin-email"
              className="mb-2 block font-medium"
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="admin@exronix.store"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              disabled={isLoggingIn}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black disabled:bg-gray-100"
              required
            />

          </div>

          {/* Password */}

          <div>

            <label
              htmlFor="admin-password"
              className="mb-2 block font-medium"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              disabled={isLoggingIn}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-black disabled:bg-gray-100"
              required
            />

          </div>

          {/* Remember */}

          <label className="flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              disabled={isLoggingIn}
              className="h-4 w-4"
            />

            <span className="text-sm">
              Remember Me
            </span>

          </label>

          {/* Login Button */}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center rounded-xl bg-black py-3 text-lg font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingIn
              ? "Verifying..."
              : "Sign In"}
          </button>

        </form>

        {/* Information */}

        <p className="mt-8 text-center text-sm leading-6 text-gray-500">
          Only authorized administrators can
          access the EXRONIX dashboard.
        </p>

      </div>

    </main>
  );
}