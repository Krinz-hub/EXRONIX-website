"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signUp } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setIsCreating(true);

    try {
      const { error } = await signUp(
        name,
        email,
        password
      );

      if (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : String(error)
        );
        return;
      }

      toast.success(
        "Account created successfully!"
      );

      router.replace("/");
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsCreating(false);
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
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Join ZAYNA and start shopping.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSignup}
            className="mt-7 sm:mt-8"
          >

            {/* Name */}
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="mb-5 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:text-base"
              autoComplete="name"
              required
            />

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
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="mb-6 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:text-base"
              autoComplete="new-password"
              required
            />

            {/* Create Account */}
            <button
              type="submit"
              disabled={isCreating}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            >
              {isCreating
                ? "Creating..."
                : "Create Account"}
            </button>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-gray-600 sm:text-base">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
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