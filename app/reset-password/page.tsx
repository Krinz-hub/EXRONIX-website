"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

import { updatePassword } from "@/lib/authService";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Password updated successfully!"
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-28 text-white sm:px-6">

      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-10 shadow-2xl text-white">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#1677FF]">
            <Lock className="h-8 w-8 text-[#1677FF]" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Create a new secure password.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              New Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 pr-12 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 pr-12 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1677FF] py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
          >
            {loading ? (
              <>
                <LoadingAnimation size="xs" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>

        </form>

      </div>

    </main>
  );
}