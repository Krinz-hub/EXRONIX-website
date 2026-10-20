"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface ScrollVideoBackgroundProps {
  videoSrc?: string;
  fallbackImageSrc?: string;
  className?: string;
  trackClassName?: string;
  children?: React.ReactNode;
  phase1Ref?: React.RefObject<HTMLDivElement | null>;
  phase2Ref?: React.RefObject<HTMLDivElement | null>;
  onProgressChange?: (progress: number) => void;
}

/**
 * ScrollVideoBackground:
 * Renders an optimized, scroll-scrubbed video background pinned in a sticky viewport.
 * - Controls video timeline via scroll progress: video.currentTime = progress * duration.
 * - Throttles updates via requestAnimationFrame and handles browser seeking events.
 * - Updates foreground phase layers via direct DOM manipulation to avoid React re-renders.
 * - Disables autoplay, hides controls, ensures muted + playsInline for mobile compatibility.
 */
export default function ScrollVideoBackground({
  videoSrc = "/videos/bg.mp4",
  fallbackImageSrc = "/images/hero-initial-frame.jpg",
  className = "",
  trackClassName = "relative w-full h-[260vh]",
  children,
  phase1Ref,
  phase2Ref,
  onProgressChange,
}: ScrollVideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastProgressRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Compute scroll progress strictly relative to this cinematic container
  const getScrollProgress = useCallback(() => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableDistance =
      containerRef.current.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return 0;
    const currentScroll = -rect.top;
    return Math.min(Math.max(currentScroll / scrollableDistance, 0), 1);
  }, []);

  // Update foreground phase elements without triggering React state updates
  const updateForegroundDOM = useCallback(
    (p: number) => {
      // Phase 1: Visible initially [0, 0.40], fades out between 0.20 and 0.38
      if (phase1Ref && phase1Ref.current) {
        let opacity = 1;
        let translateY = 0;
        if (p > 0.18) {
          const fadeOut = Math.min(Math.max((p - 0.18) / 0.18, 0), 1);
          opacity = 1 - fadeOut;
          translateY = -fadeOut * 35;
        }
        phase1Ref.current.style.opacity = opacity.toFixed(3);
        phase1Ref.current.style.transform = `translate3d(0, ${translateY.toFixed(
          1
        )}px, 0)`;
        phase1Ref.current.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
      }

      // Phase 2: Visible in middle scroll [0.35, 0.86], fades in [0.35, 0.50], fades out [0.72, 0.86]
      if (phase2Ref && phase2Ref.current) {
        let opacity = 0;
        let translateY = 25;
        if (p >= 0.35 && p <= 0.88) {
          if (p < 0.5) {
            const fadeIn = Math.min(Math.max((p - 0.35) / 0.15, 0), 1);
            opacity = fadeIn;
            translateY = 25 * (1 - fadeIn);
          } else if (p > 0.72) {
            const fadeOut = Math.min(Math.max((p - 0.72) / 0.14, 0), 1);
            opacity = 1 - fadeOut;
            translateY = -fadeOut * 25;
          } else {
            opacity = 1;
            translateY = 0;
          }
        } else if (p > 0.88) {
          opacity = 0;
          translateY = -25;
        }
        phase2Ref.current.style.opacity = opacity.toFixed(3);
        phase2Ref.current.style.transform = `translate3d(0, ${translateY.toFixed(
          1
        )}px, 0)`;
        phase2Ref.current.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
      }
    },
    [phase1Ref, phase2Ref]
  );

  // Apply seek to video element cleanly
  const applySeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !durationRef.current) return;

    const clamped = Math.min(Math.max(time, 0), durationRef.current - 0.001);
    if (Math.abs(video.currentTime - clamped) <= 0.02) return;

    if (!video.seeking) {
      try {
        if (typeof (video as any).fastSeek === "function") {
          (video as any).fastSeek(clamped);
        } else {
          video.currentTime = clamped;
        }
      } catch {
        // Suppress seek abort exceptions
      }
    }
  }, []);

  // Listen to video events and metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.muted = true;

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        durationRef.current = video.duration;
        setVideoReady(true);
        // Sync to current scroll position immediately upon load
        const p = getScrollProgress();
        const initialTarget = p * video.duration;
        targetTimeRef.current = initialTarget;
        try {
          video.currentTime = Math.min(
            Math.max(initialTarget, 0),
            video.duration - 0.001
          );
        } catch {}
      }
    };

    const handleSeeked = () => {
      const targetTime = targetTimeRef.current;
      if (Math.abs(video.currentTime - targetTime) > 0.03 && !video.seeking) {
        applySeek(targetTime);
      }
    };

    const handleError = () => {
      setHasError(true);
    };

    if (video.readyState >= 1 && video.duration) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
    };
  }, [getScrollProgress, applySeek]);

  // Main scroll loop using requestAnimationFrame
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateFrame = () => {
      const progress = getScrollProgress();
      lastProgressRef.current = progress;

      if (!prefersReducedMotion && durationRef.current > 0) {
        const target = progress * durationRef.current;
        targetTimeRef.current = target;
        applySeek(target);
      }

      updateForegroundDOM(progress);

      if (onProgressChange) {
        onProgressChange(progress);
      }

      rafIdRef.current = null;
    };

    const handleScroll = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      }

      // Trailing sync to ensure exact final frame when scrolling stops
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        updateFrame();
      }, 50);
    };

    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [getScrollProgress, applySeek, updateForegroundDOM, onProgressChange]);

  return (
    <div ref={containerRef} className={`${trackClassName} ${className}`}>
      {/* Pinned viewport for the cinematic sequence */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050608]">
        {/* Scroll-Scrubbed Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={fallbackImageSrc}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
        />

        {/* Fallback cosmic image layer (displayed until video metadata is ready or if error occurs) */}
        <div
          className={`pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            videoReady && !hasError ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url('${fallbackImageSrc}')` }}
          aria-hidden="true"
        />

        {/* Cinematic readability overlays - engineered to keep comet, moon, and horizon prominent */}
        {/* Subtle baseline tint */}
        <div className="pointer-events-none absolute inset-0 bg-black/25" />

        {/* Subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,6,8,0.7)_100%)]" />

        {/* Top gradient for navbar readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050608]/80 via-[#050608]/30 to-transparent" />

        {/* Bottom gradient to seamlessly blend into the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050608] via-[#050608]/70 to-transparent" />

        {/* Foreground Content Container */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
