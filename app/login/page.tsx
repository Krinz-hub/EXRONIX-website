"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signIn } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setIsSigningIn(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : String(error)
        );
        return;
      }

      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSigningIn(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <p className="text-gray-500">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 sm:px-6">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8 md:p-10">

          {/* Header */}
          <div className="text-center">

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Login to continue shopping with ZAYNA.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="mt-7 sm:mt-8"
          >

            {/* Email */}
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="mb-5 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:text-base"
              autoComplete="email"
              required
            />

            {/* Password */}
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="mb-5 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:text-base"
              autoComplete="current-password"
              required
            />

            {/* Forgot Password */}
            <div className="mb-6 flex justify-end">

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={isSigningIn}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            >
              {isSigningIn
                ? "Signing In..."
                : "Login"}
            </button>

            {/* Signup */}
            <p className="mt-6 text-center text-sm text-gray-600 sm:text-base">
              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
              >
                Sign Up
              </Link>
            </p>

          </form>

        </div>

      </div>

    </main>
  );
}