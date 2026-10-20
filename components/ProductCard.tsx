"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Heart } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import QuickViewModal from "@/components/modals/QuickViewModal";
import { updateWishlist } from "@/lib/events";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/wishlistService";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  sizes?: string[];
  colors?: string[];
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  sizes = [],
  colors = [],
}: ProductCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [openQuickView, setOpenQuickView] = useState(false);

  useEffect(() => {
    async function checkWishlist() {
      if (!user) {
        setLiked(false);
        return;
      }

      const wishlist = await getWishlist(user.id);

      setLiked(
        wishlist.some(
          (item: any) => item.product_id === id
        )
      );
    }

    checkWishlist();
  }, [id, user]);

  async function toggleWishlist(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(
        "Please login to use the wishlist."
      );

      router.push("/login");
      return;
    }

    try {
      if (liked) {
        await removeFromWishlist(user.id, id);
        setLiked(false);
      } else {
        await addToWishlist(user.id, id);
        setLiked(true);
      }

      updateWishlist();
    } catch {
      toast.error("Something went wrong.");
    }
  }

  function handleQuickView(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    setOpenQuickView(true);
  }

  return (
    <>
      <article className="group min-w-0 overflow-hidden rounded-2xl liquid-glass-card border border-white/15 text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1677FF]/55 hover:shadow-[0_16px_36px_rgba(22,119,255,0.25)]">

        {/* Image */}

        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050608]/50">

          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-105"
          />

          {/* Wishlist */}

          <button
            type="button"
            aria-label={
              liked
                ? `Remove ${name} from wishlist`
                : `Add ${name} to wishlist`
            }
            onClick={toggleWishlist}
            className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md transition hover:scale-110 active:scale-95 sm:right-3 sm:top-3 sm:h-11 sm:w-11"
          >
            <Heart
              className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </button>

          {/* Quick View */}

          <button
            type="button"
            onClick={handleQuickView}
            className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full liquid-glass border border-white/25 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#1677FF]/60 hover:bg-[#1677FF]/30 group-hover:opacity-100 lg:flex lg:opacity-0"
          >
            <Eye size={16} className="text-[#1677FF]" />
            Quick View
          </button>

        </div>

        {/* Content */}

        <div className="min-w-0 p-3.5 sm:p-5">

          <h3 className="line-clamp-2 min-h-[2.75rem] break-words text-sm font-semibold leading-5 text-white sm:min-h-[3.5rem] sm:text-lg sm:leading-6 lg:text-xl">
            {name}
          </h3>

          <p className="mt-2 truncate text-base font-black text-[#1677FF] sm:text-xl">
            NPR {price.toLocaleString()}
          </p>

          <Link
            href={`/products/${id}`}
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg bg-[#1677FF] px-3 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(22,119,255,0.25)] transition hover:bg-[#1677FF]/90 active:scale-[0.98] sm:mt-5 sm:min-h-12 sm:text-sm lg:text-base"
          >
            View Product
          </Link>

        </div>

      </article>

      {/* Quick View Modal */}

      <QuickViewModal
        open={openQuickView}
        onClose={() => setOpenQuickView(false)}
        product={{
          id,
          name,
          image,
          price,
          sizes,
          colors,
        }}
      />
    </>
  );
}