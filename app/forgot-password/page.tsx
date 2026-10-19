"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      setSent(true);

      toast.success(
        "Password reset link sent! Check your email."
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
              Z
            </div>

            <h1 className="text-3xl font-bold">
              Forgot Password?
            </h1>

            <p className="mt-3 text-muted-foreground">
              Enter your email address and we&apos;ll send
              you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="space-y-5 text-center">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                <p className="font-semibold">
                  Check your inbox
                </p>

                <p className="mt-2 text-sm">
                  We sent a password reset link to{" "}
                  <strong>{email}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="w-full rounded-xl border border-border px-5 py-3 font-medium transition hover:bg-muted"
              >
                Send Again
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 outline-none transition focus:border-foreground focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}