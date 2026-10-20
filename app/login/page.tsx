"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      setIsSigningIn(true);

      const { data, error } = await signIn(cleanEmail, password);

      if (error) {
        toast.error(error.message || "Failed to sign in. Please verify credentials.");
        return;
      }

      if (data?.user) {
        toast.success("Welcome back to EXRONIX!");
        router.refresh();
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 p-7 shadow-2xl text-white sm:p-9 md:p-10 liquid-glass backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Sign in to access your EXRONIX account and orders.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-7 sm:mt-8 space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/25 sm:text-base"
                autoComplete="email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-300"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#1677FF] transition hover:text-[#1677FF]/80 hover:underline sm:text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/25 sm:text-base"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningIn}
              className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1677FF] px-4 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {isSigningIn ? (
                <span className="flex items-center gap-2">
                  <LoadingAnimation size="xs" />
                  <span>Signing In...</span>
                </span>
              ) : (
                "Login to Account"
              )}
            </button>

            {/* Signup Link */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#1677FF] transition hover:text-[#1677FF]/80 hover:underline"
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