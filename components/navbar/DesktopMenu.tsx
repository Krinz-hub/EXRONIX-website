"use client";

import Link from "next/link";

const menu = [
  {
    name: "Shop",
    href: "/collections",
  },
  {
    name: "New",
    href: "/collections?sort=new",
  },
  {
    name: "Collections",
    href: "/collections",
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
  return (
    <nav className="hidden items-center gap-12 lg:flex">
      {menu.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`group relative text-sm font-medium uppercase tracking-[0.25em] transition duration-300 ${
            scrolled
              ? "text-black hover:text-black"
              : "text-white hover:text-white"
          }`}
        >
          {item.name}

          <span
            className={`absolute -bottom-2 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
              scrolled ? "bg-black" : "bg-white"
            }`}
          />
        </Link>
      ))}
    </nav>
  );
}