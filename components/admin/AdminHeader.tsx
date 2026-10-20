"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader({
  title,
}: {
  title: string;
}) {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-white">

      <div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          {title}
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Welcome back, Admin 👋
        </p>

      </div>

      <div className="flex flex-wrap items-center gap-4">

        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-[#0e1219] px-4 py-2.5 shadow-sm text-white focus-within:border-[#1677FF]">

          <Search size={18} className="text-gray-400" />

          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />

        </div>

        <button className="rounded-xl border border-white/15 bg-[#0e1219] p-2.5 text-gray-300 shadow-sm transition hover:bg-white/10 hover:text-white">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-[#0e1219] px-4 py-2 shadow-sm text-white">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1677FF] text-sm font-bold text-white shadow-[0_0_10px_rgba(22,119,255,0.4)]">
            A
          </div>

          <div>

            <h2 className="text-sm font-bold text-white">
              Admin
            </h2>

            <p className="text-xs font-semibold text-[#1677FF]">
              EXRONIX
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}