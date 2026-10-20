"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("exronix-users") || "[]"
    );

    const exists = users.find(
      (u: any) => u.email === form.email
    );

    if (exists) {
      setError("Email already registered.");
      return;
    }

    users.push({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    localStorage.setItem(
      "exronix-users",
      JSON.stringify(users)
    );

    toast.success("Account created successfully!");

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-28 text-white sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-10 shadow-2xl text-white">

        <h1 className="mb-2 text-center text-3xl sm:text-4xl font-black tracking-tight text-white">
          Create Account
        </h1>

        <p className="mb-8 text-center text-sm text-gray-400">
          Join EXRONIX — Engineered Beyond Limits
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 p-4 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
          />

          {error && (
            <p className="text-sm font-medium text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#1677FF] py-4 font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#1677FF] transition hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}