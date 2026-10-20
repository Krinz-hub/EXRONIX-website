"use client";

import React from "react";
import Image from "next/image";

export interface LoadingAnimationProps {
  size?: "xs" | "sm" | "md" | "lg" | "fullscreen";
  text?: string;
  subtext?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * LoadingAnimation:
 * Premium, minimalist EXRONIX loading state.
 * - Displays the official EXRONIX logo directly against a clean, flat near-black background.
 * - Free of any rounded-square box, blue border outline, neon backlight, or card frame.
 * - Centered vertical hierarchy: floating brand mark -> white bold text -> blue accent subtext.
 * - Provides ultra-compact inline spinner for buttons and in-page sections.
 */
export default function LoadingAnimation({
  size = "md",
  text = "LOADING HARDWARE",
  subtext = "EXRONIX STORE",
  className = "",
  fullScreen = false,
}: LoadingAnimationProps) {
  // Ultra-compact inline loader for buttons and micro-indicators
  if (size === "xs") {
    return (
      <span
        aria-label="Loading"
        className={`inline-flex items-center justify-center align-middle ${className}`}
      >
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-[#1677FF]" />
      </span>
    );
  }

  // Standalone floating logo dimensions based on scale
  const logoDimensions = {
    sm: "h-8 w-28 sm:h-9 sm:w-32",
    md: "h-11 w-36 sm:h-12 sm:w-44",
    lg: "h-14 w-48 sm:h-16 sm:w-56",
    fullscreen: "h-16 w-52 sm:h-20 sm:w-64",
  }[fullScreen ? "fullscreen" : size];

  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* 
        Standalone EXRONIX Logo Brand Mark
        Displayed directly with NO rounded-square container, NO border, and NO blue backlight.
      */}
      <div className={`relative ${logoDimensions} select-none transition-opacity duration-300`}>
        <Image
          src="/images/exronix-logo.png"
          alt="EXRONIX"
          fill
          priority={fullScreen}
          className="object-contain object-center"
        />
      </div>

      {/* Subtle circular technical indicator */}
      <div className="mt-4 mb-2 flex items-center justify-center">
        <span className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-white/20 border-t-[#1677FF]" />
      </div>

      {/* Primary Loading Text: White, Uppercase, Bold, Letter-spaced */}
      {text && (
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white sm:text-sm">
          {text}
        </p>
      )}

      {/* Subtitle: EXRONIX Blue Accent */}
      {subtext && (
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#1677FF] sm:text-[10px]">
          {subtext}
        </p>
      )}
    </div>
  );

  // Full-screen loading screen with clean flat near-black background
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050608] px-4">
        {content}
      </div>
    );
  }

  return content;
}
