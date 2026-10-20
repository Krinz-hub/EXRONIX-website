"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  addReview,
  getReviews,
  hasPurchasedProduct,
} from "@/lib/reviewService";

type Props = {
  productId: number;
};

export default function ProductReviews({
  productId,
}: Props) {
  const { user } = useAuth();

const [reviews, setReviews] = useState<any[]>([]);
const [rating, setRating] = useState(5);
const [review, setReview] = useState("");
const [canReview, setCanReview] = useState(false);

  async function loadReviews() {
    const data = await getReviews(productId);
    setReviews(data);
  }

 useEffect(() => {
  async function checkPurchase() {
    if (!user) return;

    const purchased = await hasPurchasedProduct(
      user.id,
      productId
    );

    setCanReview(purchased);
  }

  checkPurchase();
}, [user, productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      ) / reviews.length
    );
  }, [reviews]);

  async function submitReview() {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (!review.trim()) {
      toast.warning("Please write a review.");
      return;
    }

    try {
      await addReview(
        user.id,
        productId,
        rating,
        review
      );

      setReview("");
      setRating(5);

      loadReviews();

      toast.success("Review submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    }
  }

  return (
    <section className="mt-16 sm:mt-20 lg:mt-24 border-t border-white/10 pt-12 sm:pt-16">

      <div className="border-b border-white/10 pb-5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Customer Reviews
        </h2>
        <p className="mt-1.5 text-sm text-gray-400">
          Hardware evaluations and real-world feedback from verified EXRONIX users.
        </p>
      </div>

      {/* Rating Summary Banner */}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-5">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
            </span>

            <div>
              <div className="text-xl sm:text-2xl text-amber-400">
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}
              </div>

              <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-300">
                Based on {reviews.length} {reviews.length === 1 ? "verified review" : "verified reviews"}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Write a Review Form */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">

        <h3 className="text-lg sm:text-xl font-bold text-white">
          Write a Review
        </h3>

        <div className="mt-3">
          {canReview ? (
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Verified Purchase — You are eligible to submit a review for this hardware.
            </div>
          ) : (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
              <span className="font-semibold">Review Policy:</span> Only verified customers who have purchased this product from EXRONIX are eligible to submit a review.
            </div>
          )}
        </div>

        <div className="mt-5 space-y-4">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              disabled={!canReview}
              className="w-full max-w-xs rounded-xl border border-white/15 bg-[#0e1219] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition focus:border-[#1677FF] focus:outline-none focus:ring-1 focus:ring-[#1677FF] disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <option value={5} className="bg-[#0e1219] text-white">★★★★★ (5 / 5 - Exceptional)</option>
              <option value={4} className="bg-[#0e1219] text-white">★★★★☆ (4 / 5 - Very Good)</option>
              <option value={3} className="bg-[#0e1219] text-white">★★★☆☆ (3 / 5 - Average)</option>
              <option value={2} className="bg-[#0e1219] text-white">★★☆☆☆ (2 / 5 - Below Average)</option>
              <option value={1} className="bg-[#0e1219] text-white">★☆☆☆☆ (1 / 5 - Poor)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Review Details
            </label>
            <textarea
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={!canReview}
              placeholder={
                canReview
                  ? "Detail your performance experience, build quality, and switch responsiveness..."
                  : "Purchase this item to submit a review."
              }
              className="w-full rounded-xl border border-white/15 bg-[#0e1219]/90 p-4 text-sm text-white placeholder:text-gray-500 shadow-sm transition focus:border-[#1677FF] focus:outline-none focus:ring-1 focus:ring-[#1677FF] disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={submitReview}
            disabled={!canReview}
            className="rounded-xl bg-[#1677FF] px-7 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(22,119,255,0.3)] transition hover:bg-[#1677FF]/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
          >
            Submit Review
          </button>

        </div>

      </div>

      {/* Review List */}

      <div className="mt-8 space-y-4">

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
            <p className="text-sm font-bold text-gray-200">
              No reviews yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Be the first verified customer to test and evaluate this product.
            </p>
          </div>
        ) : (
          reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-base text-amber-400">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  ✔ Verified Purchase
                </span>
              </div>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-200">
                {item.review}
              </p>

              <p className="mt-3 text-xs font-medium text-gray-400">
                {new Date(
                  item.created_at
                ).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))
        )}

      </div>

    </section>
  );
}