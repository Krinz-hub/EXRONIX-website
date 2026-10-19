"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative z-0 flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-cover bg-[center_center]"
      style={{
        backgroundImage: "url('/images/hero.png')",
      }}
    >
      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-16 text-center text-white sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">

        {/* Heading */}

        <h1 className="text-[2.75rem] font-black leading-[0.95] tracking-tight sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl xl:text-8xl">
          WEAR
          <br />
          THE GRACE
        </h1>

        {/* Subtitle */}

        <p className="mt-6 max-w-xl text-xs font-medium leading-6 tracking-wide text-gray-200 sm:text-base sm:leading-7 md:mt-8 md:text-lg lg:text-xl">
          MINIMAL • BOLD • TIMELESS
        </p>

        {/* Buttons */}

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">

          <Link
            href="/collections"
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition duration-300 hover:scale-105 hover:bg-gray-100 sm:w-auto sm:px-10 sm:py-4 sm:text-base"
          >
            Shop Now
          </Link>

          <Link
            href="/collections"
            className="flex min-h-12 w-full items-center justify-center rounded-full border border-white px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white hover:text-black sm:w-auto sm:px-10 sm:py-4 sm:text-base"
          >
            Explore Collection
          </Link>

        </div>

      </div>

      {/* Scroll Indicator */}

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-center text-white sm:block md:bottom-10">

        <p className="text-[10px] uppercase tracking-[0.35em]">
          Scroll
        </p>

        <p className="mt-2 text-xl">
          ↓
        </p>

      </div>

    </section>
  );
}