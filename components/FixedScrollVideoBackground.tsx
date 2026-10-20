"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * FixedScrollVideoBackground:
 * Renders a fixed, full-viewport cinematic background video (bg.mp4).
 * Controlled strictly by page scroll progress from the first viewport to the footer:
 *   progress = scrollY / (documentHeight - viewportHeight)
 *   targetTime = progress * video.duration
 *
 * Scrolling down advances the animation; scrolling up reverses it.
 * Decoupled from decoding stalls using requestAnimationFrame and seeked event locking.
 */
export default function FixedScrollVideoBackground() {
  const pathname = usePathname();

  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(8.0); // Default to known duration, updated on metadata
  const isSeekingRef = useRef<boolean>(false);
  const lastSeekTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Accurately compute normalized scroll progress (0.0 to 1.0) across the entire document
  const computeProgress = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return 0;
    const doc = document.documentElement;
    const body = document.body;

    const docHeight = Math.max(
      doc.scrollHeight,
      body ? body.scrollHeight : 0,
      doc.offsetHeight,
      body ? body.offsetHeight : 0,
      doc.clientHeight,
      body ? body.clientHeight : 0
    );

    const viewportHeight = window.innerHeight || doc.clientHeight || 1;
    const maxScroll = Math.max(docHeight - viewportHeight, 1);
    const scrollY =
      window.pageYOffset ??
      window.scrollY ??
      doc.scrollTop ??
      (body ? body.scrollTop : 0) ??
      0;

    return Math.min(Math.max(scrollY / maxScroll, 0), 1);
  }, []);

  // Frame synchronization routine
  const syncFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const duration = durationRef.current;
    if (!duration || !isFinite(duration) || duration <= 0) return;

    const progress = computeProgress();
    // Keep target bounded to avoid edge 'ended' events
    const target = Math.min(Math.max(progress * duration, 0.001), duration - 0.01);
    targetTimeRef.current = target;

    // If currently seeking, check for timeout safety (e.g. 150ms) to prevent deadlock
    const now = performance.now();
    if (isSeekingRef.current && now - lastSeekTimeRef.current > 150) {
      isSeekingRef.current = false;
    }

    if (!isSeekingRef.current && !video.seeking) {
      if (Math.abs(video.currentTime - target) > 0.015) {
        isSeekingRef.current = true;
        lastSeekTimeRef.current = now;
        try {
          video.currentTime = target;
        } catch {
          isSeekingRef.current = false;
        }
      }
    }
  }, [computeProgress]);

  // Request Animation Frame tick
  const requestSync = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        syncFrame();
      });
    }
  }, [syncFrame]);

  // Video lifecycle, events, and metadata loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.muted = true;
    video.playsInline = true;

    const onMetadata = () => {
      if (video.duration && isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
        setVideoReady(true);
        setHasError(false);
        syncFrame();
      }
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
      const target = targetTimeRef.current;
      if (Math.abs(video.currentTime - target) > 0.015) {
        isSeekingRef.current = true;
        lastSeekTimeRef.current = performance.now();
        try {
          video.currentTime = target;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    const onError = () => {
      setHasError(true);
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", onMetadata);
    video.addEventListener("canplay", onMetadata);
    video.addEventListener("durationchange", onMetadata);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    // Initial check in case cached video already has metadata ready
    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
      onMetadata();
    } else {
      // Verification interval during initial hydration
      const timer = setInterval(() => {
        if (video.duration && isFinite(video.duration)) {
          onMetadata();
          clearInterval(timer);
        }
      }, 100);
      setTimeout(() => clearInterval(timer), 3000);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", onMetadata);
      video.removeEventListener("canplay", onMetadata);
      video.removeEventListener("durationchange", onMetadata);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
  }, [syncFrame]);

  // Global listeners: scroll, resize, route changes, DOM mutations
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const handleScroll = () => {
      requestSync();
    };

    const handleResize = () => {
      requestSync();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("load", handleResize);

    // ResizeObserver watches for dynamic height changes (product cards loading, images rendering)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && document.body) {
      ro = new ResizeObserver(() => {
        requestSync();
      });
      ro.observe(document.body);
      if (document.documentElement) {
        ro.observe(document.documentElement);
      }
    }

    // Trigger initial sync
    requestSync();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
      if (ro) ro.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [requestSync, pathname]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src="/videos/bg.mp4"
        poster="/images/space-hero.jpg"
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Fallback poster while video loads or on error */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 pointer-events-none ${
          videoReady && !hasError ? "opacity-0" : "opacity-100"
        }`}
        style={{ backgroundImage: "url('/images/space-hero.jpg')" }}
      />

      {/* Subtle Depth and Text Readability Overlays */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/40 via-transparent to-[#050608]/80 pointer-events-none" />
    </div>
  );
}
