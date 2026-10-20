"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  TicketPercent,
  Settings,
  LogOut,
  FolderTree,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useAuth();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (loading) return;

      // Not logged in
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        router.replace("/admin/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error(
            "Admin role check failed:",
            error
          );

          setIsAdmin(false);
          setCheckingAdmin(false);
          router.replace("/");
          return;
        }

        if (data?.role !== "admin") {
          setIsAdmin(false);
          setCheckingAdmin(false);

          router.replace("/");
          return;
        }

        setIsAdmin(true);
        setCheckingAdmin(false);
      } catch (error) {
        console.error(
          "Admin verification error:",
          error
        );

        setIsAdmin(false);
        setCheckingAdmin(false);

        router.replace("/");
      }
    }

    checkAdmin();
  }, [user, loading, router]);

  async function logout() {
    await supabase.auth.signOut();

    router.replace("/admin/login");
  }

  const menu = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Coupons",
      href: "/admin/coupons",
      icon: TicketPercent,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  if (
    loading ||
    checkingAdmin
  ) {
    return (
      <LoadingAnimation
        fullScreen
        text="VERIFYING ADMIN ACCESS"
        subtext="EXRONIX STORE"
      />
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 bg-black text-white lg:block">

        {/* Logo */}

        <div className="border-b border-gray-800 p-8">

          <h1 className="text-3xl font-black tracking-wider text-white">
            EXRONIX
          </h1>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#1677FF]">
            Admin Portal
          </p>

        </div>

        {/* Navigation */}

        <nav className="mt-8 space-y-2 px-4">

          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                  active
                    ? "bg-white text-black"
                    : "hover:bg-gray-900"
                }`}
              >
                <Icon size={22} />

                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* Logout */}

        <button
          onClick={logout}
          className="absolute bottom-8 left-4 flex w-40 items-center gap-4 rounded-xl bg-red-600 px-5 py-4 transition hover:bg-red-700"
        >
          <LogOut size={18} />

          Logout
        </button>

      </aside>

      {/* Mobile top bar */}

      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-black px-5 text-white lg:hidden">

        <div>
          <h1 className="font-black tracking-wider text-white">
            EXRONIX
          </h1>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1677FF]">
            Admin Portal
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold"
        >
          Logout
        </button>

      </div>

      {/* Main Content */}

      <main className="min-w-0 flex-1 pt-16 lg:ml-72 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>

    </div>
  );
}