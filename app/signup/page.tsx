"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signUp } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsCreating(true);

      const { data, error } = await signUp(cleanEmail, password, cleanName);

      if (error) {
        toast.error(error.message || "Failed to create account.");
        return;
      }

      if (data?.user) {
        toast.success("Account created successfully! Welcome to EXRONIX.");
        router.refresh();
        router.push("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 p-7 shadow-2xl text-white sm:p-9 md:p-10 liquid-glass backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Join EXRONIX — Engineered Beyond Limits.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="mt-7 sm:mt-8 space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/25 sm:text-base"
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a strong password (6+ chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/25 sm:text-base"
                autoComplete="new-password"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isCreating}
              className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1677FF] px-4 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <LoadingAnimation size="xs" />
                  <span>Setting Up Account...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#1677FF] transition hover:text-[#1677FF]/80 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}