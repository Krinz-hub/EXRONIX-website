"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "T-Shirts",
    image: "/images/categories/tshirts.png",
    href: "/collections?category=T-Shirts",
    comingSoon: false,
  },
  {
    name: "Oversized",
    image: "/images/categories/oversized.jpg",
    href: "/collections?category=Oversized",
    comingSoon: true,
  },
  {
    name: "Hoodies",
    image: "/images/categories/hoodies.jpg",
    href: "/collections?category=Hoodies",
    comingSoon: true,
  },
  {
    name: "Accessories",
    image: "/images/categories/accessories.jpg",
    href: "/collections?category=Accessories",
    comingSoon: true,
  },
];

export default function FeaturedCategories() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =========================
            SECTION HEADER
        ========================= */}

        <div className="mb-10 text-center sm:mb-14 lg:mb-16">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            Collections
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-500 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            Discover timeless pieces designed for everyday confidence.
          </p>

        </div>

        {/* =========================
            CATEGORIES GRID
        ========================= */}

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">

          {categories.map((category) => {

            /* =========================
               COMING SOON CARD
            ========================= */

            if (category.comingSoon) {
              return (
                <div
                  key={category.name}
                  className="group relative block h-72 overflow-hidden rounded-2xl sm:h-80 md:h-[360px] lg:h-[420px] lg:rounded-3xl"
                >

                  {/* Image */}

                  <Image
                    src={category.image}
                    alt={`${category.name} - Coming Soon`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Overlay */}

                  <div className="absolute inset-0 bg-black/55 transition duration-300 group-hover:bg-black/65" />

                  {/* Coming Soon Badge */}

                  <div className="absolute inset-0 z-10 flex items-center justify-center">

                    <div className="rounded-full border border-white/40 bg-black/50 px-6 py-3 text-center backdrop-blur-sm sm:px-8 sm:py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white sm:text-xs sm:tracking-[0.35em]">
                        Coming Soon
                      </p>
                    </div>

                  </div>

                  {/* Content */}

                  <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8 lg:p-10">

                    <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-white/80 sm:mt-3 sm:text-base">
                      Coming soon to ZAYNA
                    </p>

                  </div>

                </div>
              );
            }

            /* =========================
               AVAILABLE CATEGORY
            ========================= */

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative block h-72 overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:h-80 md:h-[360px] lg:h-[420px] lg:rounded-3xl"
              >

                {/* Image */}

                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition duration-300 group-hover:from-black/85" />

                {/* Content */}

                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">

                  <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-white transition duration-300 sm:mt-3 sm:text-base md:opacity-0 md:group-hover:opacity-100">
                    Explore Collection →
                  </p>

                </div>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
}