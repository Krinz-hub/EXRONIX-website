"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import LoadingAnimation from "@/components/LoadingAnimation";

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
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-[#0e1219]/80 p-7 shadow-2xl text-white sm:p-9 md:p-10 liquid-glass backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Enter your email address and we&apos;ll send
              you a link to reset your EXRONIX password.
            </p>
          </div>

          {sent ? (
            <div className="space-y-5 text-center">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-400">
                <p className="font-semibold">
                  Check your inbox
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  We sent a password reset link to{" "}
                  <strong className="text-white">{email}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
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
                  className="mb-2 block text-sm font-semibold text-gray-300"
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
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/25 sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-5 py-3 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoadingAnimation size="xs" />
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-bold text-[#1677FF] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}