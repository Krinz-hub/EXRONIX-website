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
          "exronix-admin-remember",
          "true"
        );
      } else {
        localStorage.removeItem(
          "exronix-admin-remember"
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
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 text-white">

      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1219]/90 liquid-glass backdrop-blur-2xl p-6 sm:p-10 shadow-2xl text-white">

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

          <h1 className="mt-2 text-3xl font-black tracking-wider text-white">
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
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] disabled:bg-white/5"
              required
            />

          </div>

          {/* Password */}

          <div>

            <label
              htmlFor="admin-password"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400"
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
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] disabled:bg-white/5"
              required
            />

          </div>

          {/* Remember */}

          <label className="flex cursor-pointer items-center gap-3 text-gray-300">

            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
              disabled={isLoggingIn}
              className="h-4 w-4 accent-[#1677FF]"
            />

            <span className="text-sm">
              Remember Me
            </span>

          </label>

          {/* Login Button */}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center rounded-xl bg-[#1677FF] py-3.5 text-base font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingIn
              ? "Verifying..."
              : "Sign In"}
          </button>

        </form>

        {/* Information */}

        <p className="mt-8 text-center text-sm leading-6 text-gray-400">
          Only authorized administrators can
          access the EXRONIX dashboard.
        </p>

      </div>

    </main>
  );
}