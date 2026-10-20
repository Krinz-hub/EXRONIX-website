"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader({
  title,
}: {
  title: string;
}) {
  return (
    <header className="mb-10 flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        <p className="mt-1 text-gray-500">
          Welcome back, Admin 👋
        </p>

      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">

          <Search size={18} />

          <input
            placeholder="Search..."
            className="outline-none"
          />

        </div>

        <button className="rounded-xl bg-white p-3 shadow-sm hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
            A
          </div>

          <div>

            <h2 className="font-semibold">
              Admin
            </h2>

            <p className="text-sm font-semibold text-[#1677FF]">
              EXRONIX
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}