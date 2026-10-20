"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export default function FeaturedCategories() {
  const categories = siteConfig.categories;

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =========================
            SECTION HEADER
        ========================= */}

        <div className="mb-10 text-center sm:mb-14 lg:mb-16">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1677FF] sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            HARDWARE ECOSYSTEM
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Engineered PC Categories
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-300 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            High-performance esports mice, dual-chamber panoramic PC chassis, and aerospace aluminum desktop mounts.
          </p>

        </div>

        {/* =========================
            CATEGORIES GRID
        ========================= */}

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">

          {categories.map((category) => {

            /* =========================
               COMING SOON CARD
            ========================= */

            if (category.comingSoon) {
              return (
                <div
                  key={category.name}
                  className="liquid-glass-card group relative block h-72 overflow-hidden rounded-2xl sm:h-80 md:h-[360px] lg:h-[420px] lg:rounded-3xl"
                >

                  {/* Image */}

                  <Image
                    src={category.image}
                    alt={`${category.name} - Coming Soon`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105 opacity-60"
                  />

                  {/* Dark Cosmic Overlay */}

                  <div className="absolute inset-0 bg-[#050608]/75 transition duration-300 group-hover:bg-[#050608]/65" />

                  {/* Coming Soon Badge */}

                  <div className="absolute inset-0 z-10 flex items-center justify-center">

                    <div className="liquid-glass rounded-full px-6 py-3 text-center sm:px-8 sm:py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1677FF] sm:text-xs sm:tracking-[0.35em]">
                        Coming Soon
                      </p>
                    </div>

                  </div>

                  {/* Content */}

                  <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8 lg:p-10">

                    <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-gray-300 sm:mt-3 sm:text-base">
                      {category.description}
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
                className="liquid-glass-card group relative block h-72 overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1677FF] focus:ring-offset-2 sm:h-80 md:h-[360px] lg:h-[420px] lg:rounded-3xl"
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/90 via-[#050608]/40 to-transparent transition duration-300 group-hover:from-[#050608]/95" />

                {/* Content */}

                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">

                  <div className="mb-2 inline-block rounded-full bg-[#1677FF]/20 px-3 py-1 text-xs font-semibold text-[#1677FF] backdrop-blur-sm">
                    Featured Capability
                  </div>

                  <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-gray-300 sm:mt-3 sm:text-base">
                    {category.description}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[#1677FF] transition duration-300 sm:mt-4 sm:text-base md:opacity-0 md:group-hover:opacity-100">
                    Explore Models →
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