"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative z-0 flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-transparent">
      {/* Subtle radial ambient spotlight for hero focus */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(22,119,255,0.12),transparent_75%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-16 text-center text-white sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">

        {/* Brand Tagline Badge */}
        <div className="liquid-glass-subtle mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1677FF] sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF] animate-pulse" />
          ENGINEERED BEYOND LIMITS
        </div>

        {/* Main Heading */}
        <h1 className="text-[2.75rem] font-black leading-[0.95] tracking-tight sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl xl:text-8xl">
          PRECISION IN
          <br />
          EVERY COMPONENT
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-xs font-medium leading-6 tracking-wide text-gray-200 sm:text-base sm:leading-7 md:mt-8 md:text-lg lg:text-xl">
          High-performance PC accessories, ultra-lightweight magnesium gaming mice,
          architectural panoramic chassis, and aerospace-grade desktop mounts.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/shop"
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#1677FF] px-7 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(22,119,255,0.4)] transition duration-300 hover:scale-105 hover:bg-[#1677FF]/90 sm:w-auto sm:px-10 sm:py-4 sm:text-base"
          >
            Explore PC Hardware
          </Link>

          <Link
            href="/new"
            className="liquid-glass-subtle flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:border-[#1677FF]/60 hover:bg-[#1677FF]/20 sm:w-auto sm:px-10 sm:py-4 sm:text-base"
          >
            View New Drops
          </Link>
        </div>

      </div>

    </section>
  );
}