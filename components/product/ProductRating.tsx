"use client";

import { useEffect, useState } from "react";
import { getReviews } from "@/lib/reviewService";
import LoadingAnimation from "@/components/LoadingAnimation";

type ProductRatingProps = {
  productId: number;
};

export default function ProductRating({
  productId,
}: ProductRatingProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadRating() {
      try {
        const reviews = await getReviews(productId);

        if (!mounted) return;

        if (!reviews || reviews.length === 0) {
          setAverageRating(0);
          setReviewCount(0);
          return;
        }

        const total = reviews.reduce(
          (sum: number, item: any) =>
            sum + Number(item.rating || 0),
          0
        );

        const average = total / reviews.length;

        setAverageRating(average);
        setReviewCount(reviews.length);
      } catch (error) {
        console.error(
          "Failed to load product rating:",
          error
        );

        if (mounted) {
          setAverageRating(0);
          setReviewCount(0);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRating();

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2.5 sm:mt-5 text-xs text-white/50">
        <LoadingAnimation size="xs" />
        <span className="font-mono uppercase tracking-wider text-[11px] text-white/40">CALCULATING METRICS</span>
      </div>
    );
  }

  // No reviews yet
  if (reviewCount === 0) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
        <div
          className="text-sm tracking-wide text-gray-300 sm:text-base"
          aria-label="No reviews yet"
        >
          ☆☆☆☆☆
        </div>

        <span className="text-xs text-gray-500 sm:text-sm">
          No Reviews Yet
        </span>
      </div>
    );
  }

  const roundedRating = Math.round(averageRating);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
      <div
        className="text-sm tracking-wide text-yellow-500 sm:text-base"
        aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
      >
        {"★".repeat(roundedRating)}
        {"☆".repeat(5 - roundedRating)}
      </div>

      <span className="text-xs text-gray-500 sm:text-sm">
        {averageRating.toFixed(1)} ({reviewCount}{" "}
        {reviewCount === 1 ? "Review" : "Reviews"})
      </span>
    </div>
  );
}