"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import SearchModal from "./SearchModal";
import ProfileDropdown from "./ProfileDropdown";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getWishlist } from "@/lib/wishlistService";

export default function NavIcons({
  scrolled,
}: {
  scrolled: boolean;
}) {
  const { cart } = useCart();
  const { user } = useAuth();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setWishlistCount(0);
        return;
      }

      const wishlist = await getWishlist(user.id);
      setWishlistCount(wishlist.length);
    }

    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, [user]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const iconColor = scrolled
    ? "text-black"
    : "text-white";

  return (
    <>
      <div
        className={`flex items-center gap-3 sm:gap-4 lg:gap-6 ${iconColor}`}
      >
        {/* Search */}
        <button
          onClick={() => setOpenSearch(true)}
          className="transition-all duration-300 hover:scale-110"
        >
          <Search className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="relative transition-all duration-300 hover:scale-110"
        >
          <Heart className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />

          {wishlistCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white sm:-right-2 sm:-top-2 sm:h-5 sm:w-5 sm:text-[10px]">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative transition-all duration-300 hover:scale-110"
        >
          <ShoppingBag className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />

          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white sm:-right-2 sm:-top-2 sm:h-5 sm:w-5 sm:text-[10px]">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Profile */}
        <ProfileDropdown />
      </div>

      <SearchModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
      />
    </>
  );
}