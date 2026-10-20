"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "New",
    href: "/new",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function DesktopMenu({
  scrolled,
}: {
  scrolled: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
      {menu.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href === "/shop"
              ? pathname === "/shop" || pathname.startsWith("/collections")
              : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group relative py-1 text-xs font-semibold uppercase tracking-[0.25em] transition duration-300 ${
              isActive
                ? "text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            {item.name}

            <span
              className={`absolute -bottom-1.5 left-0 h-[2px] bg-[#1677FF] shadow-[0_0_8px_#1677FF] transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}